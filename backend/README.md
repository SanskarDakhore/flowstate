# Backend

FLOWSTATE API server — Node.js + TypeScript + Express.

## Architecture

```
Routes → Controllers → Services → Repositories → Database
```

- **Routes** define HTTP endpoints and map to controllers
- **Controllers** handle request/response, delegate to services
- **Services** contain business logic and domain rules
- **Repositories** handle data access and persistence
- **Domain** contains entity definitions and business rules

## Running

```bash
npm install
npm run dev      # Development with hot reload
npm run build    # Compile TypeScript
npm start        # Run compiled output
```

## Testing

```bash
npm test              # All tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests
```

## API

All routes are versioned under `/api/v1/`. See `src/routes/` for endpoints.

The health endpoint (`GET /api/v1/health`) is functional and can be used for monitoring.

## Rules

- Controllers must not query the database directly
- Routes must not contain business logic
- Services must not return HTTP responses
- Database models must not become the entire domain model
