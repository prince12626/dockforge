import { Types } from "mongoose";
import { Subscription } from "../models/subscription.model.js";

interface CreateSubscription {
      userId: string;
      planId: Types.ObjectId;
      expiresAt: Date;
}
export async function createSubscription(data: CreateSubscription) {
      // Purani active subscription expire kar do
      await Subscription.updateMany(
            {
                  userId: data.userId,
                  status: "active",
            },
            {
                  status: "expired",
            },
      );

      return await Subscription.create({
            userId: data.userId,
            planId: data.planId,
            expiresAt: data.expiresAt,
            status: "active",
      });
}

export async function getActiveSubscription(userId: string) {
      return await Subscription.findOne({
            userId,
            status: "active",
            expiresAt: {
                  $gt: new Date(),
            },
      })
            .populate("planId")
            .lean();
}

export async function cancelSubscription(userId: string) {
      return await Subscription.findOneAndUpdate(
            {
                  userId,
                  status: "active",
            },
            {
                  status: "cancelled",
            },
            {
                  new: true,
            },
      );
}

export async function expireSubscription(userId: string) {
      return await Subscription.findOneAndUpdate(
            {
                  userId,
                  status: "active",
            },
            {
                  status: "expired",
            },
            {
                  new: true,
            },
      );
}

export async function hasActiveSubscription(userId: string) {
      const subscription = await Subscription.exists({
            userId,
            status: "active",
            expiresAt: {
                  $gt: new Date(),
            },
      });

      return !!subscription;
}

export async function updateSubscriptionPlan(
      userId: string,
      planId: string,
      expiresAt: Date,
) {
      return await Subscription.findOneAndUpdate(
            {
                  userId,
                  status: "active",
            },
            {
                  planId,
                  expiresAt,
            },
            {
                  new: true,
            },
      );
}
