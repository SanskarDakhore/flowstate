# FLOWSTATE — Open Questions

## OQ-001: Cloud Provider
- **Domain:** Infrastructure
- **Question:** Which cloud provider/platform should FLOWSTATE use for backend deployment?
- **Options:** AWS, GCP, Azure, Firebase, Supabase, Railway, Fly.io, self-hosted
- **Impact:** Determines infrastructure, CI/CD, and database hosting approach
- **Status:** Open

## OQ-002: ORM / Query Builder
- **Domain:** Backend / Database
- **Question:** Should we use an ORM (Prisma, TypeORM), query builder (Knex), or raw SQL?
- **Impact:** Affects migration tooling, type safety, and query complexity
- **Status:** Open

## OQ-003: Analytics Strategy
- **Domain:** Analytics
- **Question:** Should analytics use the main API, a dedicated service, or a third-party platform?
- **Options:** Custom (main API), custom (separate service), Amplitude, Mixpanel, Firebase Analytics
- **Impact:** Affects data pipeline, privacy, and backend load
- **Status:** Open

## OQ-004: Score Validation Strategy
- **Domain:** Competitive Systems
- **Question:** What specific validation approach should be used for server-side score verification?
- **Options:** Replay validation, statistical anomaly detection, session event log verification
- **Impact:** Determines game result submission format and backend computation requirements
- **Status:** Open

## OQ-005: Monetization Model
- **Domain:** Economy / Product Strategy
- **Question:** What is the monetization strategy?
- **Options:** Free with cosmetic IAP, premium purchase, ads with ad-free option, battle pass
- **Confirmed constraint:** Must NOT be pay-to-win
- **Status:** Open

## OQ-006: Multiplayer Scope
- **Domain:** Gameplay / Backend
- **Question:** Will FLOWSTATE include real-time multiplayer, async multiplayer, or remain single-player with leaderboards?
- **Impact:** Major architectural implications for networking, state sync, and backend infrastructure
- **Status:** Open — experimental only
