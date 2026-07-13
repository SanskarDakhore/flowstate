# Debug

Development-only debug tools and utilities.

## Responsibility
- In-game debug console
- Performance overlays
- Cheat commands for testing
- State inspection tools

## Rules
- Everything in this directory must be stripped from release builds
- Use `#if UNITY_EDITOR || DEVELOPMENT_BUILD` guards
