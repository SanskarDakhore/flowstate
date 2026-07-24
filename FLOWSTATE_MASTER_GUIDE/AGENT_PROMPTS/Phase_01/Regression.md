---
Title: "Phase 01 Regression Prevention & Do-Not-Break Rules"
Module: "00_PROJECT_CORE"
Status: In-Progress
Priority: Critical
Milestone: 1
Phase: "01.00"
Spec Version: 1.0.0
---

# Phase 01 Regression Prevention & Do-Not-Break Rules

## Protected Code Systems
- `frontend/src/core/physics/movement-engine.ts`
- `frontend/src/core/physics/collision-solver.ts`
- `shared/math/spline-calculator.ts`

## Prohibited Patterns
- DO NOT insert inline hex color strings (`#ff0055`) inside TypeScript UI classes.
- DO NOT invoke physics state mutation methods from UI event handlers.
- DO NOT output un-scrimmed white text directly over WebGL 3D canvas viewport.
