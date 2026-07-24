---
Status: Active
Priority: Critical
Milestone: 1
Phase: 01
Dependencies: [00_PROJECT_CORE/Do_Not_Break_Rules.md]
Estimated Work: 2 hours
Difficulty: Medium
Breaking Change: No
---

# Architecture Rules Specification

## 1. Objective
Define system boundaries, component relationships, module isolation, and telemetry decoupling rules for the FLOWSTATE web/mobile engine architecture.

## 2. Design Philosophy
Luminous minimalism backed by strict decoupled subsystem isolation. Systems interact strictly via event buses, state machines, and read-only telemetry buffers.

## 3. Current Repository State
- **Completed**: Core Babylon.js canvas initialization.
- **Partially Complete**: HUD layout and DevPanel telemetry drawer separation.
- **Missing**: Centralized event bus architecture for dynamic biome state changes.
- **Technical Debt**: Direct module imports between UI and scene managers.
- **Dependencies**: Babylon.js 3D engine, TypeScript strict mode.

## 4. Desired Final Implementation
Strict tier separation:
1. `Core Engine & Physics` (Pure Math, Physics Solvers, Ribbon Splines)
2. `Simulation & Ecosystem` (Living World State, Weather, Resonance Growth)
3. `Rendering & Shaders` (GPU Instancing, Post-Processing, Volumetrics)
4. `Presentation & UI` (Player HUD, Glassmorphic Scrims, Touch Router)

## 5. Technical Architecture & Mathematical Models
- **Equations**: Decoupled Frame Update Pipeline:  
  $$T_{\text{frame}} = T_{\text{physics}}(16.6\text{ms}) + T_{\text{sim}} + T_{\text{render}} + T_{\text{ui}} \le 16.67\text{ms}$$
- **State Diagrams**:
  ```mermaid
  graph TD
      Physics[02_PHYSICS Engine] -->|Read-Only Telemetry| Sim[04_LIVING_WORLD Simulation]
      Sim -->|Environment State| Render[05_ENVIRONMENT Rendering]
      Physics -->|Speed / Flow Ratio| HUD[13_UI_UX PlayerHUD]
      DevPanel[13_UI_UX DevPanel] -.->|Read Debug Vectors| Physics
  ```

## 6. Files to Inspect & Modify
- `frontend/src/ui/screens/`
- `frontend/src/core/`

## 7. Files to Never Modify
- Core physics mathematical constants and movement solvers without explicit proposal.

## 8. Acceptance Criteria & Quality Gates
- [ ] Complete architectural separation between HUD and DevPanel components.
- [ ] Zero circular dependencies across TypeScript modules (`npm run check`).

## 9. Performance & Memory Budgets
- Memory: < 150 MB VRAM target on mobile devices.
- FPS: Stable 60 FPS under active particle and vegetation rendering.

## 10. Mobile & Cross-Platform Constraints
- Universal touch input router handling tap, hold, and swipe events without interfering with canvas gesture listeners.

## 11. Edge Cases & Safety Handlers
- Graceful degradation when webgl2 context is lost and restored.

## 12. Testing Checklist (Automated & Manual)
- [ ] Verify clean compilation under TypeScript strict mode (`tsc --noEmit`).

## 13. Future Extensibility
- Plugin architecture for community biomes and track ribbon generators.

## 14. Executable AI Agent Prompt
```text
Goal: Refactor existing UI components to ensure zero circular dependencies and full HUD/DevPanel isolation.
Context: Inspect Architecture_Rules.md and DECISION_LOG.md.
Repository State: Prototype canvas setup with HUD components.
Read First: FLOWSTATE_MASTER_GUIDE/99_PROJECT_MEMORY/DECISION_LOG.md
Files to Inspect: frontend/src/ui/**/*.ts
Files Never Modify: frontend/src/core/physics/
Implementation Plan: Audit imports, verify ReadOnly telemetry interfaces, remove raw hex values.
Constraints: 60 FPS mobile target.
Acceptance Tests: Zero TS errors, zero circular dependency warnings.
Completion Checklist: Verified all 10 AI Quality Gates.
```
