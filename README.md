# FLOWSTATE

**The better you play, the more alive and beautiful the world becomes.**

FLOWSTATE is a relaxing yet competitive **True 3D** mobile game for Android and iOS powered by **Babylon.js**. The player controls a small glowing entity moving through an abstract 3D world, transforming chaos into harmony through simple tap, swipe, and hold interactions.

## Current Status

> **Phase: True 3D Direction Confirmed — Babylon.js Runtime Integrated**
> The frontend client layer is powered by `@babylonjs/core` using a modular presentation-bridge architecture and a Vite local browser development server.

## Repository Architecture

```text
flowstate/
├── frontend/        — True 3D game client (Babylon.js, TypeScript, Vite)
│   ├── src/
│   │   ├── core/           # Bootstrap, ServiceRegistry, StateMachine, EventBus
│   │   ├── game/           # Player state simulation, Input router, Gestures
│   │   ├── rendering/      # Babylon.js modular presentation layer
│   │   │   ├── engine/     # Generic RenderingEngine & BabylonRenderingEngine
│   │   │   ├── scene/      # GameplayScene & SceneFactory
│   │   │   ├── camera/     # GameplayCamera target follow camera
│   │   │   ├── lighting/   # GameplayLighting (Hemispheric & Directional)
│   │   │   ├── environment/# EnvironmentView & WorldPresentation contract
│   │   │   ├── player/     # BabylonPlayerView & PlayerView contract
│   │   │   └── materials/  # PlayerMaterialFactory (Emissive orb)
│   │   ├── audio/          # AudioManager adaptive music interface
│   │   ├── haptics/        # HapticsService semantic adapter
│   │   ├── ui/             # UIRouter & RouteId
│   │   ├── scenes/         # SceneRouter & SceneId
│   │   ├── networking/     # ApiClient REST client
│   │   └── main.ts         # Browser & engine entry point
│   ├── index.html          # WebGL render canvas surface
│   └── vite.config.ts      # Local dev server config
├── middleware/      — Shared application-layer logic (TypeScript)
├── backend/         — API server (Node.js / TypeScript / Express)
├── database/        — Schema, migrations, seeds, design docs
├── shared/          — Cross-boundary contracts (@flowstate/shared)
├── context/         — AI agent context and persistent project knowledge
├── docs/            — Architecture, game design, API, development docs
├── package.json     — Root monorepo workspace configuration
└── tsconfig.base.json — Root shared TypeScript configuration
```

## Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Game Presentation | True 3D | Confirmed |
| Ecosystem | JavaScript / Node.js | Confirmed |
| Preferred Language | TypeScript | Confirmed |
| Frontend 3D Runtime | Babylon.js (`@babylonjs/core`) | Confirmed |
| Local Dev Server | Vite | Confirmed |
| Mobile Packaging | Candidate: Capacitor | Provisional |
| Backend | Node.js + TypeScript + Express | Confirmed |
| Database | PostgreSQL | Confirmed |

## Local Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Run local 3D browser dev server
npm run dev --workspace=frontend

# 3. Typecheck all workspaces
npm run typecheck

# 4. Build workspaces & Vite bundle
npm run build

# 5. Run workspace unit tests
npm run test

# 6. Validate repository structure
npm run validate
```

## Documentation

- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Client Architecture](docs/architecture/CLIENT_ARCHITECTURE.md)
- [ADR-0003: Babylon.js 3D Selection](docs/adr/ADR-0003-true-3d-babylonjs-runtime.md)
- [Local Setup](docs/development/LOCAL_SETUP.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT (see [LICENSE](LICENSE))
