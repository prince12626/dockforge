import type { Request, Response, NextFunction } from "express";

import { auth } from "../config/better-auth.config.js";

export const authMiddleware = async (
      req: Request,
      res: Response,
      next: NextFunction,
) => {
      try {
            const headers = new Headers();

            for (const [key, value] of Object.entries(req.headers)) {
                  if (typeof value === "string") {
                        headers.set(key, value);
                  } else if (Array.isArray(value)) {
                        headers.set(key, value.join(","));
                  }
            }

            const session = await auth.api.getSession({
                  headers,
            });

            if (!session) {
                  return res.status(401).json({
                        message: "Unauthorized",
                  });
            }

            req.user = session.user;

            next();
      } catch (error) {
            console.log("[AUTH ERROR]", error);

            return res.status(401).json({
                  message: "Invalid session",
            });
      }
};
