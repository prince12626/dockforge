import { restartContainer, stopContainer } from "./docker.service.js";
import { Types } from "mongoose";
import { VPS } from "../models/vps.model.js";
import {
  createContainer,
  inspectContainer,
  deleteContainer,
} from "./docker.service.js";
import { startContainer } from "./docker.service.js";

export interface CreateVpsInput {
  userId: string;
  name: string;
  image: string;

  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

export async function createVpsService({
  userId,
  name,
  image,
  resources,
}: CreateVpsInput) {
  let containerId: string | null = null;

  try {
    const containerName = `vps-${userId}-${Date.now()}`;

    const container = await createContainer({
      name: containerName,
      image,
      cpu: resources.cpu,
      memory: resources.memory,
    });

    containerId = container.id;

    const vps = await VPS.create({
      userId: new Types.ObjectId(userId),

      name,

      os: image,

      status: "running",

      container: {
        id: container.id,
        name: containerName,
        image,
      },

      resources,

      lastStartedAt: new Date(),
    });

    return vps;
  } catch (error) {
    if (containerId) {
      try {
        await deleteContainer(containerId);
      } catch (cleanupError) {
        console.error("[DOCKER CLEANUP FAILED]", cleanupError);
      }
    }

    throw error;
  }
}

export async function getUserVpsService(userId: string) {
  return VPS.find({
    userId: new Types.ObjectId(userId),

    status: {
      $ne: "deleted",
    },
  })
    .select("-__v")
    .sort({
      createdAt: -1,
    })
    .lean();
}

export async function getUserVpsByIdService(vpsId: string, userId: string) {
  return VPS.findOne({
    _id: vpsId,

    userId: new Types.ObjectId(userId),

    status: {
      $ne: "deleted",
    },
  }).lean();
}

export async function getVpsByIdService(userId: string, vpsId: string) {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(vpsId)) {
    return null;
  }

  return VPS.findOne({
    _id: new Types.ObjectId(vpsId),

    userId: new Types.ObjectId(userId),

    status: {
      $ne: "deleted",
    },
  })
    .select("-__v")
    .lean();
}

export async function getVpsWithRuntimeService(userId: string, vpsId: string) {
  const vps = await getVpsByIdService(userId, vpsId);
  if (!vps) {
    return null;
  }
  try {
    if (!vps.container?.id) {
      throw new Error("Container not found for this VPS");
    }

    const inspect = await inspectContainer(vps.container.id);
    return {
      ...vps,
      runtime: {
        running: inspect.State.Running,
        status: inspect.State.Status,
        pid: inspect.State.Pid,
        startedAt: inspect.State.StartedAt,
        finishedAt: inspect.State.FinishedAt,
        exitCode: inspect.State.ExitCode,
        restarting: inspect.State.Restarting,
        oomKilled: inspect.State.OOMKilled,
        paused: inspect.State.Paused,
      },
    };
  } catch {
    return {
      ...vps,
      runtime: {
        running: false,
        status: "unknown",
      },
    };
  }
}

export async function stopVpsService(userId: string, vpsId: string) {
  const vps = await getVpsByIdService(userId, vpsId);

  if (!vps) {
    return null;
  }

  if (!vps.container?.id) {
    throw new Error("Container not found");
  }

  await stopContainer(vps.container.id);

  const updatedVps = await VPS.findOneAndUpdate(
    {
      _id: vpsId,
      userId,
    },
    {
      status: "stopped",
    },
    {
      new: true,
    },
  );

  return updatedVps;
}

export async function startVpsService(userId: string, vpsId: string) {
  const vps = await getVpsByIdService(userId, vpsId);
  if (!vps) {
    return null;
  }
  if (!vps.container?.id) {
    throw new Error("Container not found");
  }
  const inspect = await startContainer(vps.container.id);
  const updatedVps = await VPS.findOneAndUpdate(
    {
      _id: vpsId,
      userId,
    },
    {
      status: inspect.State.Status,
      lastStartedAt: new Date(),
    },
    {
      new: true,
    },
  );
  return updatedVps;
}

export async function restartVpsService(userId: string, vpsId: string) {
  const vps = await getVpsByIdService(userId, vpsId);

  if (!vps) {
    return null;
  }

  if (!vps.container?.id) {
    throw new Error("Container not found");
  }

  const inspect = await restartContainer(vps.container.id);

  await VPS.updateOne(
    {
      _id: vpsId,
    },
    {
      status: inspect.State.Status,
      lastStartedAt: new Date(),
    },
  );

  return inspect.State;
}

export async function deleteVpsService(userId: string, vpsId: string) {
  const vps = await getVpsByIdService(userId, vpsId);

  if (!vps) {
    return null;
  }

  if (vps.container?.id) {
    await deleteContainer(vps.container.id);
  }

  await VPS.updateOne(
    {
      _id: vpsId,
    },
    {
      status: "deleted",
    },
  );

  return true;
}
