# Modes

Game mode definitions and configuration.

## Responsibility

- Define different game modes (e.g., Classic, Endless, Challenge, Daily)
- Configure mode-specific rules, difficulty curves, and scoring
- Provide mode selection data to UI

## Rules

- Each mode defines its own rules but shares core gameplay systems
- Mode-specific logic should not leak into core gameplay code
- New modes should be addable without modifying existing mode implementations
