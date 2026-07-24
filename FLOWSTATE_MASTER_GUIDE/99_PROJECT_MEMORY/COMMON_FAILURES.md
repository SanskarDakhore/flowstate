---
Title: "Common Failures & Pitfalls"
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

# Common Failures & Prevention Strategies

| Failure Mode | Root Cause | Preventative Rule |
|---|---|---|
| **TS2540 Readonly Error** | Attempting to mutate `readonly` interface properties directly | Use internal `Mutable<T>` helper or construct sanitized copies |
| **FPS Drop on Mobile** | Allocating new objects inside WebGL frame render loop | Enforce static object pooling pattern |
| **Illegible UI Text** | Omitting dark scrim background over bright WebGL background | Enforce `var(--flow-text-scrim)` on all HUD text containers |
| **Context Drift** | Executing prompt tasks without checking `DECISION_LOG.md` | Mandatory compliance with [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) |
