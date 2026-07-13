# Middleware

Application-layer orchestration and cross-cutting concerns.

## Purpose

The middleware layer provides shared functionality used between raw HTTP transport and domain business logic. It is a **logical layer**, not a separately deployed microservice.

## Responsibilities

| Module | Purpose |
|--------|---------|
| `auth/` | JWT token verification and extraction |
| `validation/` | Request body/parameter validation |
| `authorization/` | Role/permission checks |
| `rate-limiting/` | Request throttling |
| `request-context/` | Request ID, timestamps, user context |
| `error-handling/` | Standardized error responses |
| `logging/` | Structured request/response logging |
| `idempotency/` | Idempotency keys for sensitive writes |
| `versioning/` | API version detection and routing |

## Architecture

Middleware functions are composed into a pipeline:

```
Request → Rate Limit → Auth → Validation → Authorization → Handler → Error Handler → Response
```

## Rules

- Middleware does NOT contain business logic — that belongs in backend services
- Each middleware module is independently usable
- Error handling should produce standardized error responses
- No secrets should be hardcoded — use environment configuration
