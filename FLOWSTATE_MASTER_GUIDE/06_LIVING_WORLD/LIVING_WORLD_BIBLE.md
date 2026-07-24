---
Title: "Living World Bible & Environmental Emotion Model"
Module: "06_LIVING_WORLD"
Status: Active Authority
Priority: Critical
Milestone: 4
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 98_CANON]
Provides: [Living World Master Philosophy & Experience Hierarchy]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: Master Design Guide
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Living World Bible — The Emotional Design Authority

## 1. Core World Philosophy & Emotional Identity
FLOWSTATE is not a game about conquering an environment. It is a game about **healing a living valley through flow state alignment**.

The world does not react mechanically; it reacts **emotionally**:
- **Curious**: Watching player movement from afar.
- **Calm**: Gentle breezes, quiet ambient murmurs.
- **Welcoming**: Sunshafts opening, flowers unfurling towards the player.
- **Resting**: Warm golden twilight, quiet wildlife nestling.
- **Celebrating**: Flourishing blooms, flocking birds, glowing ambient energy rings.
- **Recovering**: Persistent valley growth, clear streams, permanent flower patches.

```
                  EMOTIONAL SPECTRUM MATRIX
+------------+-------------+---------------+-------------+
| Simulation | Emotion     | Sky / Color   | World State |
+------------+-------------+---------------+-------------+
| IDLE       | Lonely      | Cold Indigo   | Resting     |
| AWAKENING  | Quiet       | Soft Dawn     | Awakening   |
| GROWING    | Hopeful     | Fresh Azure   | Flourishing |
| BLOOMING   | Alive       | Warm Cyan     | Blooming    |
| THRIVING   | Joyful      | Luminous Gold | Thriving    |
| TRANSCENDENT| Sacred     | Radiant Rose  | Transcendent|
+------------+-------------+---------------+-------------+
```

## 2. Life Hierarchy Principle
Every system influences everything below it in a strict one-way biological chain:

```
World (Global Session State)
  ↓
Sky (Solar Arc & Celestial Gradient)
  ↓
Weather (Atmosphere, Wind, Humidity, Mist)
  ↓
Light (Color Temperature & Volumetric Sunshafts)
  ↓
Terrain (Color Grading, Moisture & Splat Blends)
  ↓
Vegetation (Grass Height, Leaf Canopy & Flower Blooms)
  ↓
Wildlife (Creature Emergence, Birds, Flocks & Spirits)
  ↓
Particles (Floating Pollen & Kinetic Energy Dust)
  ↓
Audio (Musical Stems, Ambient Soundscape & Haptics)
  ↓
Player (Emotional Resonance & Flow Experience)
```

## 3. Experience Architecture Layer

```
Gameplay Snapshot
        ↓
Simulation Engine
        ↓
Presentation Snapshot
        ↓
Experience Resolver  <--- [NEW LAYER: Maps state to Emotional Context]
        ↓
Environment Renderers & Audio
```

The **Experience Layer** determines *what emotion the player should feel right now*, translating telemetry and simulation into curated emotional parameters (`emotionalMood`, `worldWarmth`, `sanctuaryState`).

## 4. World Memory (Persistent Healing)
The valley remembers good play over time:
- **Persistent Biomass**: Unlocked flower patches remain bloomed for the remainder of the session.
- **Fauna Sanctuary**: Returned birds and wildlife do not vanish abruptly when flow drops.
- **Atmospheric Warmth**: The sun elevation and sky tone remain elevated once milestones are unlocked.

## 5. Decision Checklist for Living World Features
Before adding any feature to Milestone 4, it must pass four mandatory criteria:
1. **Does this make the world feel more alive?**
2. **Will the player actually notice and appreciate it?**
3. **Does it reinforce FLOWSTATE's calming identity?**
4. **Can it be implemented using existing architecture without expanding engine code?**
