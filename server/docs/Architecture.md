# Backend Architecture

## Description

This backend is a Node.js/TypeScript service built with Express, Mongoose, Better Auth, Razorpay, Docker, and Socket.IO. It exposes REST endpoints under the `/api/v1` prefix and wires authentication, subscription checks, VPS lifecycle operations, billing, payments, and terminal access.

## Main Modules

- `app.ts`: creates the Express app, enables CORS, parses JSON, mounts the API router, and registers the global error handler.
- `index.ts`: starts the HTTP server, connects to MongoDB, and initializes Socket.IO.
- `routes/`: defines the REST route structure and attaches middleware to protected endpoints.
- `controllers/`: handles HTTP request parsing, validation logic, and response shaping.
- `services/`: contains the core business logic for VPS lifecycle management, plans, payments, subscriptions, billing, and Docker integration.
- `models/`: defines Mongoose schemas for plans, subscriptions, payments, and VPS records.
- `middlewares/`: enforces authentication, subscription access, and centralized error handling.
- `config/`: contains database, Better Auth, Razorpay, and Docker-related configuration.
- `sockets/`: manages Socket.IO namespaces and the terminal streaming workflow.

## Request Flow

1. A request reaches the Express app through `/api/v1`.
2. The relevant router handles the request and applies middleware such as authentication or subscription checks.
3. The controller reads request data and calls a service layer.
4. The service interacts with MongoDB and Docker as needed.
5. The controller returns a JSON response, and errors are passed to the centralized error handler.

## Integrations

### Database

MongoDB is connected through Mongoose in the database configuration module.

### Authentication

Better Auth is mounted under `/api/v1/authentication` and is used for session-based authentication.

### Payments

Razorpay is used for creating payment orders and verifying signatures.

### Container Management

The backend uses Docker via the Docker daemon socket to create, inspect, start, stop, restart, and remove containers.

### Real-Time Terminal Access

Socket.IO is initialized on the main server and exposes a dedicated `/terminal` namespace for terminal sessions.

## Notes

The current implementation uses manual checks in controllers and middleware rather than a dedicated validation layer. The business rules are enforced in the controller and service layers.