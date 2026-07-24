---
Title: "Open Problems"
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

# Open Engineering & Design Problems

### PRB-001: Zero-Allocation GPU Instancing Memory Footprint
- **Description**: Instanced foliage rendering must achieve 0-byte memory allocation per frame while dynamically spawning flowers around moving sphere position.
- **Priority**: High
- **Dependencies**: `05_ENVIRONMENT_RENDERING`, `18_OPTIMIZATION_LOD`
- **Possible Solutions**: Reusable ring buffer for instance transformation matrices; compute shader matrix updates.
- **Assigned Milestone**: Milestone 2 (Phase 24)

---

### PRB-002: Deterministic Cross-Platform Replay Floating Point Sync
- **Description**: Asynchronous ghost replays must produce exact trajectory matches across x86 and ARM float implementations.
- **Priority**: High
- **Dependencies**: `02_PHYSICS`, `19_SOCIAL_MULTIPLAYER`
- **Possible Solutions**: Fixed-point math solver for ghost recordings; trajectory waypoint quantization.
- **Assigned Milestone**: Milestone 5 (Phase 83)
