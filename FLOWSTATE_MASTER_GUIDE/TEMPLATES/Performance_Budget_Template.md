---
Title: "[System / Spec Name]"
Module: "[Module ID, e.g. 01_GAMEPLAY]"
Status: Planned
Priority: High
Milestone: 1
Phase: "01"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: []
Provides: []
Blocks: []
Estimated Work: 2-4 hours
Difficulty: Medium
Breaking Change: No
Last Updated: 2026-07-23
---

# Reusable Performance Budget Specification

## Core Performance Metrics
- **Target FPS**: 60 FPS (16.67ms frame budget)
- **RAM Memory Budget**: < 150 MB total process memory
- **VRAM Budget**: < 100 MB GPU VRAM
- **Draw Call Budget**: < 40 draw calls / frame
- **Shader Count**: < 12 active compiled shaders
- **Max Texture Resolution**: 2048x2048 (compressed KTX2 / WebP)
- **Audio Memory Budget**: < 15 MB stem buffers
- **Mesh Triangle Count Budget**: < 50,000 active triangles

## Device & Platform Limits
- **Supported Device Tiers**: Low-End Mobile (Tier 1), Mid Mobile (Tier 2), Desktop (Tier 3)
- **Thermal Throttling Threshold**: Frame degradation protection at > 42°C
- **Battery Expectations**: < 12% battery draw / 30-minute play session
