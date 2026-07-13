# Domain: Gameplay

## Overview
Core gameplay mechanics: 3D movement models, input intent normalization, flow path navigation, collision interaction detection, session telemetry metrics, and presentation syncing.

## Current Status
- **Core Movement Lab v0.1 Implemented**
- Evaluating three experimental movement models: `Guided Flow` (`guided-flow`), `Free Flow` (`free-flow`), and `Branching Flow` (`branching-flow`).
- Authoritative simulation logic isolated in `frontend/src/game/movement/`.
- Prototype testing targets and metrics isolated in `frontend/src/game/prototype/`.

## Confirmed Decisions
- True 3D direction and Babylon.js presentation engine confirmed.
- Simulation state is 100% framework-neutral (`Vector3State`, `PlayerState`).
- All movement models are **EXPERIMENTAL** until playtest completion.

## Key Files
- `frontend/src/game/movement/movement-controller.ts`
- `frontend/src/game/movement/movement-model.ts`
- `frontend/src/game/movement/movement-types.ts`
- `frontend/src/game/movement/movement-intent.ts`
- `frontend/src/game/movement/movement-config.ts`
- `frontend/src/game/movement/flow-path.ts`
- `frontend/src/game/movement/models/guided-flow-movement.ts`
- `frontend/src/game/movement/models/free-flow-movement.ts`
- `frontend/src/game/movement/models/branching-flow-movement.ts`
- `frontend/src/game/prototype/prototype-session.ts`
- `frontend/src/game/prototype/prototype-target.ts`
- `frontend/src/game/prototype/prototype-interaction-system.ts`
- `frontend/src/game/prototype/prototype-metrics.ts`

## Open Questions
- Which movement model produces the highest combination of flow, control, accessibility, and replayability on mobile touch devices? (To be decided via playtesting)
