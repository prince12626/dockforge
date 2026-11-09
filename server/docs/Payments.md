# Payments

## Description

The payments module verifies Razorpay payment signatures and converts a successful payment into an active subscription.

## Endpoint

- `POST /api/v1/payments/verify`

## Method

- `POST`

## Authentication Required

Yes.

## Middleware Used

- `authMiddleware`

## Request Body

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature"
}
```

## URL Parameters

- None.

## Query Parameters

- None.

## Success Response

```json
{
  "success": true,
  "message": "Payment verified successfully."
}
```

## Error Responses

- `400 Missing payment details.`
- `400 Payment verification failed.`
- `401 Unauthorized`
- `403 Forbidden.`
- `404 Pending payment not found.`

## Business Rules

- The controller looks up a pending payment using the Razorpay order ID.
- The pending payment must belong to the authenticated user.
- The signature is verified using the Razorpay secret and the HMAC SHA-256 algorithm.
- A failed verification marks the payment as `failed`.
- A successful verification marks the payment as `success` and creates a new subscription with a 30-day expiration window.

## Flow

1. The controller validates the authenticated user and the incoming Razorpay fields.
2. It retrieves the pending payment record.
3. It checks that the payment belongs to the current user.
4. It verifies the Razorpay signature.
5. It updates the payment status and creates a subscription.

## Notes

The current implementation does not expose a separate payment creation endpoint in the router; payment creation is performed as part of plan selection.