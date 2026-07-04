export const DOCKER_IMAGES = {
      "ubuntu-24": "ubuntu:24.04",
      "ubuntu-22": "ubuntu:22.04",
      "debian-12": "debian:12",
      alpine: "alpine:3.22",
} as const;

export type DockerImageKey = keyof typeof DOCKER_IMAGES;

export function getDockerImage(key: string): string | null {
      return DOCKER_IMAGES[key as DockerImageKey] ?? null;
}
