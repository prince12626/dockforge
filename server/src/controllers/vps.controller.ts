import {
  deleteVpsService,
  getUserVpsService,
  getVpsWithRuntimeService,
  restartVpsService,
  startVpsService,
} from "../services/vps.service.js";
import type { Request, Response } from "express";
import { getDockerImage } from "../constants/docker-images.js";
import { createVpsService } from "../services/vps.service.js";
import { Types } from "mongoose";
import { stopVpsService } from "../services/vps.service.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { AppError } from "../utils/app-error.util.js";

function getUsernameFromName(name: string): string {
      const trimmed = name.trim();
      const parts = trimmed.split(/\s+/);
      if (parts.length > 1) {
            return parts[0].toLowerCase();
      }
      return parts[0].toLowerCase();
}

export const createVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, os, resources } = req.body;
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!name || !os || !resources) {
      throw new AppError("Missing required fields", 400);
    }

    const subscription = req.subscription;

    if (!subscription || subscription.status !== "active") {
      throw new AppError(
        "You need an active subscription to create a VPS.",
        403,
      );
    }

    const plan = subscription.planId;

    const userVps = await getUserVpsService(user.id);

    if (userVps.length >= plan.maxVps) {
      throw new AppError(
        `Your ${plan.name} plan allows a maximum of ${plan.maxVps} VPS.`,
        403,
      );
    }

    const image = getDockerImage(os);

    if (!image) {
      throw new AppError("Invalid operating system.", 400);
    }

    // Optional: Prevent requesting resources above the plan
    if (
      resources.cpu > plan.cpu ||
      resources.memory > plan.memory * 1024 ||
      resources.storage > plan.storage
    ) {
      throw new AppError(
        "Requested resources exceed your current plan limits.",
        400,
      );
    }

    const vps = await createVpsService({
          userId: user.id,
          name,
          image,
          username: getUsernameFromName(user.name),
          resources: {
                cpu: resources.cpu,
                memory: resources.memory,
                storage: resources.storage,
          },
    });

    res.status(201).json({
      success: true,
      message: "VPS created successfully.",
      data: vps,
    });
  },
);

export const getMyVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;

    const vps = await getUserVpsService(user.id);

    res.status(200).json({
      success: true,
      count: vps.length,
      data: vps,
    });
  },
);

export const getVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;

    const { id } = req.params as { id: string };

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid VPS id", 400);
    }

    const vps = await getVpsWithRuntimeService(user.id, id);

    if (!vps) {
      throw new AppError("VPS not found", 404);
    }

    res.status(200).json({
      success: true,
      data: vps,
    });
  },
);

export const stopVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const result = await stopVpsService(user.id, id);

    if (!result) {
      throw new AppError("VPS not found", 404);
    }

    res.json({
      success: true,
      message: "VPS stopped successfully",
      data: result,
    });
  },
);

export const startVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const result = await startVpsService(user.id, id);

    if (!result) {
      throw new AppError("VPS not found", 404);
    }

    res.json({
      success: true,
      message: "VPS started successfully",
      data: result,
    });
  },
);

export const restartVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const result = await restartVpsService(user.id, id);

    if (!result) {
      throw new AppError("VPS not found", 404);
    }

    res.json({
      success: true,
      message: "VPS restarted successfully",
      runtime: result,
    });
  },
);

export const deleteVps = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const deleted = await deleteVpsService(user.id, id);

    if (!deleted) {
      throw new AppError("VPS not found", 404);
    }

    res.json({
      success: true,
      message: "VPS deleted successfully",
    });
  },
);
