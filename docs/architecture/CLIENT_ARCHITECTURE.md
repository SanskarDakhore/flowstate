# Client Architecture

## Overview
True 3D mobile game client package powered by **Babylon.js (`@babylonjs/core`)** using a clean presentation-bridge architecture, generic engine lifecycle contract, and Vite local browser development tooling.

## Presentation Bridge & Layering

```text
Raw Input (Touch / Drag / Pointer / WASD)
        │
        ▼
Normalized Movement Intent (-1.0 to 1.0)
        │
        ▼
Movement Domain (frontend/src/game/movement/)
├── MovementController (Intent smoothing & delta clamping)
├── Movement Models (Guided Flow | Free Flow | Branching Flow) [EXPERIMENTAL]
└── FlowPath (3D Math spline path query API)
        │
        ▼
Authoritative PlayerState (position, velocity, forward, speed)
        │
        ├──→ Prototype Domain (frontend/src/game/prototype/)
        │    ├── PrototypeSession (30-90s timer & course progress)
        │    ├── PrototypeInteractionSystem (Target pass/hit detection)
        │    └── PrototypeMetrics (Speed, path deviation, targets log)
        │
        ▼
Presentation Bridge
├── PlayerView (setPosition)
└── WorldPresentation (setHarmonyLevel)
        │
        ▼
Babylon 3D Scene Layer
├── GameplayScene (Scene assembly & Target 3D primitives rendering)
├── GameplayCamera (Target lerp follow camera)
├── GameplayLighting (Hemispheric & Directional light intensity)
├── EnvironmentView (Background clear color & ground ambient glow)
└── BabylonPlayerView (Glowing emissive orb primitive)
        │
        ▼
BabylonRenderingEngine (Generic Lifecycle: initialize, start, stop, resize, dispose)
        │
        ▼
   Babylon.js (WebGL Canvas Surface)
```

## Domain Isolation Principles
- **Movement Domain**: Authoritative gameplay state and movement math. Zero dependencies on Babylon.js or DOM.
- **Prototype Domain**: Experimental evaluation instruments (targets, collisions, session timer, telemetry metrics).
- **Presentation Domain**: Babylon 3D visualization adapters.

## Coordinate System Conventions
- **Handedness:** Left-handed coordinate system (Babylon.js standard default).
- **Up Axis:** Y-positive (`+Y` = Up).
- **Right Axis:** X-positive (`+X` = Right).
- **Forward Axis:** Z-positive (`+Z` = Forward into screen depth).
- **World Scale:** 1 unit = 1 meter.

## Camera Strategy
- Smooth lerp target follow camera (`GameplayCamera`) pointing at player position vector with configurable follow offsets.
