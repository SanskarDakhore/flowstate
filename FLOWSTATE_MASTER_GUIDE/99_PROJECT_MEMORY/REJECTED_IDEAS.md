---
Title: "Rejected Ideas"
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

# Rejected Ideas Register

### REJ-001: Pay-to-Win Speed Boost Purchases
- **Idea**: Selling consumable speed boosts or collision shields for real money.
- **Reason for Rejection**: Violates Core Gameplay Law #5 ("Cosmetics Never Provide Gameplay Power") and Anti-Pattern #1.
- **Lessons Learned**: Gameplay integrity and player trust are non-negotiable core pillars.
- **Reconsideration**: NEVER.

---

### REJ-002: Monolithic Telemetry Overlay on Player HUD
- **Idea**: Rendering FPS counters, velocity vectors, and input graphs directly over the player sphere.
- **Reason for Rejection**: Violates Core Gameplay Law #10, Anti-Pattern #2, and DEC-003. Clutters player view and destroys flow state immersion.
- **Lessons Learned**: Technical metrics belong exclusively in `DevPanel`.
- **Reconsideration**: NEVER for Player HUD.

---

### REJ-003: Hardcoded CSS Hex Colors in TypeScript UI Classes
- **Idea**: Writing inline color strings like `#00ffff` inside TS component files.
- **Reason for Rejection**: Violates DEC-002 and Anti-Pattern #13. Causes visual drift and breaks dark mode theme consistency.
- **Lessons Learned**: All visual tokens must derive from `tokens.css`.
- **Reconsideration**: NEVER.
