# Events

Typed event bus for decoupled communication between game systems.

## Responsibility

- Provide publish/subscribe messaging between systems
- Decouple gameplay, presentation, audio, and UI layers
- Enable systems to react to state changes without direct references

## Key Files

- `IGameEvent.cs` — Marker interface for all event types
- `GameEventBus.cs` — Static typed pub/sub dispatcher

## Usage

```csharp
// Define an event
public struct ScoreChangedEvent : IGameEvent
{
    public int NewScore;
    public int Delta;
}

// Subscribe
GameEventBus.Subscribe<ScoreChangedEvent>(OnScoreChanged);

// Publish
GameEventBus.Publish(new ScoreChangedEvent { NewScore = 100, Delta = 10 });
```

## Rules

- Events are data containers, not commands
- Handlers must not throw — errors are caught and logged
- Unsubscribe when the listener is destroyed
- Do not use events for frame-by-frame updates (use direct references for hot paths)
