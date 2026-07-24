---
Title: "Coding Patterns"
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

# Coding Conventions & Standards

1. **TypeScript Strictness**: Zero `any` types permitted. All functions must declare explicit parameter and return types.
2. **Immutability by Default**: Mark all interface fields `readonly` unless internal mutation is explicitly required.
3. **CSS Variable Access**: Access colors via `getComputedStyle(document.documentElement).getPropertyValue('--flow-cyan-400')` or CSS class bindings.
4. **Error Handling**: Never catch and swallow exceptions silently. Log structured errors to telemetry.
