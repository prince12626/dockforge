import type { Request, Response } from "express";
import { getBillingOverviewService } from "../services/billing.service.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { redis } from "../config/redis.config.js";

export const getBillingOverview = asyncHandler(
      async (req: Request, res: Response) => {
            const user = req.user!;
            const cacheKey = `billing:${user.id}`;

            try {
                  const cached = await redis.get(cacheKey);

                  if (cached) {
                        return res.status(200).json({
                              success: true,
                              data: JSON.parse(cached),
                        });
                  }
            } catch (err) {
                  console.error("Redis GET Error:", err);
            }

            const billing = await getBillingOverviewService(user.id);

            try {
                  await redis.set(cacheKey, JSON.stringify(billing), {
                        EX: 120, // 2 minutes
                  });
            } catch (err) {
                  console.error("Redis SET Error:", err);
            }

            return res.status(200).json({
                  success: true,
                  data: billing,
            });
      },
);
