---
Title: "Celestial Sky & Atmospheric Cloud Formations Model"
Module: "06_LIVING_WORLD"
Status: Active Authority
Priority: High
Milestone: 4
Phase: "04.02"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 04_LIVING_WORLD_SIMULATION, 06_LIVING_WORLD]
Provides: [Celestial Sky Arc & Atmospheric Cloud Model]
Blocks: [05_ENVIRONMENT_RENDERING]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Celestial Sky & Atmospheric Cloud Formations Model

## 1. Executive Summary & Research Synthesis
Inspired by Decima Engine (Horizon Forbidden West) and Unreal Engine SkyAtmosphere, FLOWSTATE's celestial sky model computes Rayleigh atmospheric scattering and Henyey-Greenstein Mie phase functions dynamically driven by solar elevation.

```
                           CELESTIAL SKY ARC PIPELINE
Day Cycle Progress (0.0 to 1.0) -> Solar Arc Elevation Math -> Rayleigh Atmospheric Gradient
                                                                     ↓
                                                       Mie Scattering Phase Function
                                                                     ↓
                                                       Cloud Formation Density & Tint
                                                                     ↓
                                                       World Director Synchronization
```

## 2. Atmospheric Scattering Equations
Sky zenith color $\mathbf{C}_{\text{zenith}}(h)$ and horizon color $\mathbf{C}_{\text{horizon}}(h)$ transition as a function of solar elevation angle $h \in [-10^\circ, 65^\circ]$:
$$ \mathbf{C}_{\text{horizon}}(h) = \operatorname{lerp}\left(\mathbf{C}_{\text{dusk}}, \mathbf{C}_{\text{day}}, \operatorname{clamp}\left(\frac{h + 5^\circ}{35^\circ}, 0, 1\right)\right) $$
Mie forward-scattering phase function $P(\theta, g)$:
$$ P(\theta, g) = \frac{1 - g^2}{4\pi (1 + g^2 - 2g \cos\theta)^{3/2}} $$
where $g = 0.75$ is Mie anisotropy factor.

## 3. Ecological Cloud Coupling
Cloud density and mist opacity couple to world moisture and solar warmth:
- High Valley Harmony + Morning Sun $\rightarrow$ Soft cirrus clouds with golden rim lighting.
- Low Harmony + Low Energy $\rightarrow$ Dense overcast stratus clouds with muted indigo sky.

## 4. Mobile SLAs & Determinism
- **Allocations**: **0 bytes** heap allocation per frame tick.
- **CPU Time**: $\le 0.1\text{ ms}$ evaluation budget.
- **Replay**: 100% deterministic visual reproduction when seeded with day progress and world snapshot.
