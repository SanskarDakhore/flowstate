---
Title: "Core Gameplay Laws"
Module: "98_CANON"
Status: Completed
Priority: Critical
Milestone: 1
Phase: "00.03"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE]
Provides: [Design Canon & Identity Constraints]
Blocks: [All Feature & System Implementations]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Immutable Core Gameplay Laws

The following **27 Gameplay Laws** are non-negotiable architectural constraints. No feature, patch, or system modification may break these laws.

1. **Easy to Learn, Infinite to Master**: Controls are immediately intuitive, but trajectory math provides an unbounded skill ceiling.
2. **Skill Always Beats Randomness**: Deterministic physics ensures player input precision always determines outcome.
3. **Momentum Conservation**: Velocity is never arbitrarily wiped; inertia must be respected across all surface transitions.
4. **Better Play Makes the World Beautiful**: Flow state ratio directly drives biome blooming, sky light shifts, and ecosystem density.
5. **Cosmetics Never Provide Gameplay Power**: All purchased or unlocked cosmetics are strictly visual and auditory.
6. **Calmness Before Spectacle**: Visual complexity ramps organically with player speed, keeping slow states serene and clean.
7. **Readability Before Visual Ornamentation**: Gameplay hazards, energy rings, and track edges must always outshine ambient decorative particles.
8. **Performance Before Visual Excess**: The engine must sustain 60 FPS on mobile target devices before adding extra shader passes.
9. **Every Feature Strengthens the Core Loop**: If a proposed mechanic does not enhance momentum, trajectory, or resonance, it is rejected.
10. **Decoupled Telemetry**: UI layers access gameplay state purely through read-only telemetry contracts.
11. **Zero Input Latency**: Input processing must execute within the first 2ms of every frame.
12. **Fair Recovery**: Minor trajectory errors can be recovered through skillful air control and jump timing.
13. **Dynamic Camera Tracking**: Camera lag and FOV expansion scale logarithmically with momentum to amplify speed without motion sickness.
14. **Tokenized UI Discipline**: All visual elements must derive colors and metrics from `tokens.css`.
15. **Transparent Scoring**: Multipliers and points are strictly derived from velocity, combo length, energy rings, and perfect track positioning.
16. **No Invisible Walls**: Boundaries are communicated naturally via magnetic energy fields, ribbon edges, or atmospheric drag.
17. **Seamless Audio Stems**: Music layers dynamically add instrumentation as momentum builds, fading smoothly during deceleration.
18. **Uninterrupted Flow**: Pause menus and UI overlays must transition smoothly without wiping game simulation state.
19. **Mobile-First Touch Ergonomics**: All touch gestures operate within natural thumb swipe radiuses.
20. **Zero Friction Restarts**: Instant restart transitions (< 500ms) to maintain player flow state after a run ends.
21. **No Artificial Difficulty Spikes**: Challenge scales continuously via track curvature and dynamic obstacles, not unfair instant kills.
22. **Environmental Storytelling**: World biomes reveal lore through architecture and eco-growth rather than intrusive text cutscenes.
23. **Deterministic Replays**: Asynchronous ghost replays reproduce exact physics trajectories across all hardware tiers.
24. **Zero Forced Ads**: Gameplay is never interrupted by un-requested full-screen advertisements.
25. **Respect for Battery & Thermals**: Engine dynamically throttles off-screen particle systems to prevent thermal degradation.
26. **Accessibility by Default**: High-contrast scrims and customizable colorblind visual modes are built into core rendering.
27. **Preservation of Game Memory**: All major decisions must be recorded in `99_PROJECT_MEMORY/DECISION_LOG.md`.

## Related Canon Documents
- [Game Identity.md](Game%20Identity.md)
- [Design Principles.md](Design%20Principles.md)
