---
Title: "Project Decision Log"
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

# Project Decision Log

This log is the single source of truth for architectural, design, and technical decisions in FLOWSTATE.

---

### DEC-001: GDOS Architecture Framework
- **Decision ID**: DEC-001
- **Title**: Adopt Game Development Operating System (GDOS) v2.0
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex & User
- **Problem**: Large AI-assisted projects drift over time when guided by monolithic prompts.
- **Decision**: Scaffold `FLOWSTATE_MASTER_GUIDE/` containing 27 domain modules, templates, canon rules, project memory, and 100 modular phase packages.
- **Alternatives Considered**: Monolithic GDD markdown file; informal pull-request prompts.
- **Reasoning**: Decoupling tasks into self-contained phase packages with explicit Do-Not-Break boundaries guarantees stability.
- **Consequences**: All future tasks must follow GDOS templates and pass 10-Point AI Quality Gates.
- **Affected Modules**: All Modules (00 through 26)
- **Affected Phases**: Phases 01 through 100
- **Related ADRs**: [ARCHITECTURAL_DECISIONS.md](ARCHITECTURAL_DECISIONS.md#adr-001)
- **Status**: Approved

---

### DEC-002: UI Token & Background Scrim Discipline
- **Decision ID**: DEC-002
- **Title**: Enforce Strict Design Tokens and Scrim Overlay Rule
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Problem**: Un-tokenized hex colors and un-scrimmed text lead to illegible UI over vibrant WebGL 3D scenes.
- **Decision**: All UI components must strictly dereference CSS variables from `tokens.css` and use `var(--flow-text-scrim)` for text backgrounds over 3D canvases.
- **Alternatives Considered**: Direct inline styles; arbitrary tailwind classes.
- **Reasoning**: Enforces Luminous Minimalism and maintains contrast hierarchy across dynamic camera angles and biomes.
- **Consequences**: Direct hex values or un-tokenized font stacks in TS UI files are prohibited.
- **Affected Modules**: `13_UI_UX`, `06_ART_DIRECTION`
- **Affected Phases**: Phase 01, Phase 13
- **Related ADRs**: [ARCHITECTURAL_DECISIONS.md](ARCHITECTURAL_DECISIONS.md#adr-002)
- **Status**: Approved

---

### DEC-003: HUD vs DevPanel Telemetry Isolation
- **Decision ID**: DEC-003
- **Title**: Architectural Separation of Player HUD and DevPanel
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Problem**: Technical debug overlays pollute player immersion and risk coupling UI code to physics solvers.
- **Decision**: Keep `PlayerHud` unobtrusive ("Luminous Minimalism") and isolate technical debug metrics (FPS, raw position vectors, input intents) inside `DevPanel`.
- **Alternatives Considered**: Single unified UI overlay with toggle flags.
- **Reasoning**: Maintains player flow state while providing full engineering telemetry.
- **Consequences**: Telemetry data is delivered via read-only event buses.
- **Affected Modules**: `13_UI_UX`, `00_PROJECT_CORE`
- **Affected Phases**: Phase 01, Phase 13
- **Related ADRs**: [ARCHITECTURAL_DECISIONS.md](ARCHITECTURAL_DECISIONS.md#adr-003)
- **Status**: Approved

---

### DEC-006: Decoupled 3-Layer Gameplay Signal Architecture
- **Decision ID**: DEC-006
- **Title**: Decoupled 3-Layer Gameplay Signal Architecture
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Signal generation was initially coupled to movement, limiting telemetry producers.
- **Decision**: Isolate signal processing into `frontend/src/game/signals/` using 3 layers: Collectors (raw facts) -> Calculator (pure deterministic math) -> Emitter (immutable `GameplaySignalSnapshot` broadcaster). Shared contracts live in `@flowstate/shared/src/signals/`.
- **Impact**: Complete decoupling between Gameplay, Simulation, and Presentation pipelines.

---

### DEC-007: Resonance Interpreter & Simulation Domain Decoupling
- **Decision ID**: DEC-007
- **Title**: Resonance Interpreter & Simulation Domain Decoupling
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: World state machines must never consume gameplay concepts directly (`trajectoryAccuracy`, `flowRatio`).
- **Decision**: Insert `ResonanceInterpreter` layer in `frontend/src/game/simulation/` to translate `GameplaySignalSnapshot` into environmental `WorldInputSnapshot` (`growthPotential`, `environmentEnergy`, `harmony`). `WorldStateEngine` manages continuous energy accumulation, exponential decay, and hysteresis state evaluation without reading gameplay mechanics.
- **Impact**: Simulation and Presentation pipelines consume pure environmental domain snapshots without coupling to movement physics.

---

### DEC-008: Presentation Resolver & Declarative Rendering Mapping
- **Decision ID**: DEC-008
- **Title**: Presentation Resolver & Declarative Rendering Mapping
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Graphics renderers must never interpret gameplay concepts or world state enums directly (`if (state === Blooming) ...`).
- **Decision**: Insert `PresentationResolver` layer in `frontend/src/game/presentation/` to translate `WorldStateSnapshot` into declarative `PresentationSnapshot` (`skyBlend`, `sunIntensity`, `fogDensity`, `grassDensity`, `musicLayerWeights`). WebGL canvas components update parameters declaratively.
- **Impact**: Completely data-driven rendering pipeline decoupled from game simulation rules.

---

### DEC-009: Modular Reactive Environment Systems & Change-Detection Caching
- **Decision ID**: DEC-009
- **Title**: Modular Reactive Environment Systems & Change-Detection Caching
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Flat rendering snapshot structures bloat over time and trigger expensive redundant GPU uniform writes every frame.
- **Decision**: 
  1. Refactor `PresentationSnapshot` into composed domain substructures (`LightingState`, `SkyState`, `TerrainState`, `VegetationState`, `AtmosphereState`, `ParticleState`, `AudioState`, `CameraState`).
  2. Define generic `EnvironmentSubsystem<TState>` interface with change detection caching.
  3. Implement modular subsystems (`LightingSystem`, `SkySystem`, `TerrainRenderer`, `VegetationSystem`, `AtmosphereSystem`, `ParticleSystem`) orchestrated by a dependency-injected `EnvironmentOrchestrator`.
- **Impact**: 0-byte frame allocations and 0 redundant GPU updates when snapshot parameters remain constant.

---

### DEC-010: Pipeline Telemetry, SLA Performance Budgets, & Deterministic Replayer
- **Decision ID**: DEC-010
- **Title**: Pipeline Telemetry, SLA Performance Budgets, & Deterministic Replayer
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Milestone 1.5 requires objective telemetry instrumentation and regression control before starting Milestone 2 features.
- **Decision**:
  1. Establish `PERFORMANCE_BUDGETS.md` SLA specifying CPU timing budgets (Total $\le 5.0\text{ ms}$) and 0-byte steady-state frame allocations.
  2. Build `PipelineTelemetry` with 120-frame rolling ring buffer and budget compliance checks.
  3. Build `PipelineDebugPanel` UI displaying pipeline flow status badges (`✓ Within Budget`, `⚠ Over Budget`) backed by `var(--flow-text-scrim)`.
  4. Build `PipelineReplayer` providing deterministic snapshot trajectory recording and playback controls (`startRecording`, `stopRecording`, `play`, `pause`, `stepFrame`, `jumpToFrame`).
- **Impact**: Complete observability and deterministic regression protection across all 4 pipeline tiers.

---

### DEC-011: Adaptive Audio & Haptics Pipeline Architecture
- **Decision ID**: DEC-011
- **Title**: Adaptive Audio & Haptics Pipeline Architecture
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Sound stems, ambient soundscapes, and tactile haptics must respond dynamically to environmental state without gameplay or renderer side-effects.
- **Decision**:
  1. Create structured `audio-state.ts` contracts (`MusicState`, `AmbientState`, `SFXState`, `HapticState`, `AudioState`).
  2. Refactor `PresentationSnapshot.audio` to consume `AudioState`.
  3. Create modular `frontend/src/audio/` subsystems (`MusicSystem`, `AmbientSystem`, `SFXSystem`, `HapticSystem`) orchestrated by dependency-injected `AudioOrchestrator`.
- **Impact**: Audio and tactile haptics respond 100% reactively to `PresentationSnapshot.audio` with zero gameplay coupling.

---

### DEC-012: Deterministic Living Atmosphere & Weather Simulation
- **Decision ID**: DEC-012
- **Title**: Deterministic Living Atmosphere & Weather Simulation
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Weather must emerge deterministically from environmental simulation state without random weather switches or direct renderer coupling.
- **Decision**:
  1. Create GDOS spec `WEATHER_SIMULATION_MODEL.md`.
  2. Create shared contracts `WeatherState` and `PresentationWeatherState`.
  3. Build `frontend/src/game/weather/` simulation controller (`Clear` $\leftrightarrow$ `Breezy` $\leftrightarrow$ `Overcast` $\leftrightarrow$ `Mist`) with hysteresis and exponential parameter interpolation (0 `Math.random()`).
  4. Build `frontend/src/rendering/environment/weather/weather-renderer.ts` orchestrating subtle cloud opacity, mist density, and wind swaying.
- **Impact**: Calm, atmospheric weather transitions driven 100% by simulation energy with zero steady-state allocations.

---

### DEC-013: Biological Vegetation Growth & Blooming Simulation
- **Decision ID**: DEC-013
- **Title**: Biological Vegetation Growth & Blooming Simulation
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Vegetation should evolve from simple static density changes into continuous biological growth, flower blooming, leaf density variation, and tree vitality.
- **Decision**:
  1. Create GDOS spec `VEGETATION_GROWTH_MODEL.md`.
  2. Create shared contract `VegetationGrowthState` and expand `PresentationSnapshot.vegetation`.
  3. Build `frontend/src/game/vegetation/` differential growth engine (`growth`, `health`, `bloomProgress`, `flowerDensity`, `leafDensity`, `grassHeight`, `treeVitality`).
  4. Upgrade `VegetationSystem` in `frontend/src/rendering/environment/systems/vegetation-system.ts` with change-detection caching.
- **Impact**: Dynamic biological vegetation response driven 100% by simulation energy with zero steady-state allocations.

---

### DEC-014: Wildlife Ecosystem & Population Dynamics Simulation
- **Decision ID**: DEC-014
- **Title**: Wildlife Ecosystem & Population Dynamics Simulation
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Creatures and fauna emergence should be driven 100% by simulation state without random spawning or direct renderer coupling.
- **Decision**:
  1. Create GDOS spec `WILDLIFE_ECOSYSTEM_MODEL.md`.
  2. Create shared contracts `WildlifeState` and `PresentationWildlifeState`.
  3. Build `frontend/src/game/wildlife/wildlife-controller.ts` driving population growth, flock cohesion, and activity level (0 `Math.random()`).
  4. Build `frontend/src/rendering/environment/wildlife/wildlife-renderer.ts` with change-detection caching.
- **Impact**: Deterministic wildlife emergence responding reactively to environmental energy and harmony.

---

### DEC-015: World Event & Resonance Cascade System
- **Decision ID**: DEC-015
- **Title**: World Event & Resonance Cascade System
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Peak player flow performance and environmental energy spikes should trigger high-resonance world events (`BloomBurst`, `RadiantShift`, `HarmonyWave`, `TranscendentCascade`).
- **Decision**:
  1. Create GDOS spec `RESONANCE_CASCADE_MODEL.md`.
  2. Create shared contracts `WorldEventEnum`, `WorldEventState`, and `PresentationEventState`.
  3. Build `frontend/src/game/events/event-cascade-controller.ts` evaluating flow thresholds and managing event decay (0 `Math.random()`).
  4. Build `frontend/src/rendering/environment/events/event-renderer.ts` with change-detection caching.
- **Impact**: High-impact world events driven 100% by simulation energy with zero steady-state allocations, concluding Milestone 2.

---

### DEC-016: Data-Driven Biome Asset Pipeline & Procedural Splat Materials
- **Decision ID**: DEC-016
- **Title**: Data-Driven Biome Asset Pipeline & Procedural Splat Materials
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Terrain visual presentation must transition smoothly across data-driven biomes (`Valley`, `AlpineMeadow`, `DesertCanyon`, `MysticForest`, `TranscendentVoid`) with height-blended splat material weights.
- **Decision**:
  1. Create GDOS spec `BIOME_SPLAT_MATERIAL_MODEL.md`.
  2. Create shared contracts `BiomeTypeEnum`, `BiomeConfig`, and `PresentationBiomeState`.
  3. Build `frontend/src/rendering/environment/biome/` subsystem (`BiomeManager`, `SplatMaterialEngine`, `BiomeRenderer`) with change-detection caching.
- **Impact**: Multi-biome splat material blending with 0-byte steady-state allocations, launching Milestone 3.

---

### DEC-017: Dynamic Atmospheric Volumetrics & Sunshaft Lighting System
- **Decision ID**: DEC-017
- **Title**: Dynamic Atmospheric Volumetrics & Sunshaft Lighting System
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Volumetric fog and sunshaft light scattering must respond dynamically to environmental mist density and sun angle without random calculations or direct shader-gameplay coupling.
- **Decision**:
  1. Create GDOS spec `ATMOSPHERIC_VOLUMETRICS_MODEL.md`.
  2. Create shared contract `VolumetricLightingState` and add `volumetricLighting` to `PresentationSnapshot`.
  3. Build `frontend/src/rendering/environment/volumetrics/` subsystem (`SunshaftSystem`, `VolumetricFogSystem`, `VolumetricRenderer`) with change-detection caching.
- **Impact**: Atmospheric light scattering and height fog falloff with 0-byte steady-state allocations.

---

### DEC-018: GPU Instanced Vegetation Wind Shaders & Dynamic Sway Systems
- **Decision ID**: DEC-018
- **Title**: GPU Instanced Vegetation Wind Shaders & Dynamic Sway Systems
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: High-density foliage (10,000+ grass blades & trees) must sway under wind simulation via GPU instanced vertex displacement without CPU vertex loops or GC allocations.
- **Decision**:
  1. Create GDOS spec `GPU_VEGETATION_WIND_SHADERS.md`.
  2. Create shared contract `InstancedVegetationShaderState` and add `instancedVegetation` to `PresentationSnapshot`.
  3. Build `frontend/src/rendering/environment/vegetation/` subsystem (`WindDisplacementSolver`, `InstanceBufferManager`, `InstancedVegetationRenderer`) with change-detection caching.
- **Impact**: Packed 16-float GPU instance matrix buffer management and quadratic height bending stiffness with 0-byte steady-state allocations.

---

### DEC-019: Kinetic Particle Field & Energy Flow Simulation Engine
- **Decision ID**: DEC-019
- **Title**: Kinetic Particle Field & Energy Flow Simulation Engine
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: High-density particle fields (up to 50,000 particles) representing environmental energy flow vectors must simulate with 0 heap allocations during gameplay ticks.
- **Decision**:
  1. Create GDOS spec `KINETIC_PARTICLE_FIELD_MODEL.md`.
  2. Create shared contract `ParticleFieldShaderState` and add `particleField` to `PresentationSnapshot`.
  3. Build `frontend/src/rendering/environment/particles/` subsystem (`ParticlePoolManager`, `ParticleKinematicsSolver`, `ParticleFieldRenderer`) using contiguous 14-float stride `Float32Array` buffers.
- **Impact**: 50,000-particle kinetic velocity integration and Hermite cubic opacity fade curves with 0-byte steady-state allocations.

---

### DEC-020: Game-First Adaptive Performance Intelligence (API) Framework
- **Decision ID**: DEC-020
- **Title**: Game-First Adaptive Performance Intelligence (API) Framework
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Generic Dynamic Resolution Scaling (DRS) degrades visual clarity indiscriminately. FLOWSTATE requires a game-aware adaptive performance hierarchy that prunes invisible environmental detail before reducing resolution.
- **Decision**:
  1. Create GDOS spec `ADAPTIVE_PERFORMANCE_INTELLIGENCE.md`.
  2. Create shared contract `PerformanceState` (`QualityTier`, `scalingLevel`, `scalingReason`).
  3. Build `frontend/src/game/performance/` tier (`PerformanceAnalyzer`, `QualityScaler`, `PerformanceController`) with 60-frame hysteresis.
  4. Enforce strict pruning order: Particles $\rightarrow$ Grass $\rightarrow$ Cloud $\rightarrow$ Shadow $\rightarrow$ Mist $\rightarrow$ Wildlife $\rightarrow$ PostFX $\rightarrow$ Internal Resolution.
- **Impact**: Game-aware adaptive performance scaling preserving living world emotional connection and 100% crisp resolution until critical, concluding Milestone 3.

---

### DEC-021: Engine Freeze, Living World Bible & Experience Layer Architecture
- **Decision ID**: DEC-021
- **Title**: Engine Freeze, Living World Bible & Experience Layer Architecture
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: Low-level engine infrastructure freeze initiated to prioritize moment-to-moment emotional experience of a living world. Introduces formal Experience Layer (`Gameplay -> Simulation -> Presentation -> Experience -> Rendering`).
- **Decision**:
  1. Create master GDOS design authority `LIVING_WORLD_BIBLE.md`.
  2. Create shared contracts `EmotionalMood` (`lonely`, `quiet`, `hopeful`, `alive`, `joyful`, `sacred`) and `ExperienceSnapshot`.
  3. Build `frontend/src/game/experience/` tier (`ExperienceResolver`, `WorldMemoryEngine`, `SolarArcSolver`).
  4. Launch **Milestone 4 — Living World Experience** focusing on emotional resonance, persistent valley healing, and subtle natural interactions.
- **Impact**: Shift from engine-first to game-first living world experience design.

---

### DEC-022: Living Ecosystem Framework & Experience Director Architecture
- **Decision ID**: DEC-022
- **Title**: Living Ecosystem Framework & Experience Director Architecture
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: The world must behave like a living biological ecosystem where player flow restores harmony, propagating ecological reactions without scripted spawners or isolated systems.
- **Decision**:
  1. Create GDOS spec `LIVING_ECOSYSTEM_FRAMEWORK.md`.
  2. Evolve Experience Layer into `ExperienceDirector` (`frontend/src/game/experience/experience-director.ts`) orchestrating cross-subsystem synchrony across Lighting, Music, Particles, Wildlife, Vegetation, Weather, and Haptics.
  3. Enforce 5 mandatory Ecosystem Review Questions for all future Milestone 4 phases.
  4. Implement organic emergence math (e.g., butterflies emerge naturally when `bloomRatio > 0.4` + `sunlit` + `calm wind`).
- **Impact**: Emergent biological interactions and cross-subsystem emotional synchronization.

---

### DEC-023: Living Moments Bible & World Director Architecture
- **Decision ID**: DEC-023
- **Title**: Living Moments Bible & World Director Architecture
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: FLOWSTATE must be designed around memorable emotional player moments rather than mechanics or raw engine features. Introduces 4th mandatory Quality Gate (#4 Living Experience Review).
- **Decision**:
  1. Create master emotional authority `LIVING_MOMENTS_BIBLE.md`.
  2. Define Moment Hierarchy: Micro Moments, Living Moments, Transformation Moments, Sacred Moments (ZERO UI, ZERO achievements, ZERO text popups).
  3. Evolve Experience Director into `WorldDirector` (`frontend/src/game/experience/world-director.ts`) orchestrating subtle timing alignment (breeze holding for petal drift, dusk fireflies).
  4. Enforce mandatory Gate #4 Living Experience Review (5 questions) across all future phases.
- **Impact**: Player-centric emotional moment hierarchy and timing-aligned World Director.

---

### DEC-024: Phase 04.02 — Celestial Sky & Atmospheric Cloud Formations Engine
- **Decision ID**: DEC-024
- **Title**: Phase 04.02 — Celestial Sky & Atmospheric Cloud Formations Engine
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex
- **Status**: Approved
- **Context**: The sky must transition smoothly across solar elevation angles using Rayleigh scattering color gradients and Henyey-Greenstein Mie phase functions without heavy WebGL texture sampling or GC allocations.
- **Decision**:
  1. Create GDOS spec `CELESTIAL_SKY_MODEL.md`.
  2. Create shared contract `CelestialSkyState` (`sunElevationDeg`, `zenithColorHex`, `horizonColorHex`, `mieScatteringIntensity`, `starVisibility`).
  3. Build `frontend/src/game/experience/celestial-sky-solver.ts` resolving Rose Gold Dawn $\rightarrow$ Midday Azure $\rightarrow$ Deep Twilight gradients.
  4. Satisfy all 10 steps of the Master Phase Development Protocol.
- **Impact**: Dynamic Rayleigh/Mie sky color gradients and cloud density coupling with 0-byte steady-state allocations per tick.

















