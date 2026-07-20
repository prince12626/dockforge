import { Schema, model, Types } from "mongoose";

const subscriptionSchema = new Schema(
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

    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscription = model("Subscription", subscriptionSchema);
