# Controllers

Handle HTTP request/response. Delegate all business logic to services.

Controllers must:
- Parse and validate incoming request data
- Call appropriate service methods
- Format and return HTTP responses
- Handle HTTP-specific error mapping

Controllers must NOT:
- Query the database directly
- Contain business logic
- Import repository modules
