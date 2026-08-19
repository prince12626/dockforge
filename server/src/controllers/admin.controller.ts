import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";

export const getDashboard = asyncHandler(
      async (req: Request, res: Response) => {
            // TODO: const dashboard = await getDashboardService();

            return res.status(200).json({
                  success: true,
                  message: "Dashboard fetched successfully",
                  data: {},
            });
      },
);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
      // TODO: const users = await getUsersService(req.query);

      return res.status(200).json({
            success: true,
            data: [],
      });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: const user = await getUserService(id);

      return res.status(200).json({
            success: true,
            data: {},
      });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: const user = await updateUserService(id, req.body);

      return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {},
      });
});

export const banUser = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await banUserService(id);

      return res.status(200).json({
            success: true,
            message: "User banned successfully",
      });
});

export const unbanUser = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await unbanUserService(id);

      return res.status(200).json({
            success: true,
            message: "User unbanned successfully",
      });
});

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
      // TODO: const plans = await getPlansService();

      return res.status(200).json({
            success: true,
            data: [],
      });
});

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
      // TODO: const plan = await createPlanService(req.body);

      return res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: {},
      });
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: const plan = await updatePlanService(id, req.body);

      return res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: {},
      });
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await deletePlanService(id);

      return res.status(200).json({
            success: true,
            message: "Plan deleted successfully",
      });
});

export const getSubscriptions = asyncHandler(
      async (req: Request, res: Response) => {
            // TODO: const subscriptions = await getSubscriptionsService(req.query);

            return res.status(200).json({
                  success: true,
                  data: [],
            });
      },
);

export const getVps = asyncHandler(async (req: Request, res: Response) => {
      // TODO: const vps = await getAllVpsService(req.query);

      return res.status(200).json({
            success: true,
            data: [],
      });
});

export const getVpsById = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: const vps = await getVpsByIdService(id);

      return res.status(200).json({
            success: true,
            data: {},
      });
});

export const startVps = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await startVpsService(id);

      return res.status(200).json({
            success: true,
            message: "VPS started successfully",
      });
});

export const stopVps = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await stopVpsService(id);

      return res.status(200).json({
            success: true,
            message: "VPS stopped successfully",
      });
});

export const restartVps = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await restartVpsService(id);

      return res.status(200).json({
            success: true,
            message: "VPS restarted successfully",
      });
});

export const deleteVps = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      // TODO: await deleteVpsService(id);

      return res.status(200).json({
            success: true,
            message: "VPS deleted successfully",
      });
});
