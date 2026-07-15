import type { Request, Response } from "express";
import { addDays } from "date-fns";

import * as planService from "../services/plan.service.js";
import * as paymentService from "../services/payment.service.js";
import * as subscriptionService from "../services/subscription.service.js";
import { Payment } from "../models/payment.model.js";

export async function selectPlan(req: Request, res: Response) {
      try {
            if (!req.user) {
                  return res.status(401).json({
                        success: false,
                        message: "Login or Sign up first!",
                  });
            }

            const planId = req.params.planId as string;
            const userId = req.user.id;

            const plan = await planService.getPlanById(planId);

            if (!plan) {
                  return res.status(404).json({
                        success: false,
                        message: "Plan not found.",
                  });
            }

            // FREE PLAN
            if (plan.price === 0) {
                  const expiresAt = addDays(new Date(), 14);

                  await subscriptionService.createSubscription({
                        userId,
                        planId: plan._id,
                        expiresAt,
                  });

                  return res.status(200).json({
                        success: true,
                        message: "Free trial activated successfully.",
                  });
            }
            console.log(userId);
            // PAID PLAN
            const order = await paymentService.createOrder({
                  amount: plan.price,
                  receipt: `p_${Date.now()}`,
            });
            await Payment.deleteMany({
                  userId,
                  status: "pending",
            });
            // Save pending payment
            await paymentService.createPendingPayment({
                  userId,
                  planId: plan._id,
                  orderId: order.id,
                  receipt: order.receipt,
                  amount: plan.price,
            });

            return res.status(200).json({
                  success: true,
                  paymentRequired: true,
                  key: process.env.RAZORPAY_API_KEY,
                  order,
            });
      } catch (error) {
            console.error(error);

            return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
}

export async function fetchPlans(req: Request, res: Response) {
      try {
            const plans = await planService.getPlans();
            return res.json({
                  data: plans,
            });
      } catch (error) {}
}