# Shared Contracts (@flowstate/shared)

Cross-layer contracts, schemas, constants, and enums shared between frontend TypeScript packages and backend API servers.

## Purpose

Define interfaces and data structures that must remain consistent across client and server. These are the agreed-upon shapes of data exchanged across boundaries.

## Structure

- `contracts/api/` — API request/response structures
- `contracts/events/` — Event payload definitions
- `contracts/gameplay/` — Gameplay data structures shared across boundaries
- `contracts/errors/` — Standardized error format
- `schemas/` — Validation schemas
- `constants/` — Shared constant values
- `enums/` — Shared enumerations
- `versioning/` — API version tracking

## Rules

- Contracts define data shapes, not concrete runtime implementations.
- Frontend and backend packages import contracts directly from `@flowstate/shared`.
- Never couple database implementation models directly to frontend rendering state.
