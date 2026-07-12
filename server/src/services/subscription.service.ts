import { Subscription } from "../models/subscription.model.js";

interface CreateSubscription {
      userId: string;
      planId: string;
      expiresAt: Date;
}

export async function createSubscription(data: CreateSubscription) {
      const subscription = await Subscription.create({
            userId: data.userId,
            planId: data.planId,
            expiresAt: data.expiresAt,
            status: "active",
      });

      return subscription;
}

export async function getUserSubscription(userId: string) {
      return await Subscription.findOne({
            userId,
            status: "active",
      })
            .populate("plan")
            .lean();
}
