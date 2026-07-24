---
Title: "Repository Knowledge Base"
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

# Repository Knowledge Base & Workspace Map

## Monorepo Workspace Map
- **`frontend/`**: Core WebGL 3D game client (Babylon.js), UI screens, HUD, and physics solvers.
- **`middleware/`**: Express / Node.js API gateway and WebSocket session handlers.
- **`backend/`**: Serverless cloud functions, database schemas, and analytics processing.
- **`shared/`**: Shared TypeScript types, vector math utilities, and spline calculators.
- **`FLOWSTATE_MASTER_GUIDE/`**: AI-Native Game Development Operating System (GDOS).
- **`.agents/AGENTS.md`**: AI repository rules and Do-Not-Break constraints.

## Critical Entry Points
- Game Client Entry: `frontend/src/main.ts`
- Render Engine Canvas: `frontend/src/rendering/canvas-engine.ts`
- Physics Movement Solver: `frontend/src/core/physics/movement-engine.ts`
- CSS Tokens: `frontend/src/ui/styles/tokens.css`
