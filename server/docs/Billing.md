# Billing

## Description

The billing module aggregates the active subscription, available plans, payment history, and VPS usage count for the authenticated user.

## Endpoint

- `GET /api/v1/billing/`

## Method

- `GET`

## Authentication Required

Yes.

## Middleware Used

- `authMiddleware`

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
  "data": {
    "subscription": {},
    "plans": [],
    "payments": [],
    "usage": {
      "usedVps": 0,
      "maxVps": 0
    }
  }
}
```

## Error Responses

- The current controller does not define explicit error responses beyond whatever the middleware or service layer throws.

## Business Rules

- The billing view loads subscription, plan, payment, and VPS usage data in parallel.
- The active subscription is populated with the plan details.
- The usage block reports the number of VPS records owned by the user and the maximum allowed VPS from the active plan.

## Flow

1. The controller reads the authenticated user.
2. It calls the billing service.
3. The service fetches the active subscription, all plans, payment history, and VPS count.
4. The controller returns the assembled billing overview.

## Notes

The implementation currently logs the subscription value to the console before returning the response.