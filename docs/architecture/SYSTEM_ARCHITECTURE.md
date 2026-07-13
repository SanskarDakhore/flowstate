# System Architecture

## Overview
FLOWSTATE uses a monorepo architecture with clean separation between the True 3D frontend client package (`frontend/` powered by Babylon.js), backend API server (`backend/`), middleware (`middleware/`), and shared contracts (`@flowstate/shared`).

## High-Level Diagram

```text
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ Babylon 3D      │────▶│ Express API      │────▶│ PostgreSQL   │
│ Client Package  │◀────│ (Node.js / TS)   │◀────│ Database     │
└─────────────────┘     └──────────────────┘     └──────────────┘
        │                        │
        ▼                        ▼
  Local Storage           Middleware Layer
  (Offline Play)          (Auth, Validation,
                           Rate Limiting)
```

## Key Architectural Principles
- **Presentation Separation:** Gameplay state remains completely independent of Babylon meshes. Mesh transforms update based on normalized player simulation state, and 3D environment presentation reacts to gameplay harmony state without owning gameplay rules.
- **Offline Capable:** Gameplay simulation runs independently of backend availability.
- **Server Score Authority:** All scores submitted to leaderboards route through server verification (`POST /api/v1/game-results`).
