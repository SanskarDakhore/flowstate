# Networking

API client layer for backend communication.

## Responsibility

- HTTP client for all backend API calls
- Centralized route definitions matching backend endpoints
- Request building with authentication headers
- Response parsing and error handling
- Retry logic for transient failures

## Key Files

- `ApiClient.cs` — HTTP client with GET/POST/PATCH support
- `ApiRoutes.cs` — Centralized endpoint definitions
- `RequestBuilder.cs` — Fluent request construction
- `ResponseHandler.cs` — Response parsing and error mapping

## Rules

- ApiRoutes must stay in sync with backend route definitions
- Networking does not contain business logic — it transports data
- Auth token is managed by the Authentication service, injected into ApiClient
- Gameplay must work offline — networking failures should be handled gracefully
