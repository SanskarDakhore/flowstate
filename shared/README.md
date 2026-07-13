# Shared Contracts

Cross-layer contracts, schemas, constants, and enums shared between frontend and backend.

## Purpose

Define interfaces and data structures that must remain consistent across the client and server. These are the agreed-upon "shapes" of data exchanged between systems.

## Structure

- `contracts/api/` — API request/response structures
- `contracts/events/` — Event payload definitions
- `contracts/gameplay/` — Gameplay data structures shared across boundaries
- `contracts/errors/` — Standardized error format
- `schemas/` — Validation schemas (JSON Schema, Zod, etc.)
- `constants/` — Shared constant values
- `enums/` — Shared enumerations
- `versioning/` — API version tracking

## Rules

- Contracts define shapes, not implementations
- Changes to contracts should be versioned and backwards-compatible
- Unity C# classes should NOT directly import TypeScript contracts — use code generation or manual sync
- Never couple Unity domain classes directly to backend database models
