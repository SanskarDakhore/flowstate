# Gameplay Mechanics

## Movement System Experiments (Core Movement Lab v0.1)

The movement system evaluates three framework-independent 3D movement models on touch and desktop controls to determine the optimal balance of flow, accessibility, comfort, and mastery.

| Movement Model | ID | Status | Steering Concept |
|----------------|----|--------|------------------|
| **Guided Flow** | `guided-flow` | **EXPERIMENTAL** | Continuous forward progression along a 3D spline corridor (`FlowPath`) with local normal/binormal steering offsets. |
| **Free Flow** | `free-flow` | **EXPERIMENTAL** | Continuous forward speed with responsive yaw/pitch direction vector steering bounded by soft volumetric boundaries. |
| **Branching Flow** | `branching-flow` | **EXPERIMENTAL** | Guided flow progression with real-time multi-lane route branching choices (Left, Center, Right). |

> [!NOTE]
> All movement models are currently **EXPERIMENTAL**. Final movement selection will be decided following comparative playtesting.

## Input & Intent Pipeline

- Continuous touch drag, pointer drag, and WASD/Arrow keyboard fallback generate normalized continuous `MovementIntent` (`horizontal: -1.0 .. 1.0`, `vertical: -1.0 .. 1.0`).
- Exponential intent smoothing prevents twitchy mobile controls while maintaining immediate responsiveness.

## Core Systems
- **Energy** — Collectible resource feeding into scoring
- **Combo** — Consecutive interaction chain multiplier
- **Flow State** — Sustained combo reward state
- **Harmony** — Cumulative performance metric driving visual world transformation (progressively evaluated in prototype as temporary presentation behavior)
