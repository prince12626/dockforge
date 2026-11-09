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
- `500 Authentication service unavailable`: Better Auth could not verify the session.

## Business Rules

- Sessions are resolved from the request cookie using the Better Auth API; a cookie's presence alone does not authenticate a request.
- `BETTER_AUTH_URL` must be the backend origin and `CLIENT_URL` must be the exact frontend origin.
- The frontend sends credentialed requests to the backend. CORS allows the configured `CLIENT_URL` with credentials.
- In production, Better Auth enables secure cookies scoped to `.princechaurasiya.in` for cross-subdomain requests.
- The frontend route proxy checks Better Auth's `/get-session` endpoint before redirecting between authentication and protected routes.

## Flow

1. The request reaches `authMiddleware`.
2. The middleware forwards the request cookie to Better Auth.
3. It calls `auth.api.getSession`.
4. If a session is found, `req.user` is populated.
5. If no session is found, the request is rejected with `401`; if verification fails, the request returns `500`.

## Notes

The current backend relies on Better Auth for session creation and management rather than implementing its own JWT or session store.