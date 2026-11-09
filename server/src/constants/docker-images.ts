export const VPS_UBUNTU_IMAGE = "dockforge-vps:24.04";

export const DOCKER_IMAGES = {
  "ubuntu-24": VPS_UBUNTU_IMAGE,
  "ubuntu-22": "ubuntu:22.04",
  "ubuntu-20": "ubuntu:20.04",

  "debian-12": "debian:12-slim",
  "debian-11": "debian:11-slim",

  "alpine-3.21": "alpine:3.21",
  "alpine-3.19": "alpine:3.19",
} as const;

export type DockerImageKey = keyof typeof DOCKER_IMAGES;

export function getDockerImage(key: string): string | null {
  return DOCKER_IMAGES[key as DockerImageKey] ?? null;
}
