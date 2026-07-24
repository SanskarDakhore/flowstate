---
Title: "Implementation Checklist"
Module: "00_PROJECT_CORE"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.05"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [98_CANON, 99_PROJECT_MEMORY]
Provides: [Engineering Constitution & Code Review Governance]
Blocks: [Phase 00.06, Implementation Phases]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Pre-Merge Implementation Checklist

Use this one-page checklist before merging any code modification or pull request into main:

### Code Quality & Types
- [ ] Explicit TypeScript types assigned (zero `any` types).
- [ ] No circular dependencies introduced (`npm run typecheck` returns 0 errors).
- [ ] No hardcoded hex colors or inline style overrides in TS components.
- [ ] All colors derive from `tokens.css` variables.

### Architecture & Safety
- [ ] Protected files in `Do_Not_Break_Rules.md` remain untouched.
- [ ] UI components consume read-only telemetry payloads only.
- [ ] Event listeners cleanly removed on unmount.

### Performance & Memory
- [ ] Zero object allocations inside frame update loops.
- [ ] Draw call budget ($< 40$ calls) and VRAM budget ($< 100 \text{ MB}$) respected.

### Documentation & Memory
- [ ] `99_PROJECT_MEMORY/DECISION_LOG.md` updated for any architectural choice.
- [ ] `99_PROJECT_MEMORY/CHANGELOG.md` updated under active version.

## Related Core Documents
- [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md)
- [PHASE_COMPLETION_CHECKLIST.md](PHASE_COMPLETION_CHECKLIST.md)
