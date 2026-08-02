import type { Request, Response } from "express";

import * as paymentService from "../services/payment.service.js";
import * as subscriptionService from "../services/subscription.service.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { AppError } from "../utils/app-error.util.js";
import { redis } from "../config/redis.config.js";

export const verifyPayment = asyncHandler(
      async (req: Request, res: Response): Promise<void> => {
            if (!req.user) {
                  throw new AppError("Unauthorized", 401);
            }

            const {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
            } = req.body;

            if (
                  !razorpay_order_id ||
                  !razorpay_payment_id ||
                  !razorpay_signature
            ) {
                  throw new AppError("Missing payment details.", 400);
            }

            const payment =
                  await paymentService.getPendingPayment(razorpay_order_id);

            if (!payment) {
                  throw new AppError("Pending payment not found.", 404);
            }

            // Prevent verifying another user's payment
            if (payment.userId !== req.user.id) {
                  throw new AppError("Forbidden.", 403);
            }

            const verified = paymentService.verifySignature(
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
            );

            if (!verified) {
                  await paymentService.markPaymentFailed(payment._id);
                  throw new AppError("Payment verification failed.", 400);
            }

            await paymentService.markPaymentSuccess({
                  paymentId: payment._id,
                  razorpayPaymentId: razorpay_payment_id,
                  signature: razorpay_signature,
            });

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            await subscriptionService.createSubscription({
                  userId: payment.userId,
                  planId: payment.planId,
                  expiresAt,
            });

            // Invalidate subscription cache
            try {
                  await redis.del(`subscription:${payment.userId}`);
            } catch (err) {
                  console.error("Redis DEL Error:", err);
            }

            res.status(200).json({
                  success: true,
                  message: "Payment verified successfully.",
            });
      },
);
