import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware.js";

const adminUserIds = new Set(
  (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
);

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authMiddleware(req, res, () => {
    const user = req.user as
      | (typeof req.user & { role?: string | string[] })
      | undefined;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const roles = Array.isArray(user.role) ? user.role : [user.role];

    const isAdmin =
      roles.includes("admin") ||
      roles.includes("superadmin") ||
      adminUserIds.has(user.id);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  });
};
