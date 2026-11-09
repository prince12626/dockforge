# Docker Integration

## Description

The backend integrates with Docker through the Docker daemon socket to create, inspect, start, stop, restart, and remove containers for VPS instances.

## Main Components

- `utils/docker.ts`: creates the Docker client and exposes helpers for image existence checks, image pulling, and container creation.
- `services/docker.service.ts`: wraps Docker operations for the VPS workflow.
- `services/vps.service.ts`: uses Docker operations during the VPS lifecycle.

## Container Creation

The Docker service creates a container with:

- a generated name based on the user ID and timestamp,
- the selected image,
- a sleep infinity command,
- a TTY-enabled interactive shell,
- memory and CPU limits,
- a restart policy of `unless-stopped`,
- dropped `NET_RAW` capability.

## Image Handling

The utility checks whether the required image already exists locally. If it does not, it pulls it from the registry.

The `ubuntu-24` VPS option uses the custom `dockforge-vps:24.04` image, based on Ubuntu 24.04 and preloaded with Linux administration and development tools. Build this image on the Docker host used by the backend before creating Ubuntu 24 VPS instances:

```sh
cd server
npm run build:vps-image
```

The backend resolves `ubuntu-24` to this tag for new VPS instances. Building the image does not modify existing containers or VPS records.

## Container Lifecycle

The backend supports:

- `createContainer`
- `startContainer`
- `stopContainer`
- `restartContainer`
- `deleteContainer`
- `inspectContainer`

## Notes

The Docker integration is coupled to the VPS lifecycle. If a container creation fails after the container has been created but before the VPS record is persisted, the service attempts cleanup by deleting the partial container.