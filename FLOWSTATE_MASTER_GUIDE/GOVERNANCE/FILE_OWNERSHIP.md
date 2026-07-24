---
Title: "File Ownership Matrix"
Module: "GOVERNANCE"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.06"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [98_CANON, 99_PROJECT_MEMORY, 00_PROJECT_CORE]
Provides: [AI Operational Rules & Repository Governance]
Blocks: [Phase 00.07, Implementation Phases]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# File Ownership Matrix

| Folder Path | Primary Purpose | Owner | Allowed Edits | Protected Files | Dependencies |
|---|---|---|---|---|---|
| **`00_PROJECT_CORE/`** | Engineering Constitution & Rules | GDOS Core | Yes (Documentation) | `Do_Not_Break_Rules.md` | None |
| **`98_CANON/`** | Immutable Creative Constitution | Creative Director | No (Immutable Reference) | All files | None |
| **`99_PROJECT_MEMORY/`** | Project Memory & Decision Log | System Memory | Yes (Log Updates) | `DECISION_LOG.md` | All Modules |
| **`GOVERNANCE/`** | AI Operational Rules & Contracts | Governance Lead | Yes (Governance Updates) | `AI_OPERATING_RULES.md` | Core / Canon |
| **`frontend/src/core/`** | Physics & Game Loop | Engine Core | Conditional | `movement-engine.ts` | `shared/` |
| **`frontend/src/ui/`** | HUD & Presentation | UI/UX Lead | Yes | None | `tokens.css` |
| **`frontend/src/rendering/`** | Babylon.js Shaders & Splats | Graphics Lead | Yes | None | `05_ENVIRONMENT_RENDERING` |
