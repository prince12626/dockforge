import type { Request, Response } from "express";
import { getPlans } from "../services/plan.service.js";

export async function fetchPlans(req: Request, res: Response) {
      const plans = await getPlans();

      res.json({
            success: true,
            data: plans,
      });
}
