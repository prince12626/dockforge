import type { Request, Response } from "express";
import { getActiveSubscription } from "../services/subscription.service.js";

export async function mySubscription(req: Request, res: Response) {
      if (!req.user) {
            return res.status(401).json({
                  status: "UNAUTHORISED",
                  message: "Login or Create Account first!",
            });
      }
      const userId = req.user.id;

      const subscription = await getActiveSubscription(userId);

      res.json({
            success: true,
            data: subscription,
      });
}
