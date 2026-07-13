# FLOWSTATE — Database Design

## Status: DRAFT

This document describes the conceptual database design. Implementation details depend on the confirmed database technology (assumed PostgreSQL).

## Design Principles

1. **UUIDs for primary keys** — Avoids sequential ID enumeration
2. **Timestamps on all tables** — `created_at`, `updated_at` with timezone
3. **Soft deletes where appropriate** — `deleted_at` column
4. **Server-validated data is authoritative** — Client-reported data is informational
5. **Indexing strategy** — Index foreign keys and frequently queried columns
6. **Consistent naming** — `snake_case` for tables and columns

## Conceptual Entities

### Core Identity

| Table | Purpose |
|-------|---------|
| `users` | Authentication identity (one per device/account) |
| `player_profiles` | Public player data (display name, avatar, stats) |

### Gameplay

| Table | Purpose |
|-------|---------|
| `game_sessions` | Active and completed gameplay sessions |
| `game_results` | Server-validated session outcomes and scores |

### Progression

| Table | Purpose |
|-------|---------|
| `player_progression` | XP, level, unlocked features |
| `achievements` | Achievement definitions |
| `player_achievements` | Earned achievements per player |

### Competitive

| Table | Purpose |
|-------|---------|
| `leaderboard_entries` | Ranked scores (server-validated only) |

### Economy & Cosmetics

| Table | Purpose |
|-------|---------|
| `cosmetics` | Cosmetic item definitions |
| `player_cosmetics` | Owned/equipped cosmetics per player |
| `inventory_items` | Inventory item definitions |
| `player_inventory` | Player inventory state |

### System

| Table | Purpose |
|-------|---------|
| `remote_config_versions` | Remote configuration snapshots |
| `analytics_events` | Event log for analytics (may use separate store) |

## Data Authority

```
┌─────────────────────┬──────────────────────┐
│ Client-Reported     │ Server-Validated     │
├─────────────────────┼──────────────────────┤
│ Raw session events  │ Final scores         │
│ Input timestamps    │ Leaderboard entries  │
│ Client-side stats   │ Achievement awards   │
│ Display preferences │ Inventory changes    │
│                     │ Progression updates  │
└─────────────────────┴──────────────────────┘
```

## Relationships (Conceptual)

```
users 1──N player_profiles
users 1──N game_sessions
game_sessions 1──1 game_results
users 1──N leaderboard_entries
users 1──N player_progression
users 1──N player_cosmetics
users 1──N player_inventory
users 1──N player_achievements
```

## Migration Strategy

- Migrations are numbered sequentially: `001_initial_schema.sql`, `002_add_leaderboards.sql`
- Each migration has an `up` and `down` section
- Migrations are applied in order and tracked in a migrations table
- Tool TBD (Knex, Prisma, raw SQL, etc.)

## Indexing Strategy

- Primary keys: UUID with `gen_random_uuid()` default
- Foreign keys: Always indexed
- Leaderboard queries: Composite index on `(board_id, score DESC)`
- Player lookups: Index on `user_id` across all player tables
- Analytics: Time-based partitioning if volume is high
