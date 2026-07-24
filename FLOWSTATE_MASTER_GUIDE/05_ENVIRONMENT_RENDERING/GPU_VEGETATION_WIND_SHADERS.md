---
Title: "GPU Instanced Vegetation & Wind Shaders Specification"
Module: "05_ENVIRONMENT_RENDERING"
Status: Active
Priority: High
Milestone: 3
Phase: "03.03"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 05_ENVIRONMENT_RENDERING]
Provides: [GPU Instanced Vegetation Wind Shaders Specification]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 3 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# GPU Instanced Vegetation & Wind Shaders Specification

## 1. Objective
Define the mathematical displacement equations and packed GPU instance buffer layout for high-density instanced grass blades and tree canopies swaying under dynamic wind simulation.

## 2. Trigonometric Vertex Wind Displacement Equations
Horizontal displacement $\mathbf{D}(y, \mathbf{p}, t)$ for vertex height $y$ at world position $\mathbf{p} = (x, z)$ at time $t$:
$$ \mathbf{D}(y, \mathbf{p}, t) = \left(\frac{y}{h}\right)^2 \left[ A_1 \sin\left(\omega_1 t + k_1 (x + z)\right) + A_2 \cos\left(\omega_2 t + k_2 (x - z)\right) \right] \hat{\mathbf{w}} $$
where:
- $(y/h)^2$ enforces quadratic height bending stiffness (ground stays anchored at $y=0$).
- $\hat{\mathbf{w}}$ is normalized wind direction vector.
- $A_1, A_2$ are wind gust amplitudes.
- $\omega_1, \omega_2$ are sway frequencies.

## 3. GPU Instance Buffer Layout (Packed 16 Floats)
- `mat4 instanceMatrix`: 16-element column-major transform matrix per instance.

## 4. SLAs & Verification Criteria
- **Random Generators**: Strictly **0 calls** to `Math.random()`.
- **Memory Allocation**: **0 bytes** during steady-state tick updates.
- **CPU Time**: $\le 0.2\text{ ms}$ within simulation budget.
