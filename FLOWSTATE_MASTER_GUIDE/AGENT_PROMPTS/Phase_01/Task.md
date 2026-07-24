---
Title: "Phase 01 Task Specification: Architecture Rules & Token Discipline"
Module: "00_PROJECT_CORE"
Status: In-Progress
Priority: Critical
Milestone: 1
Phase: "01.00"
Spec Version: 1.0.0
---

# Phase 01 Task Specification: Architecture Rules & Token Discipline

## Goal
Enforce strict design token usage (`frontend/src/ui/styles/tokens.css`) across all UI screens and components, ensuring complete visual isolation between `PlayerHud` and `DevPanel`.

## Context
FLOWSTATE requires pristine visual presentation ("Luminous Minimalism") over active 3D Babylon.js canvas rendering. UI elements must never hardcode inline styles or mutate underlying physics engines.

## Repository State
- Active prototype with `tokens.css` defined.
- UI screens in `frontend/src/ui/screens/` need token compliance audit.

## Read First
1. [DECISION_LOG.md](../../99_PROJECT_MEMORY/DECISION_LOG.md)
2. [Do_Not_Break_Rules.md](../../00_PROJECT_CORE/Do_Not_Break_Rules.md)
3. [Architecture_Rules.md](../../00_PROJECT_CORE/Architecture_Rules.md)

## Files to Inspect
- `frontend/src/ui/styles/tokens.css`
- `frontend/src/ui/screens/*.ts`
- `frontend/src/ui/components/*.ts`

## Files to Modify
- `frontend/src/ui/screens/*.ts`
- `frontend/src/ui/components/*.ts`

## Files Never Modify
- `frontend/src/core/physics/`
- `shared/math/`

## Implementation Plan
1. Audit all `.ts` files under `frontend/src/ui/` for raw hex color strings (e.g. `#00ffff`, `#121212`) or arbitrary inline margins.
2. Replace hardcoded visual values with CSS custom properties dereferencing `var(--flow-...)` from `tokens.css`.
3. Verify text legibility over 3D scenes by ensuring background scrims use `var(--flow-text-scrim)`.
4. Ensure `PlayerHud` consumes read-only telemetry and does not import or mutate physics solvers.

## Constraints
- Frame Budget: 16.6ms.
- 0-byte memory allocation during UI updates.

## Acceptance Tests
- Clean compilation: `npm run check`
- Zero direct physics mutations from UI controllers.

## Deliverables
- Fully token-compliant UI components.
- Updated `CHANGELOG.md` entry.
