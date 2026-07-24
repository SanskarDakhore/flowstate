---
Title: "Implementation Patterns"
Module: "99_PROJECT_MEMORY"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.04"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 98_CANON]
Provides: [Project Memory & Architectural Continuity]
Blocks: []
Estimated Work: 5 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Established Implementation Patterns

## Pattern 1: Read-Only Event Bus Dispatch
```typescript
public dispatchTelemetry(state: Readonly<PlayerState>): void {
  this.eventBus.emit('telemetry:update', Object.freeze({ ...state }));
}
```

## Pattern 2: 0-Byte Object Allocation Loop
```typescript
private static readonly TEMP_VEC = new Vector3();

public updatePosition(target: Vector3): void {
  Vector3.CopyToRef(target, PhysicsEngine.TEMP_VEC);
}
```
