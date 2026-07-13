# Backend Architecture

## Overview
Express.js API server with layered architecture.

## Request Flow
```
HTTP Request → Middleware Pipeline → Route → Controller → Service → Repository → Database
```

## Key Patterns
- Route/Controller/Service/Repository separation
- Typed error classes
- Environment-based configuration
- JWT authentication (guest + refresh)

See `backend/README.md` for full structure.
