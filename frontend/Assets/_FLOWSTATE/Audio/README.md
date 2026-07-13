# Audio

Audio system for FLOWSTATE.

## Responsibility

- Manage music playback, SFX, and adaptive audio
- React to harmony/flow state for dynamic music transitions
- Provide audio feedback for gameplay interactions

## Key Files

- `AudioManager.cs` — Central audio service
- `Music/` — Music track assets and playlists
- `SFX/` — Sound effect clips
- `AdaptiveMusic/` — Dynamic music layer system

## Rules

- Audio reacts to gameplay state but does not define gameplay logic
- Adaptive music layers should transition smoothly based on harmony level
- Audio must support muting and volume controls from Settings
- The audio experience should reinforce the calming identity of FLOWSTATE
