# FLOWSTATE — Repository Project Structure

This document outlines the monorepo directory tree, folder responsibilities, layering rules, boundaries, and dependency directions for **FLOWSTATE**.

---

## 1. Repository Directory Tree

```text
.github/                        # GitHub repository configuration (CI/CD workflows, templates)
backend/                        # Backend API Server (Node.js/TypeScript/Express)
ci-cd/                          # CI/CD deployment files and scripting templates
config/                         # Repository-wide configuration policy (no secrets)
context/                        # Persistent project knowledge (AI & Human)
database/                       # Relational database layout
docs/                           # System architecture and design documentation
frontend/                       # True 3D JavaScript/TypeScript Client Package (Babylon.js)
├── src/
│   ├── core/                   # Bootstrap, ServiceRegistry, GameContext, GameStateMachine, GameEventBus
│   ├── game/                   # Player simulation state, Input adapters, Gestures, Movement
│   ├── rendering/              # Babylon.js modular presentation layer
│   │   ├── engine/             # Generic RenderingEngine & BabylonRenderingEngine
│   │   ├── scene/              # GameplayScene & SceneFactory
│   │   ├── camera/             # GameplayCamera (Target follow camera)
│   │   ├── lighting/           # GameplayLighting (Hemispheric & Directional)
│   │   ├── environment/        # EnvironmentView & WorldPresentation contract
│   │   ├── player/             # BabylonPlayerView & PlayerView contract
│   │   ├── materials/          # PlayerMaterialFactory (Emissive glowing orb)
│   │   └── README.md           # Presentation boundary guide
│   ├── audio/                  # AudioManager and adaptive music interface
│   ├── haptics/                # HapticsService semantic adapter
│   ├── ui/                     # UIRouter, RouteId, HUD, Modals, Screens
│   ├── scenes/                 # SceneRouter, SceneId
│   ├── networking/             # ApiClient, ApiRoutes, RequestBuilder, ResponseHandler
│   └── main.ts                 # Client entry bootstrapper
├── index.html                  # Full-screen WebGL canvas surface
├── vite.config.ts              # Vite dev server configuration
├── package.json
└── tsconfig.json
infrastructure/                 # Platform hosting setups
middleware/                     # Modular TypeScript middlewares (Logic only)
scripts/                        # Local automated tasks
shared/                         # Shared Types & Data Contracts (@flowstate/shared)
tests/                          # Cross-system integration tests
tools/                          # Helper programs
package.json                    # Root npm workspace definitions
tsconfig.base.json              # Root TypeScript base compiler configuration
```

---

## 2. Directory & Layer Responsibilities

### Presentation Layer (`frontend/src/rendering/`)
* **What belongs:** Modular 3D scene elements, target follow camera, dynamic lighting, emissive player materials, and presentation contracts (`PlayerView`, `WorldPresentation`).
* **What does NOT belong:** Gameplay simulation state calculation, collision authority, server REST calls, or raw database queries.

### Gameplay Simulation (`frontend/src/game/`)
* **What belongs:** Framework-neutral player position calculation, gesture recognition (`TAP`, `SWIPE`, `HOLD`), energy metrics, harmony calculation state.
* **What does NOT belong:** Direct references to Babylon `Mesh`, `Material`, or `Scene` objects.
