import "express";
import type { User } from "better-auth";
import type { ISubscription } from "./plan.type.ts";

declare global {
      namespace Express {
            interface Request {
                  user?: User;
                  subscription?: ISubscription;
            }
      }
}

export {};
