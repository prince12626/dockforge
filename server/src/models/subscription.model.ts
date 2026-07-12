import { Schema, model, Types } from "mongoose";

const subscriptionSchema = new Schema({
      userId: {
            type: String, // Better Auth user id
            required: true,
      },

      planId: {
            type: Types.ObjectId,
            ref: "Plan",
      },

      status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
      },

      expiresAt: Date,
});

export const Subscription = model("Subscription", subscriptionSchema);
