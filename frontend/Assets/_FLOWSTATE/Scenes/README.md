# Scenes

Scene routing and navigation for FLOWSTATE.

## Responsibility

- Define all navigable scenes in the game
- Handle async scene loading with transitions
- Prevent duplicate transitions
- Support loading screens and transition effects

## Key Files

- `SceneId.cs` — Enum of all scene identifiers
- `SceneRouter.cs` — Scene loading and navigation management

## Scene Flow

```
Bootstrap → Splash → MainMenu → ModeSelection → Gameplay → Results
                        ↕            ↕
                     Profile     Leaderboard
                     Settings    Cosmetics
```

## Rules

- Scene names in `SceneId` must match actual Unity scene file names
- All scene transitions go through `SceneRouter` — never call `SceneManager` directly
- Only one transition can be in progress at a time
