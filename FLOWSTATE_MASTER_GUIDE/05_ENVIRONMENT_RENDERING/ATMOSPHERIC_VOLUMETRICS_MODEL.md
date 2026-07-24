---
Title: "Atmospheric Volumetrics & Sunshaft Lighting Specification"
Module: "05_ENVIRONMENT_RENDERING"
Status: Active
Priority: High
Milestone: 3
Phase: "03.02"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 05_ENVIRONMENT_RENDERING]
Provides: [Volumetric Fog & Sunshaft Lighting Model Specification]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 3 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Atmospheric Volumetrics & Sunshaft Lighting Specification

## 1. Objective
Define the mathematical simulation model for ray-marched height fog, Mie scattering phase functions, and volumetric sunshaft light attenuation driven by presentation environment snapshots.

## 2. Volumetric Light Attenuation & Phase Equations
Light shaft scattering intensity $I(\theta)$ at view angle $\theta$ is computed via Henyey-Greenstein phase function:
$$ P(\theta) = \frac{1 - g^2}{4\pi (1 + g^2 - 2g \cos\theta)^{3/2}} $$
where asymmetry parameter $g = 0.75$ (Mie forward scattering).

Height-dependent fog density $\rho(z)$ at altitude $z$:
$$ \rho(z) = \rho_0 \exp\left(-\frac{z - z_0}{H_{\text{falloff}}}\right) $$
where $\rho_0$ is baseline fog density and $H_{\text{falloff}} = 25.0\text{ m}$.

## 3. SLAs & Verification Criteria
- **Random Generators**: Strictly **0 calls** to `Math.random()`.
- **Memory Allocation**: **0 bytes** during steady-state tick updates.
- **CPU Time**: $\le 0.2\text{ ms}$ within simulation budget.
