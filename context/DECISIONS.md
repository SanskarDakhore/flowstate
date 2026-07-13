# FLOWSTATE — Decisions Log

This document records the architectural and design decisions for FLOWSTATE.

### Decision Statuses:
- **CONFIRMED**: Officially approved design or technical choice.
- **EXPERIMENTAL**: Trial design or code (e.g. gameplay prototypes), not confirmed for release.
- **REJECTED**: Evaluated and explicitly excluded from the scope.
- **SUPERSEDED**: Replaced by a newer decision.
- **TBD**: Requires research and alignment before confirmation.

---

## DEC-001
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** Use monorepo architecture with frontend, backend, middleware, database, and shared directories.
- **Reason:** Enables shared contracts, unified CI, and atomic cross-system changes.
- **Trade-offs:** Larger repository size; requires careful CI to avoid rebuilding unchanged layers.
- **Affected Systems:** All

## DEC-002
- **Date:** 2026-07-12
- **Status:** SUPERSEDED (Superseded by DEC-010 / TECH-002)
- **Decision:** Use Unity + C# for the game client.
- **Reason:** Legacy prototype assumption. Replaced by JavaScript/TypeScript primary stack.
- **Affected Systems:** Frontend

## DEC-003
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** Use Node.js + TypeScript + Express for the backend API.
- **Reason:** Well-suited for JSON APIs; large ecosystem; team-agnostic.
- **Trade-offs:** Single-threaded event loop may need worker threads for CPU-intensive score validation.
- **Affected Systems:** Backend, Middleware

## DEC-004
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** Use PostgreSQL for the primary database.
- **Reason:** Strong relational support for leaderboards, player data, competitive ranking queries.
- **Trade-offs:** Requires operational management; may need Redis for caching hot leaderboard data.
- **Affected Systems:** Database, Backend

## DEC-005
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** URL-based API versioning (/api/v1/).
- **Reason:** Simple, explicit, easy to route and test.
- **Trade-offs:** URL changes when version bumps; old versions must be maintained or deprecated.
- **Affected Systems:** Backend, Frontend Networking

## DEC-006
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** Leaderboard scores are server-authoritative only.
- **Reason:** Mobile clients cannot be trusted for competitive data.
- **Trade-offs:** Requires server-side score validation logic; adds latency to leaderboard updates.
- **Affected Systems:** Backend, Database, Frontend Services

## DEC-007
- **Date:** 2026-07-12
- **Status:** CONFIRMED
- **Decision:** Start as a modular monolith, not microservices.
- **Reason:** Avoid premature complexity; boundaries are logical, not deployment boundaries.
- **Trade-offs:** Must enforce module boundaries by convention until they become enforced by deployment.
- **Affected Systems:** Backend, Middleware

## DEC-008
- **Date:** 2026-07-12
- **Status:** TBD
- **Decision:** Cloud provider and deployment platform.
- **Reason:** Not yet evaluated.
- **Affected Systems:** Infrastructure, CI/CD, Database

## DEC-009
- **Date:** 2026-07-12
- **Status:** REJECTED
- **Decision:** Use real-time WebSockets/TCP connection for score synchronization during gameplay.
- **Reason:** Real-time sync adds excessive network overhead and complexity, contradicting the calming single-player-first philosophy. HTTP-based post-session verification is substantive and far simpler.
- **Trade-offs:** Eliminates real-time ghost play or synchronous head-to-head matching, which was already flagged as experimental.
- **Affected Systems:** Frontend Networking, Backend API

## DEC-010 (TECH-002)
- **Date:** 2026-07-13
- **Status:** CONFIRMED
- **Decision:** FLOWSTATE primary technology ecosystem is JavaScript, with TypeScript preferred for all production code across frontend client, backend server, middleware, and shared contracts.
- **Reason:** Eliminates language mismatches, allows direct typing imports via `@flowstate/shared`, simplifies CI/CD, and streamlines build tooling.
- **Trade-offs:** Requires framework-neutral client architecture while rendering framework is evaluated.
- **Supersedes:** DEC-002
- **Affected Systems:** All (Frontend, Shared, Middleware, Backend, CI/CD, Tooling)

## DEC-011 (TECH-003)
- **Date:** 2026-07-13
- **Status:** CONFIRMED
- **Decision:** FLOWSTATE presentation is True 3D, and Babylon.js (`@babylonjs/core`) is confirmed as the concrete 3D frontend engine runtime.
- **Reason:** Battle-tested 3D engine capabilities, modular ESM architecture, strong mobile WebGL optimizations, and clean presentation-bridge decoupling.
- **Trade-offs:** Demands strict mobile performance budgeting (draw call limits, transparency management, geometry pooling).
- **Affected Systems:** Frontend Rendering, Client Architecture, CI/CD, Development Environment

## DEC-012 (TECH-004)
- **Date:** 2026-07-13
- **Status:** CONFIRMED (With Tracked Tech Debt)
- **Decision:** Use standard Vite ESM `import.meta.env` for frontend environment variable reads, resolving browser-side `process is not defined` runtime errors.
- **Technical Debt Tracked:** `ts-jest` diagnostic suppression (`ignoreCodes: [1343]`) in `frontend/jest.config.js` is logged as temporary test compatibility technical debt to refine during future ESM test environment standardization.
- **Affected Systems:** Frontend Core, Networking, Jest Test Runner
