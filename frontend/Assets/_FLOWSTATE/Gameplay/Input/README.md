# Input

Input handling system for FLOWSTATE.

## Responsibility

- Detect tap, swipe, and hold gestures from touch/mouse input
- Route input to appropriate handlers
- Decouple raw input from gameplay response
- Support enabling/disabling input during transitions

## Key Files

- `InputRouter.cs` — Routes raw input to gesture handlers
- `TapInputHandler.cs` — Tap detection for interactions
- `SwipeInputHandler.cs` — Swipe detection for direction changes
- `HoldInputHandler.cs` — Hold detection for sustained effects

## Rules

- Input handlers detect gestures and publish events — they do not execute gameplay logic
- Gameplay systems subscribe to input events via GameEventBus
- Input can be disabled during scene transitions or UI overlays
- Phase 2: Migrate from legacy Input to Unity Input System package
