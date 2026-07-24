---
Title: "Merge Policy"
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

# Final Merge Policy

Before declaring any implementation phase merged or complete, Antigravity IDE / Codex MUST verify:

- [ ] **1. Build**: Workspace builds cleanly without errors.
- [ ] **2. Typecheck**: `npm run typecheck` returns 0 errors across all monorepo packages.
- [ ] **3. Lint**: Code passes linter checks cleanly.
- [ ] **4. Tests**: All unit tests pass cleanly (`npm test`).
- [ ] **5. Benchmarks**: Frame budget (16.67ms) and memory limits respected.
- [ ] **6. Specs**: Relevant GDOS specification documents updated.
- [ ] **7. Decision Log**: Architectural choices recorded in `DECISION_LOG.md`.
- [ ] **8. Changelog**: Workspace deltas documented in `CHANGELOG.md`.
- [ ] **9. Lessons Learned**: Discoveries logged in `LESSONS_LEARNED.md`.
- [ ] **10. Quality Gate**: All 10 points in [ENGINEERING_CONSTITUTION.md](../00_PROJECT_CORE/ENGINEERING_CONSTITUTION.md#10-master-10-point-ai-quality-gate-checklist) verified.
