# Services

Business logic and domain operations. Services are called by controllers.

Services must:
- Implement business rules and domain logic
- Orchestrate calls to repositories
- Return domain objects, not HTTP responses

Services must NOT:
- Access HTTP request/response objects
- Return status codes
- Import Express types
