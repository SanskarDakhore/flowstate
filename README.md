# FLOWSTATE

**The better you play, the more alive and beautiful the world becomes.**

FLOWSTATE is a relaxing yet competitive mobile game for Android and iOS. The player controls a small glowing entity moving through an abstract world, transforming chaos into harmony through simple tap, swipe, and hold interactions.

## Current Status

> **Phase: Initial Scaffold**
> The repository structure is established. Core gameplay implementation has not yet begun.

## Repository Architecture

```
flowstate/
├── frontend/       — Unity game client (C#)
├── middleware/      — Shared application-layer logic (TypeScript)
├── backend/         — API server (Node.js / TypeScript / Express)
├── database/        — Schema, migrations, seeds, design docs
├── shared/          — Contracts, schemas, enums shared across layers
├── context/         — AI agent context and project knowledge
├── docs/            — Architecture, game design, API, development docs
├── infrastructure/  — Docker, deployment, monitoring placeholders
├── scripts/         — Developer tooling and automation
├── tests/           — Cross-system tests (contract, integration, e2e)
├── tools/           — Project utilities (structure validation, etc.)
├── config/          — Environment configs and feature flags
└── .github/         — CI/CD workflows, issue/PR templates
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for the complete tree and dependency rules.

## Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Game Client | Unity + C# | Confirmed |
| Backend | Node.js + TypeScript + Express | Assumed |
| Database | PostgreSQL | Assumed |
| CI/CD | GitHub Actions | Assumed |
| Cloud Provider | TBD | Not selected |

## Local Setup

### Prerequisites
- Unity 2022.3 LTS or later (for frontend)
- Node.js 18+ and npm (for backend/middleware)
- PostgreSQL 15+ (for database) — or Docker
- Git

### Backend
```bash
cd backend
cp ../.env.example ../.env    # Edit with your local values
npm install
npm run dev
```

### Frontend (Unity)
1. Open Unity Hub
2. Add project from `frontend/` directory
3. Open the Bootstrap scene in `Assets/Scenes/`

### Database
```bash
# TBD — depends on selected migration tooling
# See database/README.md for current status
```

### Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests — run via Unity Test Runner

# Cross-system tests
cd tests && npm test   # TBD
```

## Context System

The `context/` directory maintains persistent project knowledge for AI agents and developers. See [context/README.md](context/README.md) for the full protocol.

## Documentation

- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Game Vision](docs/game-design/GAME_VISION.md)
- [API Overview](docs/api/API_OVERVIEW.md)
- [Local Setup](docs/development/LOCAL_SETUP.md)
- [Contributing](CONTRIBUTING.md)

## Contribution Workflow

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check [context/CURRENT_STATE.md](context/CURRENT_STATE.md) for current phase
3. Check [context/DECISIONS.md](context/DECISIONS.md) for confirmed decisions
4. Create a feature branch, implement, test, submit PR

## License

MIT (placeholder — see [LICENSE](LICENSE))
