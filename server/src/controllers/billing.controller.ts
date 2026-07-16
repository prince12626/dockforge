import type { Request, Response } from "express";
import { getBillingOverviewService } from "../services/billing.service.js";

export const getBillingOverview = async (req: Request, res: Response) => {
      try {
            const user = req.user!;

            const billing = await getBillingOverviewService(user.id);

            return res.status(200).json({
                  success: true,
                  data: billing,
            });
      } catch (error) {
            console.error("[GET BILLING]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};
