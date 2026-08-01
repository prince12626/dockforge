# Authentication

## Description

Authentication is handled by Better Auth and mounted under the `/api/v1/authentication` base path. The backend also uses a custom Express middleware to verify the current session before allowing access to protected routes.

## Endpoint

- `/api/v1/authentication/*`

## Method

The local code does not define custom authentication handlers for each endpoint. Instead, the router delegates authentication requests to Better Auth through its Node handler.

## Authentication Required

- Protected routes require a valid session.
- The session is checked by the `authMiddleware` middleware.

## Middleware Used

- `authMiddleware`

## Request Body

- Not defined in the local code for the custom middleware.
- Better Auth handles its own request payloads for authentication endpoints.

## URL Parameters

- None in the local middleware implementation.

## Query Parameters

- None in the local middleware implementation.

## Success Response

For the custom middleware, a successful authentication flow attaches the authenticated user to `req.user` and passes control to the next middleware or handler.

## Error Responses

- `401 Unauthorized`: no session was found.
- `401 Invalid session`: an exception occurred while resolving the session.

## Business Rules

- Sessions are resolved from request headers using the Better Auth API.
- The implementation expects authentication headers to be present in the request.
- In production, the authentication configuration enables cross-subdomain cookies and secure cookies.

## Flow

1. The request reaches `authMiddleware`.
2. The middleware converts request headers into a `Headers` object.
3. It calls `auth.api.getSession`.
4. If a session is found, `req.user` is populated.
5. If not, the request is rejected with a `401` response.

## Notes

The current backend relies on Better Auth for session creation and management rather than implementing its own JWT or session store.