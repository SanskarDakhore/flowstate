---
Title: "AI Failure Recovery"
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

# AI Failure Recovery Protocol

If an implementation phase fails or introduces build errors/performance regressions, execute the following protocol:

```mermaid
flowchart TD
    Failure[Build Error / Regression Triggered] --> Rollback[1. Execute Rollback via git checkout]
    Rollback --> RootCause[2. Perform Root Cause Analysis]
    RootCause --> LogLesson[3. Log Failure in LESSONS_LEARNED.md]
    LogLesson --> UpdateDecision[4. Update Decision Log & Strategy]
    UpdateDecision --> Retry[5. Attempt Retry with Modified Strategy]
```

## Recovery Steps
1. **Rollback Immediately**: Revert workspace changes using `git checkout HEAD -- [files]`. Do not stack band-aid patches over broken commits.
2. **Analyze Root Cause**: Inspect un-truncated error logs or stack trace files.
3. **Record Lesson**: Add failure entry to `99_PROJECT_MEMORY/LESSONS_LEARNED.md`.
4. **Adjust Strategy**: Refine phase prompt or implementation plan.
