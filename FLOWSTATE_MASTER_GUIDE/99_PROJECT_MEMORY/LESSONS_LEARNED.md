---
Title: "Lessons Learned"
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

# Lessons Learned Register

### LRN-001: AI Pair Programming Requires Strict Memory Protocols
- **Phase**: Phase 00.01 - Phase 00.04
- **What Worked**: Decoupling tasks into machine-executable phase packages with explicit read-first dependencies and Do-Not-Break rules.
- **What Failed**: Relying on single massive prompt instructions led to context drift and silent architectural regressions.
- **Unexpected Discoveries**: AI coding agents perform exponentially better when given explicit 10-Point AI Quality Gate checklists and pre-file inspection lists.
- **Recommended Practices**: Mandatory execution of [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) at the start and end of every development phase.

---

### LRN-002: Decoupled UI & Read-Only Telemetry Contracts Prevent Code Churn
- **Phase**: Phase 01
- **What Worked**: Forcing UI screen controllers to consume read-only telemetry events prevented UI visual passes from mutating movement physics.
- **What Failed**: Direct property assignments on shared intent objects caused TypeScript `TS2540` read-only compilation errors.
- **Unexpected Discoveries**: Using internal mutable helper types (`Mutable<T>`) cleanly isolates internal state modifications from public read-only interfaces.
- **Recommended Practices**: Always export read-only public contracts for state objects.
