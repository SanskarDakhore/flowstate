# Backend Middleware Adapters

This directory is reserved for Express-specific adapters, configuration, and composition used directly by the backend runtime.

## Responsibility Boundary
- **reusable middleware logic** (auth checks, rate limiting rules, generic error mapping, etc.) belongs in the root `middleware/` package.
- **Express-specific bindings, local configurations, and route-specific ordering** belong in this folder (`backend/src/middleware/`).

Do not implement duplicate middleware logic here. Always import from the `middleware` package where possible.
