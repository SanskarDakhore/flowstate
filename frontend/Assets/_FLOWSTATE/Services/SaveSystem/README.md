# Save System

Local persistence and save management.

## Responsibility
- Save and load game state locally
- Support save migration across versions
- Coordinate with cloud sync when online

## Rules
- Local saves are the fallback — game must work offline
- Save format should be versioned for migration support
