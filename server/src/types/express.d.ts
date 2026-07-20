import "express";
import type { User } from "better-auth";
import type { ISubscription } from "./plan.type.ts";
import type { getActiveSubscription } from "../services/subscription.service.js";

type ActiveSubscription = Awaited<ReturnType<typeof getActiveSubscription>>;
declare global {
  namespace Express {
    interface Request {
      user?: User;
      subscription?: ActiveSubscription;
    }
  }
}

export {};
