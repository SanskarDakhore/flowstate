# FLOWSTATE — Repository Project Structure

This document outlines the monorepo directory tree, folder responsibilities, layering rules, boundaries, and dependency directions for **FLOWSTATE**.

---

## 1. Repository Directory Tree

```text
.github/                        # GitHub repository configuration (CI/CD workflows, templates)
├── ISSUE_TEMPLATE/             # GitHub Issue templates
├── workflows/                  # GitHub Actions CI/CD workflows
│   ├── backend-ci.yml          # Backend verification, type checking, tests
│   ├── frontend-validation.yml # Frontend meta-file and folder validation
│   └── repository-checks.yml   # Structural compliance and validator run
├── CODEOWNERS                  # Repository code ownership file
└── PULL_REQUEST_TEMPLATE.md    # Pull Request template
backend/                        # Backend API Server (Node.js/TypeScript/Express)
├── src/
│   ├── config/                 # Server runtime config loading and validation
│   ├── controllers/            # Express controllers (HTTP request/response mapping)
│   ├── domain/                 # Bounded context logic (player, progression, leaderboards)
│   ├── errors/                 # Standard application error classes
│   ├── events/                 # Server-side event emitters and logic
│   ├── jobs/                   # Background jobs and tasks
│   ├── middleware/             # Express adapters and composed middleware
│   ├── repositories/           # Database access layer (abstraction interfaces)
│   ├── routes/                 # Express API routes
│   ├── telemetry/              # Logging, metrics, and tracing
│   └── utils/                  # Backend utilities
├── tests/                      # Backend tests
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end API tests
├── package.json
└── tsconfig.json
ci-cd/                          # CI/CD deployment files and scripting templates
config/                         # Repository-wide configuration policy (no secrets)
├── environments/               # Environment JSON templates (development, staging, production)
└── feature-flags/              # Rollout flag definitions
context/                        # Persistent project knowledge (AI & Human)
├── agents/                     # Role-specific AI agent contexts
├── domains/                    # Bounded context and feature area logs
├── handoffs/                   # Handoff files between agents/turns
└── archive/                    # Superseded historical context
database/                       # Relational database layout
├── backups/                    # Backup scripts and utilities (backups themselves are ignored)
├── diagrams/                   # ER Diagrams and visual layouts
├── fixtures/                   # Test seed data
├── functions/                  # DB functions and procedures
├── migrations/                 # Schema versioning SQL files
├── policies/                   # Row-level security definitions
├── queries/                    # Standardized query templates
├── schema/                     # Core SQL table schemas
├── scripts/                    # DB administration scripts
└── seeds/                      # Local dev seed scripts
docs/                           # System architecture and design documentation
├── adr/                        # Architectural Decision Records (ADR log)
├── api/                        # API specs and authentication detail
├── architecture/               # Network, client, and server layouts
├── development/                # Setup guides and code standards
└── game-design/                # Gameplay mechanics and scoring loops
frontend/                       # Unity Client (C#)
├── Assets/
│   ├── _FLOWSTATE/             # Root Unity namespace
│   │   ├── Core/               # ServiceRegistry, Bootstrap, state machine, EventBus
│   │   ├── Data/               # Runtime state, scriptable configurations, models
│   │   ├── Debug/              # Dev tools, console cheats (stripped from release)
│   │   ├── Editor/             # Custom Unity Editor inspectors and utilities
│   │   ├── Gameplay/           # Player movement, input, scoring, combo, harmony
│   │   ├── Networking/         # API Client and network request builders
│   │   ├── Platform/           # Native iOS/Android bindings (haptics)
│   │   ├── Presentation/       # Audio, camera, lighting, environment, VFX
│   │   ├── Routing/            # Scene navigation and top-level routing overview
│   │   ├── Services/           # Client-side implementations (Auth, SaveSystem, etc.)
│   │   └── UI/                 # HUD, screens, themes, buttons, scroll bars
│   ├── Art/                    # Sprites, models, textures
│   ├── Audio/                  # SFX and adaptive music stems
│   ├── Materials/              # Shaders and textures
│   ├── Prefabs/                # Instantiable Unity prefabs
│   ├── Resources/              # Runtime resources
│   ├── Scenes/                 # Unity scenes (Bootstrap, MainMenu, Gameplay)
│   ├── StreamingAssets/        # Static read-only files
│   └── Tests/                  # Unity-specific test suites
│       ├── EditMode/           # Non-playmode pure logic tests
│       └── PlayMode/           # Playmode integration tests
infrastructure/                 # Platform hosting setups
├── cloud/                      # Production environments (AWS, GCP, etc.)
├── deployment/                 # Orchestration setup templates
├── docker/                     # Docker containers (local database runtime etc.)
├── local/                      # Compose setups for local development
├── logging/                    # Logging configurations
└── monitoring/                 # Alerting and metrics setups
middleware/                     # Modular TypeScript middlewares (Logic only)
├── src/                        # Middleware logic (Auth, Validation, Limiters)
└── tests/                      # Middleware unit tests
scripts/                        # Local automated tasks
├── build/                      # Compile and packaging scripts
├── setup/                      # Workspace setup scripts
├── utils/                      # Helper scripts
└── validation/                 # Local syntax/structure validation
shared/                         # Shared Types & Contracts
├── constants/                  # Shared value declarations
├── contracts/                  # API request/response shape structures
├── enums/                      # Bounded modes (GameMode, SessionStatus)
├── schemas/                    # Zod/JSON validation schemas
└── versioning/                 # Version trackers
tests/                          # Cross-system integration tests
├── contract/                   # Client-server contract validation tests
├── e2e/                        # Monorepo flow validations
├── integration/                # System integrations
└── performance/                # Query and network speed tests
tools/                          # Helper programs
└── project-structure/          # Structural linting tools
```

---

## 2. Directory & Layer Responsibilities

### Frontend Layer (`frontend/`)
* **What belongs:** Unity assets, game visual scripts, audio playbacks, movement calculations, local haptic triggers, input routers, and API request triggers.
* **What does NOT belong:** Real database queries, server route logic, raw score database submissions, or authentication token generation.

### Backend Layer (`backend/`)
* **What belongs:** Express route listeners, request parsing, database query orchestration, server-side gameplay validation (verifying movement logs to prevent cheating), and token signing.
* **What does NOT belong:** Rendering UI layout assets, direct gameplay controls, or C# code compilation.

### Middleware Layer (`middleware/`)
* **What belongs:** Express-agnostic logic for validating credentials, cleaning payloads, implementing rate limiting, logging durations, and version parsing.
* **What does NOT belong:** Bounded gameplay business logic (e.g. calculating XP) or database writing.

### Shared Layer (`shared/`)
* **What belongs:** Type definitions, interfaces, API data contracts, error enumerations, and shared constants.
* **What does NOT belong:** Concrete implementation logic, database schemas, or database drivers.

---

## 3. Dependency Direction & Boundaries

```
[ Frontend Client ] ──▶ [ Shared Contracts ] ◀── [ Backend Server ]
        │                                                │
        ▼                                                ▼
[ Local Save System ]                              [ Database ]
```

### Dependency Rules:
1. **No Circular Dependencies:** A layer must only import downwards or sideways into shared contracts. Backend must never depend on the frontend.
2. **Data Boundaries:** Unity client models must never map directly to database database schemas. If SQL schema changes occur, the API contract layer in `shared/` serves as the buffer.
3. **No Database Access in Frontend:** Frontend has no direct path to SQL drivers. It only accesses state via standard HTTP requests.
4. **Gameplay Independence:** The frontend gameplay layer must run independently of backend servers. Offline states are standard and expected.
5. **Score Authority:** All score metrics submitted to leaderboards must route through server validation. The client-provided score is strictly treated as *informational* until confirmed by `POST /api/v1/game-results`.
6. **No Direct Routes-to-DB:** In the backend, API routes must route requests to controllers, which delegate to services, which query repositories. Direct query invocation from a route router is forbidden.
