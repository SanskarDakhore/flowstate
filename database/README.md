# Database

Database architecture for FLOWSTATE.

## Technology

**Assumed: PostgreSQL 15+** (TBD — not yet confirmed)

## Structure

- `schema/` — Table definitions and initial schema
- `migrations/` — Versioned migration files
- `seeds/` — Development seed data
- `fixtures/` — Test fixtures
- `queries/` — Reusable query templates
- `functions/` — Database functions and stored procedures
- `policies/` — Row-level security policies
- `backups/` — Backup scripts (actual backups are NOT committed)
- `scripts/` — Database management scripts
- `diagrams/` — ER diagrams and visual documentation

## Rules

- Never commit actual backup files (they may contain user data)
- All schema changes go through migrations
- Seeds are for development only — never run in production
- Competitive data (leaderboards, scores) requires server validation
- Client-reported data and server-validated data must be distinguishable

See `DATABASE_DESIGN.md` for entity design and relationships.
