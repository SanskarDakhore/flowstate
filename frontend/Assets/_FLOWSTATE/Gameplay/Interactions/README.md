# Interactions

Object interaction system for FLOWSTATE.

## Responsibility

- Define interactable objects in the world
- Handle activation via tap, proximity, or hold
- Trigger effects on the world and player state

## Rules

- Interactions publish events — they don't directly modify scoring or harmony
- Visual/audio responses are handled by Presentation and Audio layers
