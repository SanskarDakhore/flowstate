# UI Navigation

UI routing and navigation system for FLOWSTATE.

## Responsibility

- Manage full-screen navigation with history stack
- Handle modal display (one at a time, with dimming)
- Manage overlays (multiple allowed simultaneously)
- Control gameplay HUD visibility
- Separate from scene routing — UI routing works within scenes

## Key Files

- `RouteId.cs` — Enum of all UI routes with type categorization
- `UIRouter.cs` — Navigation manager with stack-based history

## Navigation Types

| Type | Behavior | Example |
|------|----------|---------|
| Screen | Replaces current full-screen view | MainMenu → ModeSelection |
| Modal | Overlays with dimming, one at a time | Pause, Confirmation |
| Overlay | Lightweight, multiple allowed | Loading, Notification |
| HUD | Persistent during gameplay | Score, combo, energy |

## Rules

- UI navigation does not trigger scene loads — use SceneRouter for that
- Only one modal at a time
- GoBack() dismisses modals before popping screens
- Do not tightly couple UI navigation to gameplay logic
