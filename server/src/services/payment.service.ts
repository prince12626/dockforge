import crypto from "crypto";
import { Types } from "mongoose";
import { Payment } from "../models/payment.model.js";
import { razorpay } from "../config/razorpay.config.js";

interface CreateOrder {
  amount: number;
  receipt: string;
}

interface CreatePendingPayment {
  userId: string;
  planId: Types.ObjectId;
  orderId: string;
  receipt: string;
  amount: number;
}

interface MarkPaymentSuccess {
  paymentId: Types.ObjectId;
  razorpayPaymentId: string;
  signature: string;
}

export async function createOrder(data: CreateOrder) {
  return await razorpay.orders.create({
    amount: data.amount * 100,
    currency: "INR",
    receipt: data.receipt,
  });
}

export async function createPendingPayment(data: CreatePendingPayment) {
  // Remove previous pending payment for this user
  await Payment.deleteMany({
    userId: data.userId,
    status: "pending",
  });

  return await Payment.create({
    userId: data.userId,
    planId: data.planId,
    orderId: data.orderId,
    receipt: data.receipt!,
    amount: data.amount,
    currency: "INR",
    status: "pending",
  });
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}

export async function getPendingPayment(orderId: string) {
  return await Payment.findOne({
    orderId,
    status: "pending",
  });
}

export async function markPaymentSuccess(data: MarkPaymentSuccess) {
  return await Payment.findByIdAndUpdate(
    data.paymentId,
    {
      paymentId: data.razorpayPaymentId,
      signature: data.signature,
      status: "success",
    },
    {
      new: true,
    },
  );
}

export async function markPaymentFailed(paymentId: Types.ObjectId) {
  return await Payment.findByIdAndUpdate(
    paymentId,
    {
      status: "failed",
    },
    {
      new: true,
    },
  );
}
