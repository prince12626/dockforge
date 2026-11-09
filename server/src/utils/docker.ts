import Docker, { type ContainerCreateOptions } from "dockerode";
import os from "node:os";
import type { Readable } from "stream";

export const docker = new Docker({
  socketPath: "/Users/princechaurasiya/.docker/run/docker.sock",
});

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
        return reject(err);
      }

      docker.modem.followProgress(stream, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

export async function createDockerContainer(options: ContainerCreateOptions) {
  await pullImage(options.Image!);

  const container = await docker.createContainer(options);

  await container.start();

  return container;
}
