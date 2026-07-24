---
Title: "Experimental Features"
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

# Experimental Features Register

### EXP-001: Atmospheric Wind Resistance Vectors
- **Goal**: Add atmospheric wind resistance affecting sphere rotation during high-altitude jumps.
- **Hypothesis**: Dynamic wind drag will heighten air control skill requirement without disrupting momentum.
- **Success Criteria**: Players feel tactile air resistance; trajectory remains deterministic.
- **Failure Criteria**: Jump trajectories feel unpredictable or frustrating.
- **Exit Conditions**: Reject if jump accuracy drops below 80% on standard challenge segments.
- **Decision Date**: Scheduled for Milestone 2 evaluation.

---

### EXP-002: Magnetic Energy Ring Trajectory Assist
- **Goal**: Energy rings pull sphere slightly toward center line upon close passage.
- **Hypothesis**: Magnetic ring assist will reward near-miss trajectories and smooth spline drift.
- **Success Criteria**: Subtle pull effect ($< 1.5 \text{ m/s}^2$) feels satisfying and fluid.
- **Failure Criteria**: Magnetism feels like artificial auto-steering.
- **Exit Conditions**: Reject if magnetism overrides manual player steering intent.
- **Decision Date**: Scheduled for Milestone 2 evaluation.
