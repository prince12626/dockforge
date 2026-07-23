import { type ContainerCreateOptions } from "dockerode";
import { docker, createDockerContainer } from "../utils/docker.js";

interface CreateContainerParams {
      name: string;
      image: string;
      cpu: number;
      memory: number;
      username: string;
}

export async function createContainer({
      name,
      image,
      cpu,
      memory,
      username,
}: CreateContainerParams) {
      const containerConfig: ContainerCreateOptions = {
            name,
            Image: image,
            Cmd: ["sleep", "infinity"],
            Hostname: username,
            Tty: true,
            OpenStdin: true,
            HostConfig: {
                  Memory: memory * 1024 * 1024,
                  NanoCpus: cpu * 1_000_000_000,
                  RestartPolicy: {
                        Name: "unless-stopped",
                  },
                  CapDrop: ["NET_RAW"],
            },
      };

      const container = await createDockerContainer(containerConfig);

      return {
            id: container.id,
            name,
            image,
      };
}

export async function stopContainer(id: string) {
      const container = docker.getContainer(id);

      await container.stop();

      return true;
}

export async function startContainer(containerId: string) {
      const container = docker.getContainer(containerId);
      await container.start();
      return container.inspect();
}

export async function restartContainer(containerId: string) {
      const container = docker.getContainer(containerId);

      await container.restart();

      return container.inspect();
}

export async function deleteContainer(containerId: string) {
      const container = docker.getContainer(containerId);

      await container.remove({
            force: true,
      });

      return true;
}

export async function inspectContainer(containerId: string) {
      const container = docker.getContainer(containerId);

      return container.inspect();
}
