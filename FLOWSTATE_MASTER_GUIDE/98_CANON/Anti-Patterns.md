---
Title: "Anti-Patterns"
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

# FLOWSTATE Anti-Patterns (Prohibited Design Practices)

The following **42 Anti-Patterns** represent explicit design failures. Any proposal incorporating these patterns must be immediately rejected.

1. **Pay-to-Win Mechanics**: Selling stats, speed boosts, or collision forgiveness for real money.
2. **UI Clutter**: Displaying invasive telemetry metrics, banners, or popups over active gameplay scenes.
3. **Meaningless Currencies**: Introducing 5+ confusing soft/hard currency systems to obscure real costs.
4. **Grinding Loops**: Forcing repetitive low-skill gameplay to unlock core progression tiers.
5. **Random Difficulty Spikes**: Introducing unavoidable, un-telegraphed instant-kill obstacles.
6. **Visual Overload**: Saturating the screen with particle noise that obscures track boundaries.
7. **Loud Monetization**: Flashing store popups, countdown sales, or aggressive buy prompts upon game launch.
8. **Artificial Retention (Energy Systems)**: Restricting daily playtime via stamina/energy timers.
9. **Feature Bloat**: Adding shoehorned minigames that distract from core kinetic momentum.
10. **Dark Patterns**: Tricking users with misleading UI close buttons or accidental purchase traps.
11. **Overly Complex Tutorials**: Forcing 10-minute un-skippable text tutorials before letting players feel movement.
12. **Competitive Toxicity**: Enabling un-moderated toxic communications in social or leaderboard modes.
13. **Hardcoded CSS Colors**: Writing raw hex strings in TypeScript files instead of using `tokens.css`.
14. **Direct Physics State Mutation**: Modifying sphere velocity directly from UI controllers.
15. **Un-Scrimmed Text**: Placing white body text over WebGL 3D scenes without dark background scrims.
16. **Frame Allocation Churn**: Instantiating temporary objects inside the 60 FPS rendering loop.
17. **Abrupt Music Cuts**: Instantly stopping background music stems on crash without audio fade transitions.
18. **Invisible Wall Collision**: Stopping player momentum with abrupt invisible boundaries.
19. **Un-Calibrated Thermal Draw**: Running un-throttled background particle calculations while app is minimized.
20. **Forced Un-Skippable Video Ads**: Interrupting gameplay with third-party video advertisements.
21. **Vague Error Messages**: Presenting cryptic crash codes without human-readable telemetry logs.
22. **Un-Banked Spline Curves**: Designing sharp ribbon track turns without physics-based Banking angles.
23. **Screen-Space Camera Shaking**: Applying violent camera shake that induces motion sickness.
24. **Stale Asset Bundles**: Loading uncompressed 4K textures on low-end mobile devices.
25. **Circular Dependency Loops**: Importing UI controllers into core physics math modules.
26. **Un-Locked Frame Deltas**: Calculating physics kinetics without fixed delta time clamping.
27. **Silent Exception Swallowing**: Wrapping broken API calls in empty `catch {}` blocks.
28. **Inconsistent Motion Scale**: Mixing realistic gravity metrics with arcade jump multipliers inconsistently.
29. **Obscured Hazard Boundaries**: Making hazardous track gaps blend indistinguishably into ambient terrain.
30. **Un-Responsive Touch Regions**: Creating touch buttons smaller than 44x44px target bounds.
31. **Asynchronous Ghost Desync**: Playing back ghost replays without deterministic tick verification.
32. **Un-Categorized Asset Directories**: Dumping loose texture files into root asset directories.
33. **Monolithic Controller Classes**: Writing 3,000+ line TS classes handling physics, UI, and audio simultaneously.
34. **Hardcoded Screen Aspect Ratio**: Designing HUD layouts assuming fixed 16:9 displays.
35. **Non-Standardized Event Names**: Using inconsistent string literals for event bus topics.
36. **Un-Bound Event Listeners**: Failing to remove window event listeners upon component unmount.
37. **Loud Audio Clipping**: Playing un-normalized sound effects that exceed 0 dBFS limit.
38. **Un-Documented Magic Numbers**: Using raw numerical constants without named constant definitions.
39. **Invasive Telemetry Tracking**: Collecting personally identifiable user data without consent.
40. **Bypassing Quality Gates**: Marking phases complete without verifying test build passing.
41. **Un-Tracked Architectural Drift**: Making major structural changes without updating `DECISION_LOG.md`.
42. **Superficial Bug Fixes**: Masking root-cause physics bugs with band-aid fallback values.

## Related Canon Documents
- [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md)
- [Design Principles.md](Design%20Principles.md)
