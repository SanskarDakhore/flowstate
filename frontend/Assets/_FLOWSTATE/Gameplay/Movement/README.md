# Movement

Path-based movement system for FLOWSTATE.

## Responsibility

- Define movement paths and curves through the world
- Calculate player position along paths
- Handle path transitions and branching
- Support speed modifiers from gameplay state

## Planned Files

- `PathFollower.cs` — Follow a defined path with configurable speed
- `MovementConfig.cs` — ScriptableObject for movement parameters

## Rules

- Movement is continuous — the player always moves
- Input affects direction choices, not whether the player moves
- Speed can be modified by flow state, obstacles, and harmony level
