import { Types } from "mongoose";
import { VPS } from "../models/vps.model.js";
import {
  startContainer,
  stopContainer,
  restartContainer,
  inspectContainer,
  deleteContainer,
} from "./docker.service.js";
import { redis } from "../config/redis.config.js";
import { AppError } from "../utils/app-error.util.js";

type VpsStatus =
  | "creating"
  | "running"
  | "stopped"
  | "restarting"
  | "error"
  | "deleted";

function validateVpsId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid VPS id", 400);
  }
}

async function findVps(id: string) {
  validateVpsId(id);

  const vps = await VPS.findOne({
    _id: new Types.ObjectId(id),
    status: { $ne: "deleted" },
  }).lean();

  if (!vps) {
    throw new AppError("VPS not found", 404);
  }

  return vps;
}

async function invalidateUserCache(userId: string) {
  await redis.del(`user:${userId}:vps`);
}

export async function getAllVpsService(options: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) {
  const { page, limit, search, status } = options;

  const filter: Record<string, any> = {
    status: { $ne: "deleted" },
  };

  if (
    status &&
    ["creating", "running", "stopped", "restarting", "error"].includes(status)
  ) {
    filter.status = status;
  }

  if (search?.trim()) {
    const value = search.trim();
    const conditions: Record<string, any>[] = [
      { name: { $regex: value, $options: "i" } },
    ];

    if (Types.ObjectId.isValid(value)) {
      conditions.push({ _id: new Types.ObjectId(value) });
      conditions.push({ userId: new Types.ObjectId(value) });
    }

    filter.$or = conditions;
  }

  const skip = (page - 1) * limit;

  const [vps, total] = await Promise.all([
    VPS.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    VPS.countDocuments(filter),
  ]);

  return {
    vps,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + vps.length < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getAdminVpsStatsService() {
  const [total, running, stopped, creating, restarting] = await Promise.all([
    VPS.countDocuments({ status: "running" }),
    VPS.countDocuments({ status: "stopped" }),
    VPS.countDocuments({ status: "creating" }),
    VPS.countDocuments({ status: "restarting" }),
    VPS.countDocuments({ status: "error" }),
  ]);

  return {
    total,
    running,
    stopped,
    creating,
    restarting,
  };
}

export async function getAdminVpsByIdService(id: string) {
  const vps = await findVps(id);

  let runtime = {
    running: false,
    status: "unknown",
  } as Record<string, any>;

  if (vps.container?.id) {
    try {
      const inspect = await inspectContainer(vps.container.id);

      runtime = {
        running: inspect.State.Running,
        status: inspect.State.Status,
        pid: inspect.State.Pid,
        startedAt: inspect.State.StartedAt,
        finishedAt: inspect.State.FinishedAt,
        exitCode: inspect.State.ExitCode,
        restarting: inspect.State.Restarting,
        oomKilled: inspect.State.OOMKilled,
        paused: inspect.State.Paused,
      };
    } catch {
      runtime.status = "unavailable";
    }
  }

  return { ...vps, runtime };
}

export async function adminStartVpsService(id: string) {
  const vps = await findVps(id);

  if (!vps.container?.id) {
    throw new AppError("Container not found", 404);
  }

  const inspect = await startContainer(vps.container.id);

  const updated = await VPS.findByIdAndUpdate(
    id,
    {
      status: inspect.State.Status as VpsStatus,
      lastStartedAt: new Date(),
    },
    { new: true },
  ).select("-__v");

  await invalidateUserCache(vps.userId.toString());

  return updated;
}

export async function adminStopVpsService(id: string) {
  const vps = await findVps(id);

  if (!vps.container?.id) {
    throw new AppError("Container not found", 404);
  }

  await stopContainer(vps.container.id);

  const updated = await VPS.findByIdAndUpdate(
    id,
    { status: "stopped" },
    { new: true },
  ).select("-__v");

  await invalidateUserCache(vps.userId.toString());

  return updated;
}

export async function adminRestartVpsService(id: string) {
  const vps = await findVps(id);

  if (!vps.container?.id) {
    throw new AppError("Container not found", 404);
  }

  const inspect = await restartContainer(vps.container.id);

  const updated = await VPS.findByIdAndUpdate(
    id,
    {
      status: inspect.State.Status as VpsStatus,
      lastStartedAt: new Date(),
    },
    { new: true },
  ).select("-__v");

  await invalidateUserCache(vps.userId.toString());

  return updated;
}

export async function adminDeleteVpsService(id: string) {
  const vps = await findVps(id);

  if (vps.container?.id) {
    await deleteContainer(vps.container.id);
  }

  await VPS.findByIdAndUpdate(id, {
    status: "deleted",
  });

  await invalidateUserCache(vps.userId.toString());

  return true;
}
