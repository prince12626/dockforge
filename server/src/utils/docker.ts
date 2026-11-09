import Docker, { type ContainerCreateOptions } from "dockerode";
import os from "node:os";
import path from "node:path";
import type { Readable } from "node:stream";

function getDockerConfig() {
  // Allow custom Docker socket configuration
  if (process.env.DOCKER_SOCKET_PATH) {
    return {
      socketPath: process.env.DOCKER_SOCKET_PATH,
    };
  }

  switch (os.platform()) {
    case "darwin":
      return {
        socketPath: path.join(os.homedir(), ".docker", "run", "docker.sock"),
      };

    case "linux":
      // Docker Engine on Linux
      return {
        socketPath: "/var/run/docker.sock",
      };

    case "win32":
      // Docker Desktop on Windows
      return {
        socketPath: "//./pipe/docker_engine",
      };

    default:
      throw new Error(`Unsupported operating system: ${os.platform()}`);
  }
}

export const docker = new Docker(getDockerConfig());

export async function imageExists(image: string): Promise<boolean> {
  try {
    await docker.getImage(image).inspect();
    return true;
  } catch {
    return false;
  }
}

export async function pullImage(image: string): Promise<void> {
  if (await imageExists(image)) return;

  return new Promise((resolve, reject) => {
    docker.pull(image, (err: Error | null, stream: Readable | undefined) => {
      if (err || !stream) {
        return reject(err ?? new Error("Docker pull returned no stream"));
      }

      docker.modem.followProgress(stream, (progressError: Error | null) => {
        if (progressError) {
          reject(progressError);
        } else {
          resolve();
        }
      });
    });
  });
}

export async function createDockerContainer(options: ContainerCreateOptions) {
  if (!options.Image) {
    throw new Error("Docker image is required to create a container");
  }

  await pullImage(options.Image);

  const container = await docker.createContainer(options);

  await container.start();

  return container;
}
