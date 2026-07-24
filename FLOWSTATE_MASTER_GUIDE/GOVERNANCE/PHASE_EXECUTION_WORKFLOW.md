---
Title: "Phase Execution Workflow"
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

# Formal Phase Execution Workflow

Every implementation phase package (`AGENT_PROMPTS/Phase_XX/`) executes through 8 mandatory lifecycle stages:

1. **Repository Audit**: Inspect target codebase files and check `Do_Not_Break_Rules.md`.
2. **Planning**: Scaffold/update `implementation_plan.md` and request user review if architectural.
3. **Implementation**: Modify codebase adhering strictly to coding patterns and token rules.
4. **Testing**: Run `npm run typecheck` and automated unit test suites.
5. **Performance Verification**: Confirm 60 FPS target and 0-byte frame memory allocation.
6. **Documentation Update**: Update target GDOS specs, `CHANGELOG.md`, and `DECISION_LOG.md`.
7. **Quality Gate Check**: Verify all 10 points of the AI Quality Gate Checklist.
8. **Phase Completion**: Submit completed work package summary.
