import type { Request, Response } from "express";
import { addDays } from "date-fns";
import * as planService from "../services/plan.service.js";
import * as paymentService from "../services/payment.service.js";
import * as subscriptionService from "../services/subscription.service.js";
import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { AppError } from "../utils/app-error.util.js";
import { redis } from "../config/redis.config.js";

export const selectPlan = asyncHandler(
      async (req: Request, res: Response): Promise<void> => {
            if (!req.user) {
                  throw new AppError("Login or Sign up first!", 401);
            }

            const planId = req.params.planId as string;
            const userId = req.user.id;

            const plan = await planService.getPlanById(planId);

            if (!plan) {
                  throw new AppError("Plan not found.", 404);
            }

            // FREE PLAN
            if (plan.price === 0) {
                  const expiresAt = addDays(new Date(), 14);

                  await subscriptionService.createSubscription({
                        userId,
                        planId: plan._id,
                        expiresAt,
                  });

                  // Invalidate subscription cache
                  await redis.del(`subscription:${userId}`);

                  res.status(200).json({
                        success: true,
                        message: "Free trial activated successfully.",
                  });
                  return;
            }

            // PAID PLAN
            const order = await paymentService.createOrder({
                  amount: plan.price,
                  receipt: `p_${Date.now()}`,
            });

            await Payment.deleteMany({
                  userId,
                  status: "pending",
            });

            await paymentService.createPendingPayment({
                  userId,
                  planId: plan._id,
                  orderId: order.id,
                  receipt: order.receipt!,
                  amount: plan.price,
            });

            res.status(200).json({
                  success: true,
                  paymentRequired: true,
                  key: process.env.RAZORPAY_API_KEY,
                  order,
            });
      };,
);

export const fetchPlans = asyncHandler(
      async (req: Request, res: Response): Promise<void> => {
            const cacheKey = "plans:all";

            try {
                  const cached = await redis.get(cacheKey);

                  if (cached) {
                        res.json({
                              data: JSON.parse(cached),
                        });
                  }
            } catch (err) {
                  console.error("Redis GET Error:", err);
            }

            const plans = await planService.getPlans();

            try {
                  await redis.set(cacheKey, JSON.stringify(plans), {
                        EX: 3600, // 1 hour
                  });
            } catch (err) {
                  console.error("Redis SET Error:", err);
            }

            res.json({
                  data: plans,
            });
      },
);
