---
Status: Active
Priority: Critical
Milestone: 1
Phase: 01
Dependencies: []
Estimated Work: 1 hour
Difficulty: Low
Breaking Change: No
---

# Do Not Break Rules Specification

## 1. Objective
Establish non-negotiable architectural boundaries and code protection rules for FLOWSTATE. Protect core physics, collision math, and UI design token discipline against inadvertent mutation during routine maintenance and AI agent tasks.

## 2. Design Philosophy
Continuous visual iteration and UI polish must never degrade core gameplay mechanics or break design token consistency. Decouple presentation layers cleanly from simulation logic.

## 3. Current Repository State
- **Completed**: `.agents/AGENTS.md` rules defined; CSS design tokens created in `frontend/src/ui/styles/tokens.css`.
- **Partially Complete**: Telemetry isolation between `PlayerHud` and `DevPanel`.
- **Missing**: Automated CI linter enforcing Do-Not-Break rules on pull requests.
- **Technical Debt**: Legacy inline color styles in early UI prototype components.
- **Dependencies**: `frontend/src/ui/styles/tokens.css`, `frontend/src/core/physics/`

## 4. Desired Final Implementation
A strictly enforced code boundary where visual and UI passes interact with gameplay systems purely via read-only contracts and event listeners, zero hardcoded visual styles, and complete isolation of technical dev metrics.

## 5. Technical Architecture & Mathematical Models
- **Equations**: Read-Only Telemetry Interface Contract:  
  $$\text{TelemetryData} = f(\vec{p}_{ball}, \vec{v}_{ball}, \omega_{ball}, E_{resonance}) \quad \text{where} \quad \frac{\partial \text{PhysicsState}}{\partial \text{UIComponent}} = 0$$
- **Coordinate Systems**: Right-handed 3D Cartesian coordinates ($X, Y, Z$) for Babylon.js world space.
- **State & Timing Diagrams**:
  ```mermaid
  stateDiagram-v2
      [*] --> GameplayPhysicsLoop
      GameplayPhysicsLoop --> TelemetryEventBus: Emit Frame State (Read-Only)
      TelemetryEventBus --> PlayerHUD: Update Visual Scrim & Energy
      TelemetryEventBus --> DevPanel: Update FPS & Position Vectors
      PlayerHUD --> [*]: Render (Zero Physics Mutation)
  ```
- **Pseudocode**:
  ```typescript
  interface ReadOnlyTelemetry {
    readonly position: Readonly<Vector3>;
    readonly velocity: Readonly<Vector3>;
    readonly currentSpeed: number;
    readonly flowStateRatio: number;
  }
  ```
- **Complexity**: $O(1)$ time complexity per frame telemetry dispatch; zero object allocation ($O(0)$ memory churn).

## 6. Files to Inspect & Modify
- `frontend/src/ui/styles/tokens.css`
- `.agents/AGENTS.md`

## 7. Files to Never Modify (Do-Not-Break Protection)
- `frontend/src/core/physics/movement-engine.ts`
- `frontend/src/core/physics/collision-solver.ts`
- `shared/math/spline-calculator.ts`

## 8. Acceptance Criteria & Quality Gates
- [ ] No hardcoded hex color codes anywhere in `frontend/src/ui/components/*.ts`.
- [ ] No direct state mutations of `PhysicsEngine` from any UI screen controller.
- [ ] All text UI elements over 3D scenes use `var(--flow-text-scrim)`.

## 9. Performance & Memory Budgets
- Frame Budget: 16.6ms (60 FPS target on mobile).
- Telemetry Allocation Budget: 0 bytes per frame (reused state buffer).

## 10. Mobile & Cross-Platform Constraints
- Touch event handlers must never block main thread looper during high-velocity rendering.
- UI elements must respect safe-area inset boundaries on mobile displays.

## 11. Edge Cases & Safety Handlers
- If telemetry updates stall, UI retains last valid state without crashing the 3D physics loop.

## 12. Testing Checklist (Automated & Manual)
- [ ] Run `npm run check` to verify zero TypeScript errors.
- [ ] Verify zero console warnings regarding unhandled state mutations.

## 13. Future Extensibility
- Extensible event schema for async multiplayer ghost playback.

## 14. Executable AI Agent Prompt
```text
Goal: Verify and enforce Do Not Break Rules across all UI and physics files in frontend/.
Context: Inspect tokens.css and .agents/AGENTS.md.
Repository State: Active prototype with tokens.css defined.
Read First: FLOWSTATE_MASTER_GUIDE/99_PROJECT_MEMORY/DECISION_LOG.md
Files to Inspect: frontend/src/ui/**/*.ts, frontend/src/core/**/*.ts
Files Never Modify: frontend/src/core/physics/movement-engine.ts, shared/math/spline-calculator.ts
Implementation Plan: Audit all UI files for un-tokenized CSS or direct physics state mutations; replace with tokens.css variables and read-only telemetry listeners.
Constraints: Maintain 60 FPS performance budget and 0-byte frame allocation.
Acceptance Tests: Pass npm run check and zero linter warnings.
Completion Checklist: All 10 AI Quality Gates verified.
```
