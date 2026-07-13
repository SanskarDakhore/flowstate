# Architecture

Core architectural building blocks for FLOWSTATE.

## Responsibility

- Define the service interface and registration pattern
- Provide shared game context without global singletons
- Establish dependency boundaries

## Key Files

- `IService.cs` — Base interface all services implement
- `ServiceRegistry.cs` — Central service locator with explicit registration
- `GameContext.cs` — Shared cross-system state holder

## Rules

- Services are registered during bootstrap, not lazily
- Access services through `ServiceRegistry.Get<T>()`, not static singletons
- GameContext holds references, not business logic
- Do not add domain-specific logic to this module
