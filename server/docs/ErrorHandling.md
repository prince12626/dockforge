# Error Handling

## Description

The backend uses a centralized Express error middleware to ensure thrown errors are returned in a consistent JSON structure.

## Error Handler

The `errorHandler` middleware is registered globally in the main Express application.

## Behavior

- Errors are logged to the console.
- The HTTP status is taken from `err.statusCode` when available.
- If no status is present, the server uses `500`.
- The response body contains:

```json
{
  "success": false,
  "message": "..."
}
```

## Common Error Sources

- Missing request data in controllers.
- Unauthorized or forbidden access.
- Invalid ObjectId values.
- Failed Docker operations.
- Failed payment verification.
- Missing or invalid subscriptions.

## Notes

The current implementation relies on thrown `AppError` instances and standard `Error` objects. Controllers use the `asyncHandler` utility so asynchronous errors are passed to the global error middleware.