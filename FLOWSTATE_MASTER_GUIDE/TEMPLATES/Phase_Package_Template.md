---
Title: "[System / Spec Name]"
Module: "[Module ID, e.g. 01_GAMEPLAY]"
Status: Planned
Priority: High
Milestone: 1
Phase: "01"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: []
Provides: []
Blocks: []
Estimated Work: 2-4 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Phase Package Structure Template

A complete phase package consists of 7 self-contained markdown documents inside `AGENT_PROMPTS/Phase_XX/`:

1. **README.md**: Overview, objectives, and package document directory.
2. **Context.md**: Background context, architectural history, and dependencies.
3. **Task.md**: Step-by-step executable prompt for Antigravity IDE / Codex.
4. **Acceptance.md**: Machine & human validation criteria (10-Point AI Quality Gate).
5. **Regression.md**: Do-not-break rules and protected file registry.
6. **Verification.md**: Automated build & test execution commands.
7. **Rollback.md**: Emergency rollback and workspace reset protocol.
