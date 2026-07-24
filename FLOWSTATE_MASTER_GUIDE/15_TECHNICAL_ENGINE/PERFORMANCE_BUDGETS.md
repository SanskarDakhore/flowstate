---
Title: "Performance Budgets & Engine SLAs"
Module: "15_TECHNICAL_ENGINE"
Status: Active
Priority: Critical
Milestone: "1.5"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 05_ENVIRONMENT_RENDERING]
Provides: [Performance Budgets & Quality Tier SLAs]
Blocks: []
Estimated Work: 2 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Performance Budgets & Engine SLAs Specification

## 1. Objective
Establish mandatory CPU frame budgets, memory allocation limits, and Quality Tier constraints across the 4-tier pipeline architecture to prevent performance regression.

## 2. Design Philosophy
Continuous high frame rates (60 FPS / 16.67ms per frame) are essential to preserving flow state immersion. Every pipeline stage operates under a strict Service-Level Agreement (SLA).

## 3. CPU Frame Timing Budgets

| Pipeline Tier | SLA Budget | Description |
| :--- | :--- | :--- |
| **Gameplay** | $\le 0.5\text{ ms}$ | Touch/Key input routing, movement physics tick, signal collectors |
| **Simulation** | $\le 0.5\text{ ms}$ | Resonance interpreter, energy buffer accumulation & exponential decay |
| **Presentation** | $\le 0.5\text{ ms}$ | Presentation resolver, declarative parameter interpolations |
| **Rendering** | $\le 2.5\text{ ms}$ | Modular subsystem change detection, WebGL draw call dispatches |
| **Total CPU** | $\le 5.0\text{ ms}$ | Cumulative CPU time per frame (leaving 11.67ms for GPU rasterization) |

## 4. Steady-State Memory Allocation Invariant
- **Frame Allocations**: **0 Bytes** during steady-state gameplay ticks.
- Object allocations (garbage collection triggers) are strictly forbidden within `update()` loops.

## 5. Quality Tiers & GPU Resource Budgets

| Quality Tier | Max Draw Calls | Active Grass Instances | Max Particle Count | Target Device |
| :--- | :---: | :---: | :---: | :--- |
| **High** | $\le 40$ | 10,000 | 100 | Modern Desktop / High-end Mobile |
| **Medium** | $\le 25$ | 5,000 | 50 | Mid-range Mobile / Laptops |
| **Low** | $\le 15$ | 2,000 | 20 | Entry Mobile Devices |

## 6. Verification Protocol
1. Run `npm test` to execute `pipeline-telemetry.test.ts`.
2. Inspect `PipelineDebugPanel` HUD overlay during gameplay to verify `✓ Within Budget` status badges.
