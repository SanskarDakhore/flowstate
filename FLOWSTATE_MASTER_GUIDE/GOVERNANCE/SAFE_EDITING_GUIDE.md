---
Title: "Safe Editing Guide"
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

# Safe Editing Guide & Risk Prevention

## 1. Preventing Duplicate Systems
- Search `REPOSITORY_KNOWLEDGE.md` and codebase using `grep_search` before building new helper classes.
- Never re-implement vector spline calculations or token color lookups.

## 2. Preventing Breaking Architecture
- Never import UI controllers into core physics solvers.
- Communication must flow top-down or via read-only event dispatchers.

## 3. Preventing API & Contract Removal
- Do not delete interface properties marked `readonly`.
- Use `Partial<T>` or fallback defaults (`?? 0`) for optional parameters.

## 4. Preventing Performance Regressions & Memory Leaks
- Do not instantiate `new Vector3()` or `new Array()` inside `render()` or tick loops.
- Use static temporary vectors (`Vector3.TEMP`) or object pools.

## 5. Preventing Circular Dependencies
- Keep dependency tree strictly directed (`shared` $\leftarrow$ `core` $\leftarrow$ `simulation` $\leftarrow$ `ui`).
