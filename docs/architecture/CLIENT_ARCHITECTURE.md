# Client Architecture

## Overview
Unity game client using a service-based architecture with event-driven communication.

## Layers
1. **Core** — Bootstrap, service registry, events, state machine
2. **Gameplay** — Player, input, movement, energy, scoring, harmony
3. **Presentation** — Camera, VFX, animation, environment, lighting
4. **UI** — Screen navigation, HUD, components
5. **Services** — Auth, profile, progression, networking
6. **Data** — Models, ScriptableObjects, persistence
7. **Platform** — Android/iOS abstractions

See `frontend/README.md` for full structure.
