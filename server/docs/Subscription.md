# Subscription

## Description

The subscription module exposes the active subscription lookup behavior used by the subscription middleware and the subscription controller. It is responsible for returning the currently active and non-expired subscription for a user.

## Endpoint

- `GET /api/v1/subscriptions` (the current router does not expose this route directly; the controller is not mounted in the main router)

## Method

- `GET`

## Authentication Required

Yes, based on the controller’s implementation.

## Middleware Used

- None in the controller itself.

## Request Body

- None.

## URL Parameters

- None.

## Query Parameters

- None.

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Responses

- `401 Login or Create Account first!`

## Business Rules

- Only a currently active subscription with an expiration date in the future is considered active.
- The subscription service populates the referenced plan document.

## Flow

1. The controller checks for an authenticated user.
2. It loads the active subscription for the user.
3. It returns the subscription data in the response.

## Notes

This controller is present in the codebase but is not currently attached to the main router structure, so it is not reachable through the current route configuration.