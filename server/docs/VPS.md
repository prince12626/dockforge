# VPS Management

## Description

The VPS module manages virtual server creation, listing, status changes, and deletion. It uses the Docker integration to create containers and stores metadata in MongoDB.

## Endpoint

- `POST /api/v1/vps/`
- `GET /api/v1/vps/`
- `GET /api/v1/vps/stats/:id`
- `GET /api/v1/vps/:id`
- `POST /api/v1/vps/:id/start`
- `POST /api/v1/vps/:id/stop`
- `POST /api/v1/vps/:id/restart`
- `DELETE /api/v1/vps/:id`

## Method

- `POST`, `GET`, `DELETE`

## Authentication Required

Yes.

## Middleware Used

- `authMiddleware` for all VPS endpoints.
- `requireSubscription` for VPS creation.

## Request Body

### Create VPS

```json
{
  "name": "Example VPS",
  "os": "ubuntu-24",
  "resources": {
    "cpu": 1,
    "memory": 1024,
    "storage": 10
  }
}
```

## URL Parameters

- `id`: VPS identifier in MongoDB ObjectId format.

## Query Parameters

- None.

## Success Response

### Create VPS

```json
{
  "success": true,
  "message": "VPS created successfully.",
  "data": {}
}
```

### List VPS

```json
{
  "success": true,
  "count": 1,
  "data": []
}
```

## Error Responses

- `400 Missing required fields`
- `400 Invalid operating system.`
- `400 Invalid VPS id`
- `401 Unauthorized`
- `403 You need an active subscription to create a VPS.`
- `403 Your <plan> plan allows a maximum of <n> VPS.`
- `404 VPS not found`

## Business Rules

- A VPS can only be created by an authenticated user with an active subscription.
- The number of VPS instances is limited by the active plan’s `maxVps` value.
- Requested CPU, memory, and storage values are checked against the current plan limits.
- The Docker image is resolved from the configured image key map.
- The created VPS record stores the container metadata and resource settings.

## Flow

1. The controller validates the authenticated user and request payload.
2. It checks the current subscription and plan limits.
3. It resolves the requested operating system to a Docker image.
4. It calls the VPS service to create a Docker container and persist the VPS document.
5. The controller returns the created VPS record.

## Notes

The service layer enriches the returned VPS data with runtime information when retrieving a VPS by ID. If Docker inspection fails, the runtime section is populated with fallback values such as `running: false` and `status: "unknown"`.