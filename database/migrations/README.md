# Database Migrations

This directory contains versioned schema migrations (e.g. SQL files or migration scripts).

## Guidelines
- Always use version numbers / timestamps in migration filenames (e.g. `001_init.sql`, `002_add_indexes.sql`).
- Ensure all migrations have an up (apply) and down (revert) path.
