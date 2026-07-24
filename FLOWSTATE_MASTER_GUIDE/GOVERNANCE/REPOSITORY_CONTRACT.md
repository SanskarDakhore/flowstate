---
Title: "Repository Contract"
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

# Repository Contract & Workspace Boundaries

## Workspace Ownership Structure
- **`frontend/`**: WebGL 3D game client, Babylon.js rendering, UI screens, HUD, and physics solvers.
- **`middleware/`**: Node.js Express gateway and WebSocket sync services.
- **`backend/`**: Cloud functions, serverless API, and database schemas.
- **`shared/`**: Shared TypeScript types, vector math, and spline calculators.
- **`FLOWSTATE_MASTER_GUIDE/`**: AI-Native Game Development Operating System (GDOS). Primary Source of Truth.

## Folder Classifications
- **Protected Folders**: `frontend/src/core/physics/`, `shared/math/`
- **Generated Folders**: `node_modules/`, `dist/`, `build/`
- **Temporary Folders**: `.system_generated/`, `scratch/`
- **Governance Folders**: `FLOWSTATE_MASTER_GUIDE/GOVERNANCE/`, `.agents/`

## Rules of Engagement
- **Never Edit**: Generated bundles, vendor packages, or locked core physics solvers without formal ADR approval.
- **Always Inspect**: Inspect exact file definitions before dereferencing symbol parameters.
- **Allowed Modifications**: Spec files, UI screens, living world simulation modules, test suites.
- **Required Approvals**: Architectural changes require explicit User approval via Implementation Plan.
