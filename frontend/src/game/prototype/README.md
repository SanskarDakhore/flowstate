# FLOWSTATE — Prototype Evaluation Domain

This directory contains experimental instruments, metrics tracking, target interactions, and test session management for **Core Movement Lab v0.1**.

## Principles

1. **Isolation from Movement Engine**: Targets, interactions, and test metrics live outside `frontend/src/game/movement/`. Movement algorithms remain 100% focused on authoritative player simulation state.
2. **Framework-Neutral Logic**: Collision checks and session tracking use `Vector3State` math without referencing Babylon.js scene objects.
3. **Data Model Separation**:
   - `PrototypeTargetDefinition`: Immutable spatial target layout (`id`, `type`, `position`, `radius`).
   - `PrototypeTargetState`: Dynamic runtime tracking (`passed`, `hit`, `missed`).
