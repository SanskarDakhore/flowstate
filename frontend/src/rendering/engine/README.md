# Rendering Engine Architecture

Babylon.js engine lifecycle implementation conforming to generic `RenderingEngine` interface.

```text
Simulation / Gameplay
        │
        ├── PlayerState
        └── HarmonyState
                │
                ▼
        Presentation Bridge
        ├── PlayerView (setPosition)
        └── WorldPresentation (setHarmonyLevel)
                │
                ▼
        Babylon Scene Layer (GameplayScene, GameplayCamera, GameplayLighting)
                │
                ▼
        BabylonRenderingEngine (Generic Lifecycle Only)
                │
                ▼
           Babylon.js
```

## Architectural Guidelines

- `RenderingEngine` stays purely generic (`initialize`, `start`, `stop`, `resize`, `dispose`).
- Presentation adapters (`PlayerView`, `WorldPresentation`) bridge simulation state updates to 3D meshes and environmental shaders/colors.
- Gameplay systems do not import Babylon objects or store game rules on meshes.
