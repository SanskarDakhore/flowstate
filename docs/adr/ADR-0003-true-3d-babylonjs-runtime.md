# ADR-0003: Selection of True 3D Presentation & Babylon.js Frontend Engine Runtime

* **Title:** True 3D World Direction & Babylon.js Concrete Engine Integration
* **Status:** CONFIRMED
* **Date:** 2026-07-13
* **Supersedes:** Any provisional 2D/2.5D or engine-agnostic rendering placeholders

## Context

FLOWSTATE's core philosophy ("The better you play, the more alive and beautiful the world becomes") requires rich three-dimensional environmental feedback: spatial color shifts, dynamic lighting, material emissive evolution, geometry reactions, camera motion, and visual particle feedback.

During stack migration evaluation, 2D/2.5D visual engines (such as Phaser or PixiJS) were determined to be restrictive for true-3D environmental transformation. Lower-level graphics engines like plain Three.js were evaluated, but Babylon.js was selected for its comprehensive, battle-tested 3D engine architecture, built-in mobile WebGL optimizations, robust scene graph, and modular `@babylonjs/core` ESM ecosystem.

## Decision

1. **Game Presentation:** True 3D (CONFIRMED)
2. **Frontend 3D Runtime:** Babylon.js (`@babylonjs/core`) (CONFIRMED)
3. **Engine Integration Architecture:** Generic `RenderingEngine` lifecycle contract (`initialize`, `start`, `stop`, `resize`, `dispose`), separated presentation adapters (`PlayerView`, `WorldPresentation`), and modular 3D scene elements (`GameplayScene`, `GameplayCamera`, `GameplayLighting`, `EnvironmentView`).
4. **Camera Strategy:** Target follow camera (`TargetCamera`) for stable mobile tracking.
5. **Mobile Packaging:** Candidate: Capacitor (PROVISIONAL / TBD).

## Rationale

* **Decoupled Architecture:** `RenderingEngine` stays framework-generic. Presentation adapters (`PlayerView.setPosition`, `WorldPresentation.setHarmonyLevel`) update 3D presentation without attaching game logic directly to Babylon meshes.
* **Mobile-First 3D Engine:** `@babylonjs/core` provides native WebGL support with progressive WebGPU capability detection.
* **Vite Dev Infrastructure:** Integrates Vite for rapid browser-based dev server execution (`npm run dev`).

## Consequences

* Deprecates 2D engine considerations (Phaser/PixiJS).
* `scripts/validation/check_structure.js` enforces modular 3D rendering architecture paths.
* Mobile performance budget must profile draw calls, overdraw, and material shaders on mobile WebGL viewports.
