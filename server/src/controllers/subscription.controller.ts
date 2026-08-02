import type { Request, Response } from "express";
import { getActiveSubscription } from "../services/subscription.service.js";
import { redis } from "../config/redis.config.js";

export async function mySubscription(req: Request, res: Response) {
      if (!req.user) {
            return res.status(401).json({
                  status: "UNAUTHORISED",
                  message: "Login or Create Account first!",
            });
      }

      const userId = req.user.id;
      const cacheKey = `subscription:${userId}`;

      try {
            const cached = await redis.get(cacheKey);

            if (cached) {
                  return res.json({
                        success: true,
                        data: JSON.parse(cached),
                  });
            }
      } catch (err) {
            console.error("Redis GET Error:", err);
      }

      const subscription = await getActiveSubscription(userId);

      try {
            if (subscription) {
                  await redis.set(cacheKey, JSON.stringify(subscription), {
                        EX: 300,
                  });
            }
      } catch (err) {
            console.error("Redis SET Error:", err);
      }

      return res.json({
            success: true,
            data: subscription,
      });
}