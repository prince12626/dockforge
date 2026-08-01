# Middleware

## Description

The backend uses Express middleware to enforce authentication, subscription access, and centralized error handling.

## Authentication Middleware

### Purpose

The `authMiddleware` middleware resolves the current Better Auth session from the request headers and populates `req.user`.

### Behavior

- It converts request headers into a `Headers` instance.
- It calls `auth.api.getSession`.
- On success, it sets `req.user`.
- On failure, it returns `401` with a message of either `Unauthorized` or `Invalid session`.

## Subscription Middleware

### Purpose

The `requireSubscription` middleware ensures a user has an active subscription before accessing protected features such as VPS creation.

### Behavior

- It checks for the presence of `req.user`.
- It calls the subscription service to find an active subscription.
- It assigns the result to `req.subscription`.
- If no active subscription exists, it returns `403` with the message `Please choose a plan`.

## Error Middleware

### Purpose

The `errorHandler` middleware formats thrown errors into a standard JSON response.

### Behavior

- It logs the error.
- It returns `success: false` and a message field.
- It uses `err.statusCode` if present; otherwise it falls back to `500`.

## Notes

These middleware layers are attached at the application level or route level depending on the feature.