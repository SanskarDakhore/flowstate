---
Title: "Kinetic Particle Field & Energy Flow Simulation Specification"
Module: "05_ENVIRONMENT_RENDERING"
Status: Active
Priority: High
Milestone: 3
Phase: "03.04"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 05_ENVIRONMENT_RENDERING]
Provides: [Kinetic Particle Field Model Specification]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Kinetic Particle Field & Energy Flow Simulation Specification

## 1. Executive Summary & Research Benchmark
This specification defines FLOWSTATE's high-density kinetic particle field simulation engine. Inspired by Unreal Engine Niagara and Guerrilla Games' Decima particle architecture, the engine executes zero heap allocations per tick using a fixed contiguous 14-float stride `Float32Array` buffer.

```
+-----------------------------------------------------------------------------------+
|                        PARTICLE BUFFER STRIDE (14 FLOATS)                         |
+----+----+----+----+----+----+------+---------+------+---+---+---+---+-------------+
| px | py | pz | vx | vy | vz | life | maxLife | size | r | g | b | a | type (id)   |
+----+----+----+----+----+----+------+---------+------+---+---+---+---+-------------+
```

## 2. Kinematic Motion & Flow Vector Integration
Particle positions $\mathbf{p}_i(t)$ evolve via semi-implicit Euler integration coupled with environmental energy flow vectors $\mathbf{V}_{\text{flow}}$:
$$ \mathbf{v}_i(t + \Delta t) = \mathbf{v}_i(t) \cdot \mathrm{e}^{-\gamma \Delta t} + \left( \mathbf{V}_{\text{flow}} \times \mathbf{k}_{\text{turb}} + \mathbf{g}_{\text{up}} \right) \Delta t $$
$$ \mathbf{p}_i(t + \Delta t) = \mathbf{p}_i(t) + \mathbf{v}_i(t + \Delta t) \Delta t $$
where:
- $\gamma = 0.5$ is atmospheric drag coefficient.
- $\mathbf{k}_{\text{turb}}$ is turbulence factor derived from player flow score.
- $\mathbf{g}_{\text{up}} = (0, 0.5, 0)$ is subtle anti-gravity buoyancy vector.

## 3. Normalized Lifetime Fade Curve
Opacity $\alpha(t)$ follows a smooth cubic Hermite fade-in/fade-out curve:
$$ \tau = \frac{t_{\text{life}}}{t_{\text{max}}} \in [0, 1] $$
$$ \alpha(\tau) = 4.0 \cdot \tau \cdot (1.0 - \tau) $$

## 4. SLAs & Verification Criteria
- **Allocations**: **0 bytes** heap allocation per frame tick during active simulation.
- **Max Active Particles**: Up to **50,000 particles** at 60 FPS on mid-tier mobile GPUs.
- **CPU Time**: $\le 0.3\text{ ms}$ simulation update budget.
