
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";
import { AppError } from "../utils/app-error.util.js";

import {
  getAllVpsService,
  getAdminVpsStatsService,
  getAdminVpsByIdService,
  adminStartVpsService,
  adminStopVpsService,
  adminRestartVpsService,
  adminDeleteVpsService,
} from "../services/admin-vps.service.js";

function getId(req: Request) {
  const { id } = req.params as { id: string };
  return id;
}

export const getAllAdminVps = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const result = await getAllVpsService({
      page,
      limit,
      search,
      status,
    });

    res.status(200).json({
      success: true,
      data: result.vps,
      pagination: result.pagination,
    });
  },
);

export const getAdminVpsStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getAdminVpsStatsService();

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);

export const getAdminVpsDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const vps = await getAdminVpsByIdService(getId(req));

    res.status(200).json({
      success: true,
      data: vps,
    });
  },
);

export const startAdminVps = asyncHandler(
  async (req: Request, res: Response) => {
    const vps = await adminStartVpsService(getId(req));

    res.status(200).json({
      success: true,
      message: "VPS started successfully",
      data: vps,
    });
  },
);

export const stopAdminVps = asyncHandler(
  async (req: Request, res: Response) => {
    const vps = await adminStopVpsService(getId(req));

    res.status(200).json({
      success: true,
      message: "VPS stopped successfully",
      data: vps,
    });
  },
);

export const restartAdminVps = asyncHandler(
  async (req: Request, res: Response) => {
    const vps = await adminRestartVpsService(getId(req));

    res.status(200).json({
      success: true,
      message: "VPS restarted successfully",
      data: vps,
    });
  },
);

export const deleteAdminVps = asyncHandler(
  async (req: Request, res: Response) => {
    await adminDeleteVpsService(getId(req));

    res.status(200).json({
      success: true,
      message: "VPS deleted successfully",
    });
  },
);
