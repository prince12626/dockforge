import type { NextFunction, Request, Response } from "express";
import { getUserSubscription } from "../services/subscription.service.js";

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
      const subscription = await getUserSubscription(req.user.id);

      if (!subscription) {
            return res.status(403).json({
                  message: "Please choose a plan",
            });
      }

      next();
}
