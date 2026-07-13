# FLOWSTATE — Frontend Client Layer

JavaScript/TypeScript game client package for **FLOWSTATE**.

## Architecture Overview

```text
frontend/
├── src/
│   ├── core/           # Bootstrap, ServiceRegistry, StateMachine, EventBus
│   ├── game/           # Player movement, input adapters, gestures, commands
│   ├── rendering/      # Camera, effects, lighting, visual feedback
│   ├── audio/          # AudioManager, adaptive music stubs
│   ├── haptics/        # Adapter-based HapticsService
│   ├── ui/             # UIRouter, RouteId, HUD, navigation
│   ├── scenes/         # SceneRouter, SceneId
│   ├── networking/     # ApiClient, ApiRoutes, RequestBuilder, ResponseHandler
│   ├── services/       # Auth, Progression, Save system
│   ├── data/           # Models and client storage
│   ├── platform/       # Adapter interfaces for iOS/Android
│   └── main.ts         # Client entry point
├── public/assets/      # Art, audio, fonts, and data assets
└── tests/              # Unit and integration client tests
```

## Game Engine Decision

> **Status:** `TBD`
> The frontend client layer is structured with a framework-neutral TypeScript architecture. When a concrete 2D/3D rendering library (e.g. Phaser, PixiJS, Three.js, Babylon.js) and native mobile container (e.g. Capacitor, Expo, React Native) are confirmed, concrete renderers will bind cleanly to the core architecture without touching application business logic.
