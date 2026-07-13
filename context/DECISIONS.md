# FLOWSTATE — Decisions Log

This document records the architectural and design decisions for FLOWSTATE.

### Decision Statuses:
- **CONFIRMED**: Officially approved design or technical choice.
- **EXPERIMENTAL**: Trial design or code (e.g. gameplay prototypes), not confirmed for release.
- **REJECTED**: Evaluated and explicitly excluded from the scope.
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
- **Status:** CONFIRMED
- **Decision:** Use Unity + C# for the game client.
- **Reason:** Industry-standard for mobile games; strong cross-platform support for Android and iOS.
- **Trade-offs:** Larger build size compared to lightweight engines; Unity licensing.
- **Affected Systems:** Frontend

## DEC-003
- **Date:** 2026-07-12
- **Status:** ASSUMED
- **Decision:** Use Node.js + TypeScript + Express for the backend API.
- **Reason:** Well-suited for JSON APIs; large ecosystem; team-agnostic.
- **Trade-offs:** Single-threaded event loop may need worker threads for CPU-intensive score validation.
- **Affected Systems:** Backend, Middleware

## DEC-004
- **Date:** 2026-07-12
- **Status:** ASSUMED
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
- **Reason:** Real-time sync adds excessive network overhead and complexity, contradicting the calming single-player-first philosophy. HTTP-based post-session verification is sufficient and far simpler.
- **Trade-offs:** Eliminates real-time ghost play or synchronous head-to-head matching, which was already flagged as experimental.
- **Affected Systems:** Frontend Networking, Backend API

