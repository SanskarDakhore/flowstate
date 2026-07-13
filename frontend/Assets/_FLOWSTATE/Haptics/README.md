# Haptics

Haptic feedback service for FLOWSTATE.

## Responsibility

- Provide tactile feedback for gameplay interactions
- Abstract platform-specific haptic APIs (iOS Taptic Engine, Android vibration)
- Support intensity levels matching gameplay significance

## Key Files

- `HapticsService.cs` — Platform-abstracted haptic feedback

## Rules

- Haptics enhance the calming experience — they should feel satisfying, not jarring
- Must support user toggle (some players prefer no haptics)
- Platform-specific implementations go in `Platform/Android/` and `Platform/iOS/`
