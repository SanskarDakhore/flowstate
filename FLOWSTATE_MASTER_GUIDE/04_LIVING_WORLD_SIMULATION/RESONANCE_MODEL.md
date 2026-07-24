---
Title: "Resonance Model & Simulation Interpreter"
Module: "04_LIVING_WORLD_SIMULATION"
Status: Active
Priority: Critical
Milestone: 1
Phase: "01.02"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 98_CANON, 99_PROJECT_MEMORY]
Provides: [Resonance Interpreter & Energy Buffer Mathematical Specification]
Blocks: [05_ENVIRONMENT_RENDERING, 12_AUDIO_ENGINE]
Estimated Work: 3 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Resonance Model & Simulation Interpreter Specification

## 1. Objective
Define the mathematical transformation from raw `GameplaySignalSnapshot` facts into environmental `WorldInputSnapshot` parameters, and specify the energy accumulation, exponential decay, recovery, and hysteresis thresholds of `WorldStateEngine`.

## 2. Design Philosophy
Gameplay facts (`flowRatio`, `trajectoryAccuracy`) must be translated into simulation concepts (`growthPotential`, `environmentEnergy`, `harmony`) before driving world states. The world simulation operates on a continuous energy buffer, completely decoupled from gameplay logic.

## 3. Current Repository State
- **Completed**: Phase 01.01 Gameplay Signal Architecture (`GameplaySignalSnapshot`).
- **Partial**: World State Machine 6-enum specification in `WORLD_STATE_MODEL.md`.
- **Missing**: `ResonanceInterpreter` translation logic and `WorldStateEngine` energy buffer.
- **Dependencies**: `shared/src/signals/world-input.ts`, `shared/src/signals/world-state.ts`

## 4. Desired Final Implementation
A deterministic 2-stage simulation domain:
1. `ResonanceInterpreter`: Translates `GameplaySignalSnapshot` $\rightarrow$ `WorldInputSnapshot`.
2. `WorldStateEngine`: Consumes `WorldInputSnapshot` $\rightarrow$ manages energy buffer $E(t)$ with decay $\lambda$ $\rightarrow$ emits `WorldStateSnapshot`.

## 5. Technical Architecture & Mathematical Models

### Stage 1: Interpretation Equations
$$ \text{growthPotential} = \min\left(1.0, \text{flowRatio} \times \text{speedRetention} \times 1.2\right) $$
$$ \text{environmentEnergy} = \min\left(100.0, \text{kineticEnergy} \times 0.1 \times \text{resonance}\right) $$
$$ \text{harmony} = \text{stability} \times \text{trajectoryAccuracy} $$

### Stage 2: Energy Accumulation & Exponential Decay Model
The continuous environmental energy buffer $E(t)$ evolves per tick $\Delta t$:
$$ E_{t+\Delta t} = \left(E_t + \text{environmentEnergy} \times \text{harmony} \times \Delta t\right) \times e^{-\lambda \Delta t} $$
where decay rate $\lambda = 0.15 \text{ s}^{-1}$.

### Hysteresis State Thresholds
To eliminate state flicker, state upgrades trigger at $E_{\text{high}}$ while downgrades require falling below $E_{\text{low}}$ ($E_{\text{low}} = E_{\text{high}} - 5.0$):
- **IDLE**: $E < 15.0$
- **AWAKENING**: $15.0 \le E < 35.0$
- **GROWING**: $35.0 \le E < 55.0$
- **BLOOMING**: $55.0 \le E < 75.0$
- **THRIVING**: $75.0 \le E < 90.0$
- **TRANSCENDENT**: $E \ge 90.0$

## 6. Files to Inspect & Modify
- `shared/src/signals/world-input.ts`
- `shared/src/signals/world-state.ts`
- `frontend/src/game/simulation/resonance-interpreter.ts`
- `frontend/src/game/simulation/world-state-engine.ts`

## 7. Files Never Modify
- `frontend/src/core/physics/movement-engine.ts`

## 8. Acceptance Criteria & Quality Gates
- [ ] Simulation domain consumes `WorldInputSnapshot` only. Zero read access to movement physics.
- [ ] State transitions pass hysteresis threshold check to prevent rapid flicker.
- [ ] 0-byte memory allocation per frame during simulation tick.

## 9. Performance Budgets
- Frame Budget: < 0.1ms per frame tick.
- Memory: 0 bytes per frame allocation.
