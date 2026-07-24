---
Title: "Memory Protocol"
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

# Mandatory AI Memory Protocol

Every AI agent, subagent, and human engineer **MUST** strictly follow this **10-Step Memory Protocol** for every execution phase. Skipping any step is a protocol violation.

```mermaid
flowchart TD
    Step1[1. Read Canon] --> Step2[2. Read Decision Log]
    Step2 --> Step3[3. Read Architectural Decisions]
    Step3 --> Step4[4. Read Open Problems]
    Step4 --> Step5[5. Read Repository Knowledge]
    Step5 --> Step6[6. Execute Code Implementation]
    Step6 --> Step7[7. Update Decision Log]
    Step7 --> Step8[8. Update Changelog]
    Step8 --> Step9[9. Update Lessons Learned]
    Step9 --> Step10[10. Verify Quality Gates & Consistency]
```

## Protocol Steps
1. **Read Canon**: Review `FLOWSTATE_MASTER_GUIDE/98_CANON/` to align with game vision and laws.
2. **Read Decision Log**: Check `99_PROJECT_MEMORY/DECISION_LOG.md` to prevent re-opening settled decisions.
3. **Read Architectural Decisions**: Review `ARCHITECTURAL_DECISIONS.md` for ADR constraints.
4. **Read Open Problems**: Check `OPEN_PROBLEMS.md` for related open issues.
5. **Read Repository Knowledge**: Review `REPOSITORY_KNOWLEDGE.md` for file maps and entry points.
6. **Execute Code Implementation**: Perform changes adhering strictly to Do-Not-Break rules.
7. **Update Decision Log**: Record any new architectural decisions in `DECISION_LOG.md`.
8. **Update Changelog**: Add entry to `CHANGELOG.md` under active version.
9. **Update Lessons Learned**: Record discoveries or issues in `LESSONS_LEARNED.md`.
10. **Verify Consistency**: Execute `npm run typecheck` and verify 10-Point AI Quality Gate compliance.
