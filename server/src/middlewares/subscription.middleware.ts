import type { NextFunction, Request, Response } from "express";
import { getActiveSubscription } from "../services/subscription.service.js";

export async function requireSubscription(
      req: Request,
      res: Response,
      next: NextFunction,
) {
      if (!req.user) {
            return res.status(401).json({
                  status: "UNAUTHORISED",
                  message: "Login or Sign up first!",
            });
      }
      const subscription = await getActiveSubscription(req.user.id);

      req.subscription = subscription;
      if (!subscription) {
            return res.status(403).json({
                  message: "Please choose a plan",
            });
      }

      next();
}
