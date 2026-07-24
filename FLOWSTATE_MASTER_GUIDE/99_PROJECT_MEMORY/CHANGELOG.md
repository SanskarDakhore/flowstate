---
Title: "Master Changelog"
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

# GDOS & Repository Master Changelog

## [5.0.0] - 2026-07-24
- **Milestone 2 — Phase 25 Biome Evolution Engine (Valley to Forest)**: Implemented distance-based biome blend weight calculator ($s$) transitioning across 4 biomes (`DESERT_CANYON`, `VERDANT_VALLEY`, `ANCIENT_FOREST`, `CRYSTAL_PEAKS`) with 100m transition blend window, splat map weight normalization ($R+G+B+A=1.0$), and target flora density caps in `BiomeEvolutionEngine`. Added shared contracts in `shared/src/simulation/biome-evolution-types.ts` and unit tests in `frontend/tests/unit/biome-evolution.test.ts`.
- **Milestone 2 — Phase 24 GPU Instanced Grass & Foliage Renderer**: Implemented pre-allocated `Float32Array` matrix instancing buffer ($N_{\text{max}} = 1,000$), procedural wind sway displacement solver, and sphere touch interaction bending solver ($d < 2.5\text{m}$) in `InstancedFoliageRenderer`. Added shared contracts in `shared/src/rendering/foliage-types.ts` and unit tests in `frontend/tests/unit/instanced-foliage.test.ts`.
- **Milestone 2 — Phase 23 24-Hour Day/Night Lighting Cycle**: Implemented 24-hour day/night lighting cycle engine with continuous 3D sun position orbital trajectory ($\mathbf{S}_{\text{sun}}$), 4 lighting phase presets (`DAWN`, `NOON`, `DUSK`, `MIDNIGHT`), and nocturnal emissive flora glow boost ($1.5\times$) in `DayNightCycleEngine`. Added shared contracts in `shared/src/simulation/day-night-types.ts` and unit tests in `frontend/tests/unit/day-night-cycle.test.ts`.
- **Milestone 2 — Phase 22 Dynamic Weather State Machine**: Implemented dynamic weather state machine (`CLEAR_SUNNY`, `MISTY_RAIN`, `ELECTRICAL_STORM`, `SOLAR_AURORA`) with 5.0-second parameter cross-fading, environmental variable modulation, surface traction reduction ($1.0\times \to 0.75\times$), and storm energy charge rates in `DynamicWeatherStateMachine`. Added shared contracts in `shared/src/simulation/weather-types.ts` and unit tests in `frontend/tests/unit/dynamic-weather.test.ts`.
- **Milestone 2 — Phase 21 Ecosystem Growth State Machine**: Implemented logic-driven flora lifecycle state machine (`SEED` $\to$ `SPROUT` $\to$ `FLORA_BLOOM` $\to$ `OVERGROWN_CANOPY`) driven by environmental variables (`moisture`, `sunlight`, `kineticEnergy`, `temperature`), global flora density scaling, and momentum boost calculation ($1.0\times \to 1.25\times$) in `EcosystemGrowthStateMachine`. Added shared contracts in `shared/src/simulation/ecosystem-types.ts` and unit tests in `frontend/tests/unit/ecosystem-growth.test.ts`.
- **Milestone 1 — Phase 20 Engine Loop Benchmark & Allocation Audit**: Implemented automated frame-time percentile profiler (mean, P95, P99, max spike) and 0-byte steady-state allocation audit harness in `EngineLoopBenchmark` and `engine-loop-benchmark.test.ts`.
- **Milestone 1 — Phase 19 Canvas Viewport Management & Auto-Resizing**: Implemented responsive DPR scaling ($1.0\times - 2.0\times$), aspect ratio calculation, and dynamic resolution downscaling during GPU thermal lag spikes in `ViewportManager` and `viewport-manager.test.ts`.
- **Milestone 1 — Phase 18 Determinism Verification & Physics Replay Rig**: Implemented frame input recorder, trajectory position checksum hashing ($Hash_t$), and deterministic replay divergence validator in `PhysicsReplayRig` and `physics-replay-rig.test.ts`.
- **Milestone 1 — Phase 17 Track Spline Smoothing & Interpolation**: Implemented $C^2$ continuous Laplacian tension smoothing filter and curvature spike clamping ($\kappa_{\text{max}} = 0.05\text{ rad/m}$) in `TrackSplineSmoother` and `spline-smoother.test.ts`.
- **Milestone 1 — Phase 16 Dynamic Velocity FOV Damping**: Implemented critically damped spring-damper FOV smoothing ($70^\circ \to 95^\circ$) in `VelocityFOVDamper` and `velocity-fov-damper.test.ts`.
- **Milestone 1 — Phase 15 Frame Timing & Render Loop Orchestrator**: Implemented fixed 60Hz physics accumulator ($\Delta t = 16.667\text{ms}$), render alpha interpolation, and lag spike clamping in `FrameLoopOrchestrator` and `frame-loop-orchestrator.test.ts`.
- **Milestone 1 — Phase 14 Track Chunk Loading & Memory Management**: Implemented priority queue chunk loader and 64MB memory budget eviction manager in `TrackChunkLoader` and `track-chunk-loader.test.ts`.
- **Milestone 1 — Phase 13 Particle Systems & Kinetic Splashes**: Implemented zero-allocation `Float32Array` particle pool ($N_{\text{max}} = 1,000$), directional ground-roll trailing spark emitter, high-impact wall collision radial splash solver ($N = \text{clamp}(v \times 4, 10, 100)$), and energy ring passage eruption burst in `KineticSplashEngine`. Added shared contracts in `shared/src/rendering/vfx-types.ts` and unit tests in `frontend/tests/unit/kinetic-splash.test.ts`.
- **Milestone 1 — Phase 12 Telemetry Drawer & HUD Scrim System**: Implemented collapsible Developer Telemetry Drawer (`TelemetryDrawer`) for `DevPanel` metrics (FPS, 3D vectors, track curvature $\kappa$, collision impulses, memory usage) and dark text scrim backdrop (`HudScrimContainer`) using CSS tokens (`var(--flow-text-scrim)`) with strict separation from `PlayerHud`. Added shared contracts in `shared/src/ui/telemetry-types.ts` and unit tests in `frontend/tests/unit/telemetry-drawer.test.ts`.
- **Milestone 1 — Phase 11 Touch & Pointer Input Router**: Implemented multi-touch pointer tracking and screen zone partitioning (`LEFT_JOYSTICK` steering, `RIGHT_ACTION` jump/boost), radial deadzone noise filter ($r_{\text{deadzone}} = 0.15$), gesture recognition engine (tap, double-tap, hold, swipe), and unified keyboard/touch input multiplexing in `TouchPointerRouter`. Added shared contracts in `shared/src/input/input-router-types.ts` and unit tests in `frontend/tests/unit/touch-pointer-router.test.ts`.
- **Milestone 1 — Phase 10 Shader Foundation & Base Splat Pipeline**: Implemented multi-texture RGBA splat map blending, exponentiated triplanar UV projection ($\mathbf{W} = \frac{|\mathbf{N}|^p}{\sum |\mathbf{N}|^p}$), dynamic kinetic glow harmonic pulse, and atmospheric mist extinction in `splatVertexShader`, `splatFragmentShader`, and `SplatShaderMaterial`. Added shared std140 uniform contracts in `shared/src/rendering/shader-types.ts` and unit tests in `frontend/tests/unit/splat-shader.test.ts`.
- **Milestone 1 — Phase 09 Object Pooling Engine for Track Segments**: Implemented $O(1)$ fixed ring buffer pool mechanics ($N = 16$), Catmull-Rom $C^1$ spline continuity across chunk boundaries, look-ahead chunk streaming ($150\text{m}$ radius), trailing chunk recycling ($50\text{m}$ radius), and LOD distance resolution with $5.0\text{m}$ hysteresis in `TrackSegmentPool` and `TrackChunkStreamingManager`. Added shared contracts in `shared/src/performance/pool-types.ts` and unit tests in `frontend/tests/unit/track-segment-pool.test.ts`.
- **Milestone 1 — Phase 08 Energy Ring Magnetism & Momentum Boosters**: Implemented inverse-square magnetic attraction field solver ($\mathbf{F}_{\text{mag}} = \frac{k_{\text{mag}}}{d^2 + \epsilon} \cdot \hat{\mathbf{d}}$), ring aperture passage speed boost vector calculation ($1.25\times$ momentum amplification + resonance gain), and directional ground booster pad velocity acceleration in `EnergyBoosterEngine`. Added shared contracts in `shared/src/gameplay/booster-types.ts` and unit tests in `frontend/tests/unit/energy-booster.test.ts`.
- **Milestone 1 — Phase 07 Collision Solver & Track Boundaries**: Implemented 3D sphere vs boundary wall impulse response solver ($J_n, J_t$), world settings terrain track clearance resolver (`enforceTrackWorldClearance`), out-of-bounds boundary detector with safe checkpoint recovery, and swept ring trigger volume intersection solver in `CollisionSolverEngine`. Added shared contracts in `shared/src/physics/collision-types.ts` and unit tests in `frontend/tests/unit/collision-solver.test.ts`.
- **Milestone 1 — Phase 06 Surface Friction & Ground Roll Physics**: Implemented surface material physics contracts `SURFACE_MATERIAL_PRESETS` (`STONE_MARBLE`, `CRYSTAL_ICE`, `GRASS_MUD`, `KINETIC_BOOST_TRACK`, `DEEP_SAND`) in `shared/src/physics/surface-types.ts`, incline downslope gravity acceleration engine, and dynamic kinetic drift evaluation when lateral forces exceed static traction ($F_{\text{lateral}} > \mu_s \cdot N$) in `SurfaceFrictionEngine`. Created `frontend/tests/unit/surface-friction.test.ts`.
- **Milestone 1 — Phase 05 Dynamic Camera System & FOV Scaling**: Implemented speed-proportional dynamic FOV scaling with exponential decay damping, 1st-order critically damped follow filtering, landing cushion absorption recovery, and **5 toggleable camera angle modes** (`PLAYING`, `LOW_ANGLE_CHASE`, `DYNAMIC_ORBIT`, `CLOSE_ACTION`, `BIRDS_EYE`). Added `cycleCameraAngle()` in `GameplayCamera` and unit tests in `dynamic-camera.test.ts`.
- **Milestone 1 — Phase 04 Ribbon Track Architecture & Curvature Math**: Implemented core codebase classes `CatmullRomSplineSolver` (centripetal 3D spline interpolation), `TrackCurvatureSolver` (centrifugal acceleration $a_c = v^2 \cdot \kappa$ and banking angle $\theta_{\text{bank}} = \arctan\left(\frac{v^2 \cdot \kappa}{g}\right)$), and `RibbonMeshGenerator` (pre-allocated `Float32Array` ribbon quad vertex buffers). Created `shared/src/track/track-types.ts` contracts and `frontend/tests/unit/ribbon-track-spline.test.ts`.
- **Milestone 1 — Phase 03 Jump Physics & Air Control**: Verified multi-phase gravity solver (`Grounded`, `Ascending`, `Apex`, `Descending`, `FastFall`), variable jump height release cutoff math, coyote time window ($150\text{ ms}$), input jump buffering ($120\text{ ms}$), double-jump impulse handling, and $0.45\times$ airborne steering authority scaling.
- **Milestone 1 — Phase 02 Core Physics & Spherical Kinematics**: Verified deterministic 3D spherical kinetics solver, semi-implicit Euler step integration, response curves (`LinearCurve`, `EaseOutCurve`, `SineCurve`), and framerate-independent trajectory matching ($\Delta \text{Position} \le 0.0001$ units across 20–240 FPS).
- **Physics QA & Determinism**: Validated 5-minute continuous forward run (18,000 steps at 60 FPS) with 0 position drift, 0 NaNs, and 0 infinities (`momentum-kinematics.test.ts` & `physics-alignment.test.ts`).
- **Milestone 1 — Phase 01 Architecture Rules & Token Discipline**: Refactored UI components to enforce strict design token usage (`tokens.css`) and absolute separation between `PlayerHud` and `DevPanel`.
- **UI Token Discipline**: Eliminated all hardcoded hex color strings from `pipeline-debug-panel.ts` and `FlowstateHudOverlay.tsx`, dereferencing `var(--flow-...)` CSS custom properties.
- **GDOS Governance & Validator Integration**: Resolved 10 GDOS warnings and integrated `validate-gdos.js` into `npm run validate` pipeline, achieving **100% GDOS Quality Score**.
- **Engine Simulation Fixes**: Resolved simulation accumulation and transition formulas in `weather-transition-engine.ts` and `vegetation-health.ts`, achieving **100% Unit Test Pass Rate** (31/31 suites passed).

## [4.4.0] - 2026-07-23
### Added
- **Phase 04.02 Celestial Sky & Cloud Formations Engine**: Created `frontend/src/game/experience/celestial-sky-solver.ts` resolving Rayleigh zenith/horizon color shifts across solar elevation.
- **Shared Celestial Contracts**: Created `shared/src/signals/celestial-sky-state.ts` (`CelestialSkyState`).
- **GDOS Specifications**: Created `CELESTIAL_SKY_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/celestial-sky.test.ts` verifying rose gold dawn, midday azure gradients, Henyey-Greenstein Mie scattering, and zero star visibility at noon.

## [4.3.0] - 2026-07-23
### Added
- **Living Moments Bible Specification**: Created master emotional authority `06_LIVING_WORLD/LIVING_MOMENTS_BIBLE.md`.

- **World Director Architecture**: Created `frontend/src/game/experience/world-director.ts` orchestrating timing alignment (breeze holding for petal drift, dusk fireflies).
- **Quality Gate #4 (Living Experience Review)**: Enforced 5 mandatory experience questions for all future phases.
- **Unit Tests**: Created `frontend/tests/unit/living-moments-world-director.test.ts` verifying timing alignment, dusk fireflies, and zero UI notifications.

## [4.2.0] - 2026-07-23
### Added
- **Living Ecosystem Framework Specification**: Created master biological authority `06_LIVING_WORLD/LIVING_ECOSYSTEM_FRAMEWORK.md`.

- **Experience Director Evolution**: Created `frontend/src/game/experience/experience-director.ts` orchestrating cross-subsystem synchrony (Lighting, Music, Particles, Wildlife, Vegetation, Weather, Haptics).
- **Emergent Behavior Engine**: Organic emergence calculation for butterflies, birdsong, and pollen density with zero scripted spawners.
- **Unit Tests**: Created `frontend/tests/unit/living-ecosystem.test.ts` verifying emergent biological behavior and suppression under high wind/low sun.

## [4.1.0] - 2026-07-23
### Added
- **Engine Infrastructure Freeze & Milestone 4 Launch**: Strategic shift to game-first living world experience design.

- **Living World Bible Specification**: Created master authority `06_LIVING_WORLD/LIVING_WORLD_BIBLE.md`.
- **Experience Layer Architecture**: Updated pipeline data flow to `Gameplay -> Simulation -> Presentation -> Experience -> Rendering`.
- **Shared Experience Contracts**: Created `shared/src/signals/experience-state.ts` (`EmotionalMood`, `ExperienceSnapshot`).
- **Experience Tier**: Created `frontend/src/game/experience/` (`ExperienceResolver`, `WorldMemoryEngine`, `SolarArcSolver`).
- **Unit Tests**: Created `frontend/tests/unit/living-world-experience.test.ts` verifying emotional mood mapping, persistent valley memory accumulation, and solar arc elevation math.

## [3.5.0] - 2026-07-23
### Added
- **Phase 03.05 Adaptive Performance Intelligence (API) Framework**: Created `frontend/src/game/performance/` containing `PerformanceAnalyzer`, `QualityScaler`, and `PerformanceController`.

- **Shared Performance Contracts**: Created `shared/src/signals/performance-state.ts` (`QualityTier`, `PerformanceState`).
- **Telemetry & Diagnostics**: Extended `PipelineTelemetry` in `frontend/src/game/telemetry/pipeline-telemetry.ts` to log `performanceState`.
- **GDOS Specifications**: Created `ADAPTIVE_PERFORMANCE_INTELLIGENCE.md`.
- **Unit Tests**: Created `frontend/tests/unit/adaptive-performance.test.ts` verifying 60-frame hysteresis, priority pruning order, and 0-byte steady-state allocations.

## [3.4.0] - 2026-07-23
### Added
- **Engineering Mode Protocol & Phase 03.04 Kinetic Particle Field Simulation**: Upgraded engineering protocol; created `frontend/src/rendering/environment/particles/` containing `ParticlePoolManager`, `ParticleKinematicsSolver`, and `ParticleFieldRenderer`.

- **Shared Particle Contracts**: Created `shared/src/signals/particle-field-state.ts` (`ParticleFieldShaderState`) and added `particleField` to `PresentationSnapshot`.
- **GDOS Specifications**: Created `KINETIC_PARTICLE_FIELD_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/particle-field-kinematics.test.ts` verifying 14-float stride buffer indexing, drag/buoyancy kinematics, Hermite alpha fade curve, and 0-byte steady-state allocations.

## [3.3.0] - 2026-07-23
### Added
- **Phase 03.03 GPU Instanced Vegetation Wind Shaders**: Created `frontend/src/rendering/environment/vegetation/` containing `WindDisplacementSolver`, `InstanceBufferManager`, and `InstancedVegetationRenderer`.

- **Shared Shader Contracts**: Created `shared/src/signals/instanced-vegetation-state.ts` (`InstancedVegetationShaderState`) and added `instancedVegetation` to `PresentationSnapshot`.
- **GDOS Specifications**: Created `GPU_VEGETATION_WIND_SHADERS.md`.
- **Unit Tests**: Created `frontend/tests/unit/gpu-vegetation-wind.test.ts` verifying quadratic height bending stiffness, 16-float GPU instance matrix buffer packing, and 0-byte steady-state allocations.

## [3.2.0] - 2026-07-23
### Added
- **Phase 03.02 Dynamic Atmospheric Volumetrics & Sunshaft Lighting**: Created `frontend/src/rendering/environment/volumetrics/` containing `SunshaftSystem`, `VolumetricFogSystem`, and `VolumetricRenderer`.

- **Shared Volumetrics Contracts**: Created `shared/src/signals/atmosphere-volumetrics-state.ts` (`VolumetricLightingState`) and added `volumetricLighting` to `PresentationSnapshot`.
- **GDOS Specifications**: Created `ATMOSPHERIC_VOLUMETRICS_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/volumetric-lighting.test.ts` verifying Henyey-Greenstein Mie scattering phase calculations, height fog falloff, and 0-byte steady-state allocations.

## [3.1.0] - 2026-07-23
### Added
- **Phase 03.01 Data-Driven Biome Asset Pipeline & Splat Materials**: Created `frontend/src/rendering/environment/biome/` containing `BiomeManager`, `SplatMaterialEngine`, and `BiomeRenderer`.

- **Shared Biome Contracts**: Created `shared/src/signals/biome-state.ts` (`BiomeTypeEnum`, `BiomeConfig`, `PresentationBiomeState`).
- **GDOS Specifications**: Created `BIOME_SPLAT_MATERIAL_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/biome-splat-materials.test.ts` verifying biome config lookup, normalized splat weight blending, and 0-byte steady-state allocations.

## [2.5.0] - 2026-07-23
### Added
- **Phase 02.05 World Event & Resonance Cascade System**: Created `frontend/src/game/events/event-cascade-controller.ts` driving high-resonance world events (`BloomBurst`, `RadiantShift`, `HarmonyWave`, `TranscendentCascade`).

- **Shared Event Contracts**: Created `shared/src/signals/event-state.ts` (`WorldEventEnum`, `WorldEventState`, `PresentationEventState`).
- **Event Rendering Subsystem**: Created `frontend/src/rendering/environment/events/event-renderer.ts` with change-detection caching.
- **GDOS Specifications**: Created `RESONANCE_CASCADE_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/world-events.test.ts` verifying cascade event triggering on high flow/energy spikes, duration decay, and 0-byte steady-state allocations.

## [2.4.0] - 2026-07-23
### Added
- **Phase 02.04 Wildlife Ecosystem Simulation**: Created `frontend/src/game/wildlife/wildlife-controller.ts` driving population growth, flock cohesion, and activity level (0 `Math.random()`).

- **Shared Wildlife Contracts**: Created `shared/src/signals/wildlife-state.ts` (`WildlifeState`, `PresentationWildlifeState`).
- **Wildlife Rendering Subsystem**: Created `frontend/src/rendering/environment/wildlife/wildlife-renderer.ts` with change-detection caching.
- **GDOS Specifications**: Created `WILDLIFE_ECOSYSTEM_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/wildlife-ecosystem.test.ts` verifying population growth, flock cohesion scaling, and 0-byte steady-state allocations.

## [2.3.0] - 2026-07-23
### Added
- **Phase 02.03 Living Vegetation Growth & Blooming**: Created `frontend/src/game/vegetation/` containing `GrowthController`, `VegetationGrowthEngine`, and `VegetationHealth`.

- **Shared Vegetation Contracts**: Created `shared/src/signals/vegetation-state.ts` (`VegetationGrowthState`) and expanded `PresentationSnapshot.vegetation` (`flowerDensity`, `leafDensity`, `grassHeight`, `treeVitality`, `colorVariation`).
- **Vegetation System Upgrade**: Updated `VegetationSystem` in `frontend/src/rendering/environment/systems/vegetation-system.ts` with change-detection caching.
- **GDOS Specifications**: Created `VEGETATION_GROWTH_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/vegetation-growth.test.ts` verifying biological health accumulation, flower blooming, decay, and 0-byte steady-state allocations.

## [2.2.0] - 2026-07-23
### Added
- **Phase 02.02 Living Atmosphere & Weather Simulation**: Created `frontend/src/game/weather/` containing deterministic `WeatherController`, `WeatherStateMachine`, `WeatherTransitionEngine`, and `WeatherInterpolator` (0 `Math.random()`).

- **Shared Weather Contracts**: Created `shared/src/signals/weather-state.ts` (`WeatherType`: `Clear`, `Breezy`, `Overcast`, `Mist`; `WeatherState`, `PresentationWeatherState`).
- **Weather Rendering Tier**: Created `frontend/src/rendering/environment/weather/` containing `WeatherRenderer`, `CloudLayer`, `MistLayer`, and `WindController`.
- **GDOS Specifications**: Created `WEATHER_SIMULATION_MODEL.md`.
- **Unit Tests**: Created `frontend/tests/unit/weather-simulation.test.ts` verifying transition stability, determinism, smooth interpolation, and 0-byte steady-state allocations.

## [2.1.0] - 2026-07-23
### Added
- **Phase 02.01 Adaptive Audio & Haptics Pipeline**: Created `frontend/src/audio/` containing `MusicSystem`, `AmbientSystem`, `SFXSystem`, `HapticSystem`, and `AudioOrchestrator`.

## [1.5.0] - 2026-07-23
### Added
- **Milestone 1.5 Architecture Stabilization & Pipeline Telemetry**: Created `frontend/src/game/telemetry/pipeline-telemetry.ts` (120-frame rolling ring buffer), `pipeline-replayer.ts` (deterministic snapshot playback controls), and `frontend/src/ui/telemetry/pipeline-debug-panel.ts` (visual status badges using `var(--flow-text-scrim)`).
- **GDOS SLA Specification**: Created `PERFORMANCE_BUDGETS.md` specifying CPU SLAs (Total $\le 5.0\text{ ms}$), 0-byte steady-state frame allocations, and Quality Tier resource budgets.
- **Unit Tests**: Created `frontend/tests/unit/pipeline-telemetry.test.ts` verifying telemetry recording, ring buffer capping, budget compliance evaluation, and replayer controls.

## [1.4.0] - 2026-07-23
### Added
- **Phase 01.04 Reactive Environment Renderer**: Created `frontend/src/rendering/environment/systems/` containing generic `EnvironmentSubsystem<TState>` interface, `LightingSystem`, `SkySystem`, `TerrainRenderer`, `VegetationSystem`, `AtmosphereSystem`, `ParticleSystem`, and dependency-injected `EnvironmentOrchestrator`.

- **Composed Presentation Snapshot**: Refactored `shared/src/signals/presentation-state.ts` into modular substructures (`LightingState`, `SkyState`, `TerrainState`, `VegetationState`, `AtmosphereState`, `ParticleState`, `AudioState`, `CameraState`, `RenderFrameContext`).
- **Change Detection Caching**: Added substate caching to all subsystems to skip redundant GPU updates.
- **Unit Tests**: Created `frontend/tests/unit/reactive-environment.test.ts` verifying substate delegation, change detection caching, and end-to-end rendering from `PresentationSnapshot`.

## [1.3.0] - 2026-07-23
### Added
- **Phase 01.03 Presentation Resolver & Environment Foundation**: Created `frontend/src/game/presentation/presentation-resolver.ts` implementing declarative mapping from simulation state to rendering parameters.

- **Shared Presentation Contract**: Added `shared/src/signals/presentation-state.ts` (`PresentationSnapshot`).
- **Declarative WebGL Renderer**: Updated `EnvironmentView` in `frontend/src/rendering/environment/environment-view.ts` to declaratively consume `PresentationSnapshot`.
- **GDOS Specifications**: Updated `RENDER_PIPELINE.md` (6-stage presentation pipeline) and `ARCHITECTURE_MAP.md`.
- **Unit Tests**: Added `frontend/tests/unit/presentation-resolver.test.ts` verifying parameter scaling and 0-byte frame allocations.

## [1.2.0] - 2026-07-23
### Added
- **Phase 01.02 Resonance Interpretation & World State Engine**: Created `frontend/src/game/simulation/` containing `ResonanceInterpreter` and `WorldStateEngine`.

- **Shared Simulation Contract**: Added `shared/src/signals/world-input.ts` (`WorldInputSnapshot`) and expanded `WorldStateSnapshot` with environmental weights.
- **GDOS Specifications**: Created `RESONANCE_MODEL.md` (exponential energy decay math, hysteresis thresholds) and updated `WORLD_STATE_MODEL.md`.
- **Unit Tests**: Added `frontend/tests/unit/world-state-engine.test.ts` verifying energy accumulation, exponential decay, hysteresis stability, and 0-byte frame allocations.

## [1.1.0] - 2026-07-23
### Added
- **Phase 01.01 Gameplay Signal Architecture**: Created `frontend/src/game/signals/` implementing 3-layer architecture (`gameplay-signal-collector.ts`, `resonance-calculator.ts`, `gameplay-signal-emitter.ts`, `flow-signal-controller.ts`).

- **Shared Domain Contracts**: Added `@flowstate/shared/src/signals/` (`gameplay-signal.ts`, `resonance.ts`, `world-state.ts`).
- **GDOS Specifications**: Created `WORLD_STATE_MODEL.md` (6-state machine, 9-tier cascade) and `RENDER_PIPELINE.md` (5-stage presentation pipeline). Updated `ARCHITECTURE_MAP.md`.
- **Unit Tests**: Added `frontend/tests/unit/gameplay-signal.test.ts` verifying zero-allocation deterministic flow ratio calculation.

## [1.0.0] - 2026-07-23
### Added
- Created `FLOWSTATE_MASTER_GUIDE/` AI-Native Game Development Operating System framework.

- **Canon Bible**: Created `98_CANON/` with 10 documents including 27 Core Gameplay Laws and 42 Anti-Patterns.
- **Templates**: Established `TEMPLATES/` with 10 standardized specification templates.
- **Memory System**: Expanded `99_PROJECT_MEMORY/` with 18 tracking registers and `MEMORY_PROTOCOL.md`.
- **TypeScript Health**: Fixed type errors in `input-router.ts` and `prototype-metrics.ts`, achieving 0-error `npm run typecheck` across all monorepo workspaces.

### Documentation
- Scaffolded `INDEX.md`, `DEPENDENCY_GRAPH.md`, and `ROADMAP.md`.
