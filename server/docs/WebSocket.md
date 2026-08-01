# WebSocket and Terminal

## Description

The backend exposes Socket.IO namespaces for real-time communication. The main namespace is used for connection lifecycle logging, while the `/terminal` namespace provides terminal streaming into a VPS container.

## Endpoint / Namespace

- Main Socket.IO server
- `/terminal` namespace

## Authentication Required

Yes.

## Behavior

### Main Socket.IO Server

- Initializes the server with CORS settings.
- Applies authentication middleware using the Better Auth session.
- Stores the authenticated user ID in `socket.data.userId`.

### Terminal Namespace

- Requires a valid session and a `vpsId` query parameter.
- Verifies that the requested VPS belongs to the authenticated user.
- Attaches the container ID to the socket session.
- Starts an interactive Docker exec session for the container.
- Streams terminal output back to the client.
- Supports terminal input and resize events.

## Events

### Client to server

- `terminal-input`
- `terminal-resize`

### Server to client

- `terminal-output`

## Business Rules

- A user can only access the terminal for VPS instances that belong to them.
- Each container can have one active exec stream at a time.
- If a new terminal session starts for the same container, the existing stream is closed first.

## Flow

1. The client connects to the `/terminal` namespace.
2. The socket middleware authenticates the session and validates the VPS ownership.
3. The backend starts an exec session in the correct container.
4. Terminal output is emitted to the client in real time.
5. The session closes when the client disconnects or the stream ends.

## Notes

The current implementation uses Docker exec to provide an interactive shell experience and does not define a separate REST endpoint for terminal access.