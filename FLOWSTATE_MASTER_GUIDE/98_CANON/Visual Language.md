---
Title: "Visual Language"
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

# Visual Language Specification

## Lighting & Color Philosophy
- **Base Scrims**: Dark, rich background tones (`var(--flow-text-scrim)`) to ensure 3D canvas legibility.
- **Resonance Accents**: Cyan (`#00f0ff`), luminous teal, vibrant magenta, and radiant gold for high-energy states.
- **Environmental Contrast**: Muted, serene biomes that erupt into saturated, glowing colors as flow ratio increases.

## Material & Surface Rules
- **Sphere PBR**: Fresnel glow, subtle metallic reflections, dynamic aura textures.
- **Ribbon Track**: Glassmorphic, glowing edge guides, friction-coded surface textures.
- **Vegetation**: Instanced GPU foliage with wind vertex shaders and state-driven bloom interpolation.

## Readability Hierarchy
1. **Primary Focus**: Player sphere position and track hazard boundaries.
2. **Secondary Focus**: Energy ring targets and banking curvature indicators.
3. **Tertiary Focus**: Ambient environmental vegetation, cloud layers, and background biomes.
4. **Background UI**: Glassmorphic scrim HUD overlays.

## Camera Language
- Dynamic FOV expansion (60° to 95°) linearly mapped to velocity.
- Smooth positional lag ($k_{\text{damp}} = 0.15$) to convey kinetic weight without causing motion sickness.

## Related Canon Documents
- [Audio Identity.md](Audio%20Identity.md)
- [Design Vocabulary.md](Design%20Vocabulary.md)
