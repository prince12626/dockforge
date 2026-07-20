import type { Request, Response } from "express";
import { getBillingOverviewService } from "../services/billing.service.js";
import { asyncHandler } from "../utils/async-handler.util.js";

export const getBillingOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const billing = await getBillingOverviewService(user.id);

    return res.status(200).json({
      success: true,
      data: billing,
    });
  },
);
