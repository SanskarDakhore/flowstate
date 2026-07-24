---
Title: "Vegetation Growth & Blooming Model"
Module: "04_LIVING_WORLD_SIMULATION"
Status: Active
Priority: High
Milestone: 2
Phase: "02.03"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 98_CANON]
Provides: [Vegetation Biological Growth & Blooming Model Specification]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 3 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Vegetation Growth & Blooming Model Specification

## 1. Objective
Define the mathematical simulation model for continuous vegetation growth, flower blooming, leaf density variation, and tree vitality driven by environmental energy, harmony, weather humidity, and recovery rate without random number generators.

## 2. Biological Growth & Blooming Differential Equations
Vegetation health $H(t)$ and bloom progress $B(t)$ evolve continuously per tick $\Delta t$:
$$ H_{t+\Delta t} = H_t + \left(\text{environmentEnergy} \times \text{harmony} \times 0.05 - \lambda_{\text{decay}} H_t\right) \Delta t $$
$$ B_{t+\Delta t} = \begin{cases} B_t + (H_t - 0.5) \times 0.1 \Delta t & \text{if } H_t \ge 0.5 \\ B_t - 0.05 \Delta t & \text{if } H_t < 0.5 \end{cases} $$
where $H_t \in [0.0, 1.0]$ and $B_t \in [0.0, 1.0]$.

## 3. Presentation Mapping Equations
- `grassHeight` = $0.2 + (H_t \times 0.8)$
- `flowerDensity` = $\max(0.0, B_t \times 1.0)$
- `leafDensity` = $0.3 + (H_t \times 0.7)$
- `treeVitality` = $0.5 + (H_t \times 0.5)$
- `colorVariation` = $H_t$

## 4. SLAs & Verification Criteria
- **Random Generators**: Strictly **0 calls** to `Math.random()`.
- **Memory Allocation**: **0 bytes** during steady-state tick updates.
- **CPU Time**: $\le 0.2\text{ ms}$ within simulation budget.
