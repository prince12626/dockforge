import { Payment } from "../models/payment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Plan } from "../models/plan.model.js";
import { VPS } from "../models/vps.model.js";

export const getBillingOverviewService = async (userId: string) => {
  const [subscription, plans, payments, usedVps] = await Promise.all([
    Subscription.findOne({
      userId,
      status: "active",
    }).populate("planId"),

    Plan.find().sort({ price: 1 }),

    Payment.find({ userId }).sort({ createdAt: -1 }).populate("planId"),

    VPS.countDocuments({ userId }),
  ]);
  console.log(subscription);
  return {
    subscription,
    plans,
    payments,
    usage: {
      usedVps,
      maxVps: subscription?.planId ?? 0,
    },
  };
};
