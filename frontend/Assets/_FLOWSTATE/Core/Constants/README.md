# Constants

Project-wide constants for FLOWSTATE.

## Responsibility

- Define magic numbers, string keys, and configuration constants
- Provide a single source of truth for values used across systems

## Planned Files

- `GameConstants.cs` — Gameplay constants (speeds, timings, thresholds)
- `Tags.cs` — Unity tag strings
- `Layers.cs` — Unity layer indices
- `AnimationKeys.cs` — Animator parameter keys

## Rules

- All constants must be documented with their purpose
- Do not put environment-specific values here — use BootstrapConfig
