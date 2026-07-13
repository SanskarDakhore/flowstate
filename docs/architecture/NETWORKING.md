# Networking Architecture

## Client-Server Communication
- HTTP/HTTPS REST API
- JSON request/response bodies
- JWT Bearer token authentication
- Versioned endpoints (`/api/v1/`)

## Offline Support
- Core gameplay works without network
- Scores queued locally for later submission
- Config cached for offline use

## Error Handling
- Standardized error response format
- Retry logic for 5xx and 429 responses
- Automatic token refresh on 401
