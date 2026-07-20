import { Schema, model, Types } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    planId: {
      type: Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      unique: true,
    },

    signature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    receipt: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model("Payment", paymentSchema);
