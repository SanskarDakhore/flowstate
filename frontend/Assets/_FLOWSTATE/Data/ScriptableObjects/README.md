# Data — ScriptableObjects

ScriptableObject definitions for design-time configuration.

## Responsibility
- Define configurable data assets (gameplay tuning, level data, cosmetic definitions)
- Enable designers to tweak values without code changes

## Rules
- ScriptableObjects are for design-time data, not runtime state
- Keep ScriptableObject classes in this directory, instances in Assets/Resources or similar
