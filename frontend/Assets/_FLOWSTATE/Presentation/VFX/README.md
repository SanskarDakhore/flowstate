# VFX

Visual effects for FLOWSTATE.

## Responsibility
- Particle systems for energy collection, flow state, world transformation
- Post-processing effects that respond to harmony level
- Trail effects for the player entity

## Rules
- VFX react to gameplay state via events — they do not define gameplay
- Effects should be mobile-optimized (draw call budget, particle counts)
- Higher harmony = more vibrant, alive effects
