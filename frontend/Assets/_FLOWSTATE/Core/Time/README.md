# Time

Time management utilities for FLOWSTATE.

## Responsibility

- Provide consistent time access for gameplay systems
- Support pause-aware time scaling
- Enable deterministic time stepping for testing

## Planned Files

- `GameTime.cs` — Central time provider with pause support
- `TimeScale.cs` — Time scale management for slow-motion effects

## Rules

- Gameplay systems should use GameTime, not UnityEngine.Time directly
- This enables deterministic testing and pause-aware logic
