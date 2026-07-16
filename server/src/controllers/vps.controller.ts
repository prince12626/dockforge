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

export const createVps = async (req: Request, res: Response) => {
      try {
            const { name, os, resources } = req.body;
            const user = req.user;

            if (!user) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized",
                  });
            }

            if (!name || !os || !resources) {
                  return res.status(400).json({
                        success: false,
                        message: "Missing required fields",
                  });
            }

            const subscription = req.subscription;

            if (!subscription || subscription.status !== "active") {
                  return res.status(403).json({
                        success: false,
                        message: "You need an active subscription to create a VPS.",
                  });
            }

            const plan = subscription.planId;

            const userVps = await getUserVpsService(user.id);

            if (userVps.length >= plan.maxVps) {
                  return res.status(403).json({
                        success: false,
                        message: `Your ${plan.name} plan allows a maximum of ${plan.maxVps} VPS.`,
                  });
            }

            const image = getDockerImage(os);

            if (!image) {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid operating system.",
                  });
            }

            // Optional: Prevent requesting resources above the plan
            if (
                  resources.cpu > plan.cpu ||
                  resources.memory > plan.memory * 1024 ||
                  resources.storage > plan.storage
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "Requested resources exceed your current plan limits.",
                  });
            }

            const vps = await createVpsService({
                  userId: user.id,
                  name,
                  image,
                  resources: {
                        cpu: resources.cpu,
                        memory: resources.memory,
                        storage: resources.storage,
                  },
            });

            return res.status(201).json({
                  success: true,
                  message: "VPS created successfully.",
                  data: vps,
            });
      } catch (error) {
            console.error("[CREATE VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error.",
            });
      }
};

export const getMyVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;

            const vps = await getUserVpsService(user.id);

            return res.status(200).json({
                  success: true,
                  count: vps.length,
                  data: vps,
            });
      } catch (error) {
            console.error("[ERROR] GET USER VPS:", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};

export const getVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;

            const { id } = req.params as { id: string };

            if (!Types.ObjectId.isValid(id)) {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid VPS id",
                  });
            }

            const vps = await getVpsWithRuntimeService(user.id, id);

            if (!vps) {
                  return res.status(404).json({
                        success: false,
                        message: "VPS not found",
                  });
            }

            return res.status(200).json({
                  success: true,
                  data: vps,
            });
      } catch (error) {
            console.error("[GET VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};

export const stopVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;
            const { id } = req.params as { id: string };

            const result = await stopVpsService(user.id, id);

            if (!result) {
                  return res.status(404).json({
                        success: false,
                        message: "VPS not found",
                  });
            }

            return res.json({
                  success: true,
                  message: "VPS stopped successfully",
                  data: result,
            });
      } catch (error) {
            console.error("[STOP VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};

export const startVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;
            const { id } = req.params as { id: string };
            const result = await startVpsService(user.id, id);

            if (!result) {
                  return res.status(404).json({
                        success: false,
                        message: "VPS not found",
                  });
            }

            return res.json({
                  success: true,
                  message: "VPS started successfully",
                  data: result,
            });
      } catch (error) {
            console.error("[START VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};

export const restartVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;
            const { id } = req.params as { id: string };
            const result = await restartVpsService(user.id, id);

            if (!result) {
                  return res.status(404).json({
                        success: false,
                        message: "VPS not found",
                  });
            }

            return res.json({
                  success: true,
                  message: "VPS restarted successfully",
                  runtime: result,
            });
      } catch (error) {
            console.error("[RESTART VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};

export const deleteVps = async (req: Request, res: Response) => {
      try {
            const user = req.user!;
            const { id } = req.params as { id: string };
            const deleted = await deleteVpsService(user.id, id);

            if (!deleted) {
                  return res.status(404).json({
                        success: false,
                        message: "VPS not found",
                  });
            }

            return res.json({
                  success: true,
                  message: "VPS deleted successfully",
            });
      } catch (error) {
            console.error("[DELETE VPS]", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
};
