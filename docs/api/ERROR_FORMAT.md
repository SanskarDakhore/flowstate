# Error Format

All API errors return a standardized JSON response:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description.",
    "details": {},
    "requestId": "uuid"
  }
}
```

## Error Codes
See `shared/contracts/errors/error-codes.ts` for the full list.
