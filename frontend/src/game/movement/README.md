# FLOWSTATE — Core Movement Architecture

This module houses the framework-independent movement simulation layer for FLOWSTATE.

## Architecture & Data Flow

```text
Raw Input
    ↓
Input Adapter & Router
    ↓
Normalized Movement Intent (horizontal, vertical: -1.0 → 1.0)
    ↓
Movement Controller (Intent Smoothing & Active Model Orchestration)
    ↓
Movement Model (Guided Flow | Free Flow | Branching Flow) + FlowPath
    ↓
Authoritative Player Simulation State (position, velocity, forward, speed)
```

## Core Principles

1. **Framework Independence**: Zero dependencies on Babylon.js (`BABYLON.Vector3`, `Scene`, `Mesh`) or DOM primitives. Uses `Vector3State` and math primitives.
2. **Delta Time Safety**: Frame deltas are clamped to maximum limits (100ms) to ensure stability across frame drops, tab switching, and browser pauses.
3. **Pure Movement Scope**: `MovementController` only handles movement updates, active model selection, input smoothing, and simulation resets. Target collision checks and prototype session tracking live in `frontend/src/game/prototype/`.

## Available Movement Models

- **Guided Flow** (`guided-flow-movement.ts`): Continuous forward progression along a 3D spline corridor (`FlowPath`) with steering offset along path normal/binormal vectors.
- **Free Flow** (`free-flow-movement.ts`): Continuous forward speed with 3D directional yaw/pitch control within elastic volumetric boundaries.
- **Branching Flow** (`branching-flow-movement.ts`): Guided progression with real-time multi-lane route branching choices.
