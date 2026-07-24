---
Title: "Data-Driven Biome Asset & Splat Material Specification"
Module: "05_ENVIRONMENT_RENDERING"
Status: Active
Priority: High
Milestone: 3
Phase: "03.01"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 05_ENVIRONMENT_RENDERING]
Provides: [Data-Driven Biome & Splat Material Specification]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 3 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Data-Driven Biome Asset & Splat Material Specification

## 1. Objective
Define the data-driven biome configuration architecture and procedural splat material blending model for terrain geometry, ensuring smooth transitions across biomes (`Valley`, `AlpineMeadow`, `DesertCanyon`, `MysticForest`, `TranscendentVoid`) driven by environment presentation snapshots.

## 2. Splat Material Blending Model
Texture weights $W_i$ across 4 splat channels (Grass, Rock, Dirt, Sand) are computed per vertex/pixel via height-based sigmoid interpolation:
$$ W_i = \frac{\exp(h_i / T)}{\sum_j \exp(h_j / T)} $$
where $h_i$ is height-map elevation and $T$ is the blend sharpness threshold ($T = 0.1$).

## 3. Biome Configurations
- `Valley`: Grass (60%), Rock (20%), Dirt (20%)
- `AlpineMeadow`: Grass (70%), Flower Meadow (20%), Rock (10%)
- `DesertCanyon`: Sand (60%), Rock (30%), Dirt (10%)
- `MysticForest`: Moss (50%), Grass (30%), Dirt (20%)
- `TranscendentVoid`: Crystal Grid (80%), Energy Scrim (20%)

## 4. SLAs & Verification Criteria
- **Random Generators**: Strictly **0 calls** to `Math.random()`.
- **Memory Allocation**: **0 bytes** during steady-state tick updates.
- **CPU Time**: $\le 0.2\text{ ms}$ within simulation budget.
