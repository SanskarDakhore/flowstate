# ADR-0001: Monorepo Architecture

## Status
Accepted

## Context
FLOWSTATE requires a game client (Unity/C#), backend API (Node.js/TypeScript), shared contracts, database schemas, documentation, and infrastructure configuration. We needed to decide between a monorepo or multi-repo approach.

## Decision
Use a monorepo with all components in a single repository.

## Consequences

### Positive
- Shared contracts are always in sync
- Atomic cross-system changes
- Unified CI/CD configuration
- Single source of truth for documentation

### Negative
- Larger repository size
- CI must be selective (don't rebuild everything on every change)
- Requires careful directory organization

### Neutral
- Git history contains all systems
- Access control is repository-wide (unless using CODEOWNERS)
