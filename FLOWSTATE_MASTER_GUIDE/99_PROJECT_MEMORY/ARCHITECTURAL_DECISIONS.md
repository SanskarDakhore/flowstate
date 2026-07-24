---
Title: "Architectural Decisions"
Module: "99_PROJECT_MEMORY"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.04"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 98_CANON]
Provides: [Project Memory & Architectural Continuity]
Blocks: []
Estimated Work: 5 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Architecture Decision Records (ADRs)

### ADR-001: Game Development Operating System (GDOS) Framework
- **Status**: Approved
- **Context**: Need a scalable methodology to guide AI-assisted coding across 100 development phases without context degradation.
- **Decision**: Establish `FLOWSTATE_MASTER_GUIDE/` containing 27 modules, standardized templates, immutable canon, project memory, and self-contained phase packages.
- **Consequences**: Every phase must follow GDOS specs and satisfy 10-Point Quality Gates.

### ADR-002: CSS Design Token Discipline (`tokens.css`)
- **Status**: Approved
- **Context**: Need visual harmony and dark mode support across WebGL canvas UI overlays.
- **Decision**: Prohibit raw hex color values and arbitrary font stacks in TS UI components. Force usage of `tokens.css` variables.
- **Consequences**: Theme consistency is guaranteed across all screens.

### ADR-003: Player HUD and DevPanel Architecture Decoupling
- **Status**: Approved
- **Context**: Telemetry metrics (FPS, raw vectors) ruin player immersion if rendered on the player HUD.
- **Decision**: Keep `PlayerHud` luminous and minimal; isolate dev debug metrics inside `DevPanel`.
- **Consequences**: Pristine player presentation backed by full engineering telemetry.
