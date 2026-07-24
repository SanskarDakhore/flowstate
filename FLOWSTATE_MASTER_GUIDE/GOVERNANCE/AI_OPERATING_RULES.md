---
Title: "AI Operating Rules"
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

# AI Operating Rules & Execution Protocol

This document establishes the mandatory operating rules for Antigravity IDE, Codex, and all AI agents working on FLOWSTATE.

---

## Mandatory 13-Step AI Execution Workflow

```mermaid
flowchart TD
    Step1[1. Read Canon: 98_CANON/] --> Step2[2. Read Memory: 99_PROJECT_MEMORY/]
    Step2 --> Step3[3. Read Constitution: 00_PROJECT_CORE/]
    Step3 --> Step4[4. Read Architecture Map: ARCHITECTURE_MAP.md]
    Step4 --> Step5[5. Inspect Repository Source Code]
    Step5 --> Step6[6. Create/Update Implementation Plan]
    Step6 --> Step7[7. Implement Code Modifications]
    Step7 --> Step8[8. Run Typecheck & Unit Tests]
    Step8 --> Step9[9. Benchmark Performance & Memory]
    Step9 --> Step10[10. Update GDOS Specifications]
    Step10 --> Step11[11. Update DECISION_LOG & CHANGELOG]
    Step11 --> Step12[12. Verify 10-Point AI Quality Gate]
    Step12 --> Step13[13. Mark Phase Complete]
```

## Operating Rules
1. **Never Skip Memory**: Always check [MEMORY_PROTOCOL.md](../99_PROJECT_MEMORY/MEMORY_PROTOCOL.md) before proposing code modifications.
2. **Respect Protected Files**: Never mutate files listed in [Do_Not_Break_Rules.md](../00_PROJECT_CORE/Do_Not_Break_Rules.md).
3. **Verify Zero Errors**: Always run `npm run typecheck` before declaring a phase complete.
4. **Token Discipline**: Force usage of `tokens.css` variables for all UI styles.
