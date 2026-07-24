# Repository Rules & Coding Conventions for FLOWSTATE

> **Notice**: This file is an operational summary automatically derived from the primary GDOS Governance Layer located in `FLOWSTATE_MASTER_GUIDE/GOVERNANCE/`. Refer to the Governance Layer for authoritative rules.

---

## 1. Primary Source of Truth & Governance Hierarchy
- **Master OS**: All design, engineering, and operational rules derive from `FLOWSTATE_MASTER_GUIDE/`.
- **Canon**: Creative rules are governed by [`98_CANON/`](../FLOWSTATE_MASTER_GUIDE/98_CANON/Game%20Identity.md).
- **Memory**: Decisions & history are logged in [`99_PROJECT_MEMORY/`](../FLOWSTATE_MASTER_GUIDE/99_PROJECT_MEMORY/DECISION_LOG.md).
- **Governance**: Operational rules reside in [`GOVERNANCE/`](../FLOWSTATE_MASTER_GUIDE/GOVERNANCE/AI_OPERATING_RULES.md).

---

## 2. UI & Design Token Discipline
- All user interface elements must use CSS variables defined in `frontend/src/ui/styles/tokens.css`.
- Hardcoding raw hex color values, inline arbitrary padding/margins, or un-tokenized font stacks in TypeScript files is strictly prohibited (Anti-Pattern #13).
- Text legibility over 3D WebGL scenes must be backed by dark background scrims (`var(--flow-text-scrim)`).

---

## 3. HUD Architecture & Separation of Concerns
- **Player HUD (`PlayerHud`)** and **Developer Telemetry Panel (`DevPanel`)** must remain strictly separated in both component structure and visual appearance.
- Player HUD elements must remain minimal, clean, and unobtrusive ("Luminous Minimalism").
- Technical data (FPS counters, raw position vectors, input intent values) must stay isolated inside `DevPanel`.

---

## 4. Preservation of Gameplay Code
- Frontend visual passes must NEVER mutate, rewrite, or bypass core movement physics, collision math, target evaluation logic, or session state.
- Component controllers must interact with gameplay systems strictly via read-only telemetry data and public events.

---

## 5. Mandatory AI Execution Protocol
Before making any code modifications, AI agents MUST follow the 13-step workflow in [`GOVERNANCE/AI_OPERATING_RULES.md`](../FLOWSTATE_MASTER_GUIDE/GOVERNANCE/AI_OPERATING_RULES.md):
1. Inspect `98_CANON/` and `99_PROJECT_MEMORY/DECISION_LOG.md`.
2. Inspect protected files listed in `00_PROJECT_CORE/Do_Not_Break_Rules.md`.
3. Verify zero circular dependencies and 0-byte frame allocations.
4. Verify all 10 points of the **Master AI Quality Gate Checklist** before closing a phase.
5. Execute `npm run typecheck` to verify 0 compilation errors.
