# Frontend — Unity Game Client

This directory contains the FLOWSTATE Unity project for Android and iOS.

## Structure

- `Assets/_FLOWSTATE/` — All game-specific code and assets
  - `Core/` — Bootstrap, architecture, events, state machine, utilities
  - `Gameplay/` — Player, input, movement, energy, scoring, harmony, etc.
  - `Presentation/` — Camera, VFX, animation, environment, lighting
  - `Audio/` — Music, SFX, adaptive audio
  - `Haptics/` — Platform haptic feedback
  - `UI/` — Screen navigation, HUD, components, themes
  - `Scenes/` — Scene routing
  - `Networking/` — API client
  - `Services/` — Auth, profile, progression, leaderboards, etc.
  - `Data/` — Models, ScriptableObjects, persistence
  - `Platform/` — Android/iOS abstractions
  - `Debug/` — Development tools
  - `Editor/` — Custom editor extensions
- `Assets/Art/` — Visual assets
- `Assets/Audio/` — Audio clips
- `Assets/Materials/` — Materials and shaders
- `Assets/Prefabs/` — Prefab library
- `Assets/Scenes/` — Unity scene files
- `Assets/Resources/` — Runtime-loaded resources
- `Assets/StreamingAssets/` — Platform streaming assets
- `Assets/Tests/` — EditMode and PlayMode tests

## Getting Started

1. Open Unity Hub
2. Add this directory as a project
3. Use Unity 2022.3 LTS or later
4. Open `Assets/Scenes/Bootstrap` scene to start

## Architecture Rules

- Gameplay logic must not depend on UI, presentation, or networking
- Presentation reacts to gameplay state but does not define game rules
- Services are accessed through the ServiceRegistry, not direct singletons
- Platform-specific code is isolated in `Platform/`
