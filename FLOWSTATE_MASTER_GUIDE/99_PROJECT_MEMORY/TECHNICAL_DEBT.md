---
Title: "Technical Debt Backlog"
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

# Technical Debt Backlog

| Debt ID | System / File | Description | Priority | Resolution Milestone |
|---|---|---|---|---|
| DEBT-001 | `prototype-metrics.ts` | Optional property checks require defensive fallback checks | Low | Milestone 1 (Phase 05) |
| DEBT-002 | `input-router.ts` | Internal intent mutation requires `MutableMovementIntent` cast | Low | Milestone 1 (Phase 05) |
| DEBT-003 | Dev UI Components | Legacy inline styles in early prototype overlays need token migration | Medium | Milestone 1 (Phase 13) |
