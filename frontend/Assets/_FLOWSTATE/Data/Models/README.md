# Data — Models

Data model classes used across the game client.

## Responsibility
- Define data structures for API responses, game state, configuration
- Serializable models for Unity's JsonUtility

## Rules
- Models are data containers — no business logic
- Client models may differ from backend database models
- Use shared contracts (from `/shared/`) where applicable
