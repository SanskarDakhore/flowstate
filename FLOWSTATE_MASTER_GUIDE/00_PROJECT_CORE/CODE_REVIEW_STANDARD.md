---
Title: "Code Review Standard"
Module: "00_PROJECT_CORE"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.05"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [98_CANON, 99_PROJECT_MEMORY]
Provides: [Engineering Constitution & Code Review Governance]
Blocks: [Phase 00.06, Implementation Phases]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Code Review Standard

This document establishes the code quality, maintainability, and review rules for all pull requests and code modifications in FLOWSTATE.

## 1. Naming Conventions
- **Files & Directories**: Lowercase kebab-case (`movement-controller.ts`, `spline-calculator.ts`).
- **Classes & Interfaces**: PascalCase (`MovementController`, `ReadOnlyTelemetry`).
- **Methods & Variables**: camelCase (`calculateVelocity`, `currentSpeed`).
- **Constants**: UPPER_SNAKE_CASE (`MAX_VELOCITY`, `DEFAULT_FOV`).
- **CSS Custom Properties**: Lowercase kebab-case prefixed with `--flow-` (`--flow-cyan-400`, `--flow-text-scrim`).

## 2. Architecture & Decoupling
- UI components MUST NOT import or mutate physics engine classes directly.
- All telemetry updates must be dispatched via read-only interfaces or immutable event payloads.

## 3. Performance & Memory
- No `new` object allocations permitted inside `update()`, `render()`, or frame tick callbacks.
- Reuse static temporary structures (`Vector3.TEMP`) for intermediate calculations.

## 4. Readability & Maintainability
- Max function length: 50 lines.
- Max file length: 400 lines (split into sub-modules if exceeded).
- Use self-documenting code with explicit TypeScript types. Zero `any` permitted.

## 5. Security & Safety
- Validate all user inputs and cloud save payloads before serialization.
- Sanitize telemetry payloads to exclude personally identifiable information.

## Related Core Documents
- [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md)
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
