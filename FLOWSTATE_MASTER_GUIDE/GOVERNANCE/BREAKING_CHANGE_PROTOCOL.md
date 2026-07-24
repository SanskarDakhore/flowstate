---
Title: "Breaking Change Protocol"
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

# Breaking Change Protocol

## Change Classifications & Protocols

### 1. Minor Change (Non-Breaking)
- **Scope**: Localized bug fix or internal refactor.
- **Protocol**: Standard implementation pass with 0-error typecheck.

### 2. Major Change (System Scope)
- **Scope**: Modifying public module interfaces or data models.
- **Protocol**: Update GDOS specs, log in `CHANGELOG.md`, and verify backwards compatibility.

### 3. Architectural Change (Breaking)
- **Scope**: Modifying core physics kinetics, spline math, or data flow paths.
- **Protocol**:
  1. Create ADR entry in `ARCHITECTURAL_DECISIONS.md`.
  2. Obtain explicit User approval via Implementation Plan.
  3. Include verified `Rollback.md` protocol.
  4. Perform regression test suite verification.
