# State Machine

High-level game state management.

## Responsibility

- Manage transitions between major game states (MainMenu, Playing, Paused, Results)
- Provide clean Enter/Update/Exit lifecycle per state

## Key Files

- `IGameState.cs` — Interface for state implementations
- `GameStateMachine.cs` — State machine with transition logic

## Rules

- This is for high-level game flow only
- Do not use for animation, AI, or per-entity state machines
- States should not directly reference other states — use the machine to transition
