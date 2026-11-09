import type { Request, Response, NextFunction } from "express";

import { auth } from "../config/better-auth.config.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const headers = new Headers();
    const cookie = req.get("cookie");

    if (cookie) {
      headers.set("cookie", cookie);
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
  } catch {
    return res.status(500).json({
      message: "Authentication service unavailable",
    });
  }
};
