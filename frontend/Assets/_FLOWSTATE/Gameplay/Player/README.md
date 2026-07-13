# Player

Player entity systems for FLOWSTATE.

## Responsibility

- Control the player's glowing entity
- Coordinate input, movement, and session state
- Provide a clean interface for other systems to query player state

## Key Files

- `PlayerController.cs` — Central coordinator between subsystems
- `PlayerMovement.cs` — Continuous movement along paths
- `PlayerState.cs` — Session-scoped runtime state

## Rules

- PlayerController coordinates but does not contain movement math or input parsing
- PlayerState is session-scoped — persistence is handled by the SaveSystem service
- Presentation systems react to player state via events, not direct polling
