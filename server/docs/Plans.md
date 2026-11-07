# Plans

## Description

The plans module exposes the available subscription plans and allows authenticated users to select a plan. Plan selection supports free-plan activation and paid-plan checkout through Razorpay.

## Endpoint

- `GET /api/v1/plans/`
- `POST /api/v1/plans/:planId/select`

## Method

- `GET`, `POST`

## Authentication Required

- `GET /plans` does not require authentication.
- `POST /plans/:planId/select` requires authentication.

## Middleware Used

- `authMiddleware` for plan selection.

## Request Body

- No request body is required for plan selection.

## URL Parameters

- `planId`: the MongoDB ObjectId of the plan to select.

## Query Parameters

- None.

## Success Response

### Fetch Plans

```json
{
  "data": []
}
```

### Select Free Plan

```json
{
  "success": true,
  "message": "Free trial activated successfully."
}
```

### Select Paid Plan

```json
{
  "success": true,
  "paymentRequired": true,
  "key": "<razorpay-public-key>",
  "order": {}
}
```

## Error Responses

- `401 Login or Sign up first!`
- `404 Plan not found.`

## Business Rules

- Free plans create a subscription that expires in 14 days.
- Paid plans create a Razorpay order and store a pending payment record.
- Existing pending payments for the same user are removed before a new pending payment is created.

## Flow

1. The controller loads the requested plan by ID.
2. If the plan is free, it creates a subscription immediately.
3. If the plan is paid, it creates a Razorpay order and a pending payment document.
4. The response either confirms the free trial or returns the Razorpay order details for checkout.

## Notes

The current implementation retrieves plans ordered by price in ascending order.