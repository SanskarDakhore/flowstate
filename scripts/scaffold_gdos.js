const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');

const modules = [
  {
    dir: '00_PROJECT_CORE',
    name: 'Project Core',
    purpose: 'Defines the foundational principles, architectural boundaries, coding standards, and core project philosophy.',
    responsibilities: ['Architectural governance', 'Coding standards enforcement', 'Do-Not-Break rules definitions'],
    systems: ['Core Rules Engine', 'Quality Gates', 'AI Guidelines'],
    dependencies: [],
    future: ['Automated linter rules', 'CI quality checks'],
    related: ['25_PRODUCTION_MANAGEMENT', '99_PROJECT_MEMORY']
  },
  {
    dir: '01_GAMEPLAY',
    name: 'Gameplay Mechanics',
    purpose: 'Govern the primary gameplay loop, player interactions, momentum scaling, and combo systems.',
    responsibilities: ['Core gameplay loop execution', 'Player controls mapping', 'Combo & score evaluation'],
    systems: ['Gameplay Loop', 'Control Router', 'Combo Evaluator', 'Difficulty Scaler'],
    dependencies: ['02_PHYSICS', '07_PLAYER_SPHERE'],
    future: ['Advanced combo mechanics', 'Dynamic risk-reward scaling'],
    related: ['02_PHYSICS', '07_PLAYER_SPHERE', '14_BALANCE']
  },
  {
    dir: '02_PHYSICS',
    name: 'Physics Engine',
    purpose: 'Simulate deterministic ball kinetics, gravity scaling, surface friction, jumps, and collision solver math.',
    responsibilities: ['Kinetics calculation', 'Surface interaction', 'Collision response'],
    systems: ['Kinematics Solver', 'Gravity Model', 'Friction Model', 'Collision System'],
    dependencies: ['15_TECHNICAL_ENGINE'],
    future: ['Dynamic fluid friction', 'Aerodynamic drag model'],
    related: ['01_GAMEPLAY', '08_TRACK_SYSTEM', '07_PLAYER_SPHERE']
  },
  {
    dir: '03_LEVEL_DESIGN',
    name: 'Level Design & Procedural Generation',
    purpose: 'Define procedural track generation algorithms, ribbon curve mathematics, and challenge layouts.',
    responsibilities: ['Track generation', 'Difficulty placement', 'Procedural seed rules'],
    systems: ['Ribbon Generator', 'Seed Pipeline', 'Challenge Builder'],
    dependencies: ['08_TRACK_SYSTEM', '02_PHYSICS'],
    future: ['Endless world generation', 'Ranked track layout seeds'],
    related: ['08_TRACK_SYSTEM', '04_LIVING_WORLD_SIMULATION']
  },
  {
    dir: '04_LIVING_WORLD_SIMULATION',
    name: 'Living World Simulation',
    purpose: 'Simulate eco-growth state machine, weather cycles, day/night progression, and ambient ecosystems.',
    responsibilities: ['Ecosystem growth simulation', 'Weather cycle state', 'Time of day progression'],
    systems: ['Resonance Engine', 'Weather State Machine', 'Day/Night Controller'],
    dependencies: ['01_GAMEPLAY'],
    future: ['Seasonal shifts', 'Wildlife population simulation'],
    related: ['05_ENVIRONMENT_RENDERING', '12_AUDIO_ENGINE']
  },
  {
    dir: '05_ENVIRONMENT_RENDERING',
    name: 'Environment Rendering Pipeline',
    purpose: 'Govern GPU instancing, terrain splatting shaders, foliage rendering, atmosphere, and volumetric VFX.',
    responsibilities: ['GPU foliage instancing', 'Splat map shaders', 'Volumetric lighting & post-FX'],
    systems: ['Grass Shader System', 'Terrain Splat Engine', 'Atmosphere Post-FX'],
    dependencies: ['04_LIVING_WORLD_SIMULATION', '16_SHADER_SYSTEM'],
    future: ['Compute shader grass physics', 'HDR bloom customization'],
    related: ['04_LIVING_WORLD_SIMULATION', '06_ART_DIRECTION', '16_SHADER_SYSTEM']
  },
  {
    dir: '06_ART_DIRECTION',
    name: 'Art Direction & Aesthetics',
    purpose: 'Define color language, visual style rules, PBR material standards, and visual clarity guidelines.',
    responsibilities: ['Visual style enforcement', 'Color palette curation', 'Material aesthetics'],
    systems: ['Color Palette Registry', 'Material Preset Engine', 'VFX Aesthetics'],
    dependencies: [],
    future: ['Seasonal art theme packs', 'Biomaterial variations'],
    related: ['05_ENVIRONMENT_RENDERING', '07_PLAYER_SPHERE', '13_UI_UX']
  },
  {
    dir: '07_PLAYER_SPHERE',
    name: 'Player Sphere & Customization',
    purpose: 'Define player sphere mesh, material layers, evolution stages, trail visual FX, and cosmetic customization.',
    responsibilities: ['Sphere mesh rendering', 'Trail particle attachment', 'Customization state'],
    systems: ['Ball Renderer', 'Trail System', 'Aura Visualizer', 'Skins System'],
    dependencies: ['02_PHYSICS', '06_ART_DIRECTION'],
    future: ['Custom aura shaders', 'Interactive emote visualizers'],
    related: ['01_GAMEPLAY', '11_COSMETICS_ECONOMY', '02_PHYSICS']
  },
  {
    dir: '08_TRACK_SYSTEM',
    name: 'Track System & Ribbon Architecture',
    purpose: 'Define ribbon spline architecture, surface material types, track integrity specs, and slope calculations.',
    responsibilities: ['Ribbon mesh generation', 'Surface friction mapping', 'Spline curvature math'],
    systems: ['Spline Engine', 'Surface Mapper', 'Integrity Validator'],
    dependencies: ['02_PHYSICS'],
    future: ['Dynamic track branching', 'Destructible track segments'],
    related: ['03_LEVEL_DESIGN', '02_PHYSICS']
  },
  {
    dir: '09_PROGRESSION',
    name: 'Progression & Unlocks',
    purpose: 'Govern XP calculation, player level curves, mastery ranks, achievements, and seasonal progress.',
    responsibilities: ['XP calculation', 'Level curve math', 'Achievement tracking'],
    systems: ['XP Engine', 'Mastery Tracker', 'Achievement Manager'],
    dependencies: ['01_GAMEPLAY'],
    future: ['Prestige tiers', 'Battle pass progression matrix'],
    related: ['10_PERKS', '11_COSMETICS_ECONOMY', '14_BALANCE']
  },
  {
    dir: '10_PERKS',
    name: 'Perk System & Upgrades',
    purpose: 'Define passive and active perks, skill tree progression, perk synergies, and upgrade balancing.',
    responsibilities: ['Perk evaluation', 'Perk tree management', 'Stat modifier application'],
    systems: ['Perk Engine', 'Tree Manager', 'Modifier Pipeline'],
    dependencies: ['09_PROGRESSION', '01_GAMEPLAY'],
    future: ['Hybrid perk tree synergies', 'Active perk abilities'],
    related: ['09_PROGRESSION', '14_BALANCE', '01_GAMEPLAY']
  },
  {
    dir: '11_COSMETICS_ECONOMY',
    name: 'Cosmetics & Ethical Economy',
    purpose: 'Manage sphere skins, trail skins, ecosystem visual themes, and non-P2W cosmetic monetization.',
    responsibilities: ['Cosmetic collection registry', 'Unlocks state', 'Store catalog data'],
    systems: ['Skin Registry', 'Theme Catalog', 'Cosmetic Inventory'],
    dependencies: ['07_PLAYER_SPHERE', '09_PROGRESSION'],
    future: ['Seasonal cosmetic rotations', 'Rarity tier visualizers'],
    related: ['07_PLAYER_SPHERE', '23_MONETIZATION', '09_PROGRESSION']
  },
  {
    dir: '12_AUDIO_ENGINE',
    name: 'Audio Engine & Dynamic Music',
    purpose: 'Control spatial 3D audio, dynamic flow state music stem mixing, sound effects, and haptic feedback.',
    responsibilities: ['Interactive stem mixing', 'Spatial sound playback', 'Haptic trigger sync'],
    systems: ['Stem Mixer Engine', 'Spatial Audio Manager', 'Haptic Controller'],
    dependencies: ['01_GAMEPLAY', '04_LIVING_WORLD_SIMULATION'],
    future: ['Adaptive bi-aural spatializer', 'Custom haptic patterns'],
    related: ['04_LIVING_WORLD_SIMULATION', '13_UI_UX']
  },
  {
    dir: '13_UI_UX',
    name: 'UI / UX Architecture',
    purpose: 'Govern Luminous Minimalist HUD, glassmorphism scrim design, DevPanel isolation, and CSS tokens.',
    responsibilities: ['HUD presentation', 'DevPanel telemetry', 'Touch gesture routing'],
    systems: ['PlayerHUD Controller', 'DevPanel Telemetry Drawer', 'CSS Token System'],
    dependencies: ['00_PROJECT_CORE', '06_ART_DIRECTION'],
    future: ['Motion design micro-animations', 'Customizable HUD layouts'],
    related: ['00_PROJECT_CORE', '06_ART_DIRECTION']
  },
  {
    dir: '14_BALANCE',
    name: 'Game Balance & Economy Matrix',
    purpose: 'Maintain difficulty curves, score formulas, spawn frequencies, XP scaling, and perk balancing.',
    responsibilities: ['Balance curve validation', 'Score formula tuning', 'Economy scaling'],
    systems: ['Balance Matrix', 'Score Calculator', 'Difficulty Modeler'],
    dependencies: ['01_GAMEPLAY', '09_PROGRESSION', '10_PERKS'],
    future: ['Automated balance simulator', 'Telemetry-driven tuning'],
    related: ['01_GAMEPLAY', '09_PROGRESSION', '10_PERKS']
  },
  {
    dir: '15_TECHNICAL_ENGINE',
    name: 'Technical Engine Core',
    purpose: 'Manage low-level game loop, scene graph, memory management, object pooling, and input routing.',
    responsibilities: ['Game loop timing', 'Memory allocation pooling', 'Input routing'],
    systems: ['Core Game Loop', 'Object Pool Manager', 'Input Router', 'Scene Manager'],
    dependencies: [],
    future: ['Multi-threaded task dispatcher', 'Zero-allocation entity manager'],
    related: ['02_PHYSICS', '16_SHADER_SYSTEM', '18_OPTIMIZATION_LOD']
  },
  {
    dir: '16_SHADER_SYSTEM',
    name: 'Shader Architecture & Materials',
    purpose: 'Manage custom GLSL/HLSL shaders, post-processing materials, compute shaders, and PBR shaders.',
    responsibilities: ['Shader compilation', 'Material parameter updates', 'Compute pipeline'],
    systems: ['Shader Registry', 'Material Manager', 'Post-FX Pipeline'],
    dependencies: ['15_TECHNICAL_ENGINE'],
    future: ['Compute shader dynamic water', 'Mobile fallback shader tier'],
    related: ['05_ENVIRONMENT_RENDERING', '18_OPTIMIZATION_LOD']
  },
  {
    dir: '17_ASSET_PIPELINE',
    name: 'Asset Pipeline & Standards',
    purpose: 'Establish asset import standards, texture compression, HDRI processing, model optimization rules.',
    responsibilities: ['Asset compression', 'Import validation', 'Format standardization'],
    systems: ['Asset Import Pipeline', 'Texture Streamer', 'Mesh Optimizer'],
    dependencies: [],
    future: ['Automated mesh LOD generator', 'KTX2 texture compression'],
    related: ['05_ENVIRONMENT_RENDERING', '18_OPTIMIZATION_LOD']
  },
  {
    dir: '18_OPTIMIZATION_LOD',
    name: 'Optimization & LOD Systems',
    purpose: 'Govern GPU instancing, LOD distance matrices, draw call minimization, and VRAM memory budgets.',
    responsibilities: ['Draw call reduction', 'VRAM budget monitoring', 'LOD switching'],
    systems: ['LOD Controller', 'Memory Monitor', 'Instancing Engine'],
    dependencies: ['15_TECHNICAL_ENGINE', '16_SHADER_SYSTEM'],
    future: ['Dynamic resolution scaling', 'Occlusion culling system'],
    related: ['15_TECHNICAL_ENGINE', '05_ENVIRONMENT_RENDERING']
  },
  {
    dir: '19_SOCIAL_MULTIPLAYER',
    name: 'Social & Asynchronous Multiplayer',
    purpose: 'Manage leaderboards, asynchronous ghost replays, friend challenges, and seasonal events.',
    responsibilities: ['Ghost recording & playback', 'Leaderboard API integration', 'Social feed'],
    systems: ['Ghost Engine', 'Leaderboard Client', 'Social Manager'],
    dependencies: ['20_BACKEND_INFRASTRUCTURE'],
    future: ['Realtime ghost matchmaking', 'Custom tournament system'],
    related: ['20_BACKEND_INFRASTRUCTURE', '21_SAVE_CLOUD_SYSTEM']
  },
  {
    dir: '20_BACKEND_INFRASTRUCTURE',
    name: 'Backend Infrastructure & APIs',
    purpose: 'Define REST/WebSocket APIs, database schemas, authentication, rate limiting, and backend services.',
    responsibilities: ['API endpoint management', 'Authentication & sessions', 'Database persistence'],
    systems: ['API Gateway', 'Auth Service', 'Database Manager'],
    dependencies: [],
    future: ['Distributed edge deployment', 'Redis caching tier'],
    related: ['19_SOCIAL_MULTIPLAYER', '21_SAVE_CLOUD_SYSTEM']
  },
  {
    dir: '21_SAVE_CLOUD_SYSTEM',
    name: 'Save System & Cloud Synchronization',
    purpose: 'Manage local state serialization, cloud save sync, conflict resolution, and migration firmware.',
    responsibilities: ['State serialization', 'Cloud storage sync', 'Conflict handling'],
    systems: ['Save Serializer', 'Cloud Sync Service', 'Migration Engine'],
    dependencies: ['20_BACKEND_INFRASTRUCTURE'],
    future: ['Automated rollback on corruption', 'Cross-platform cloud sync'],
    related: ['20_BACKEND_INFRASTRUCTURE', '09_PROGRESSION']
  },
  {
    dir: '22_ANALYTICS_TELEMETRY',
    name: 'Analytics & Telemetry',
    purpose: 'Collect anonymous performance telemetry, player retention metrics, crash reporting, and privacy compliance.',
    responsibilities: ['Performance logging', 'Player cohort analysis', 'Crash report routing'],
    systems: ['Telemetry Collector', 'Crash Reporter', 'Privacy Guard'],
    dependencies: ['20_BACKEND_INFRASTRUCTURE'],
    future: ['Realtime performance heatmap', 'Automated anomaly detection'],
    related: ['25_PRODUCTION_MANAGEMENT', '20_BACKEND_INFRASTRUCTURE']
  },
  {
    dir: '23_MONETIZATION',
    name: 'Monetization Architecture',
    purpose: 'Govern ethical cosmetic purchases, battle pass architecture, receipt validation, and platform compliance.',
    responsibilities: ['In-app purchase validation', 'Battle pass rewards', 'Platform store compliance'],
    systems: ['Purchase Verifier', 'Battle Pass Engine', 'Compliance Manager'],
    dependencies: ['11_COSMETICS_ECONOMY', '20_BACKEND_INFRASTRUCTURE'],
    future: ['Multi-currency cosmetics catalog', 'Dynamic offer system'],
    related: ['11_COSMETICS_ECONOMY', '26_RELEASE_LIVEOPS']
  },
  {
    dir: '24_TESTING_QA',
    name: 'Testing & QA Automation',
    purpose: 'Define unit testing suites, physics determinism tests, visual regression tests, and mobile performance benchmarks.',
    responsibilities: ['Automated test execution', 'Physics regression checks', 'CI integration'],
    systems: ['Unit Test Suite', 'Physics Determinism Checker', 'Visual Regression Harness'],
    dependencies: ['00_PROJECT_CORE'],
    future: ['Automated AI bot playtesting', 'Mobile thermal testing suite'],
    related: ['00_PROJECT_CORE', '25_PRODUCTION_MANAGEMENT']
  },
  {
    dir: '25_PRODUCTION_MANAGEMENT',
    name: 'Production & Project Management',
    purpose: 'Maintain production roadmap, milestone schedules, risk register, known issues, technical debt, and glossary.',
    responsibilities: ['Milestone tracking', 'Risk assessment', 'Technical debt management'],
    systems: ['Roadmap Engine', 'Risk Register', 'Issue Tracker'],
    dependencies: ['00_PROJECT_CORE'],
    future: ['Automated milestone progress reporting', 'Dependency blocker matrix'],
    related: ['00_PROJECT_CORE', '26_RELEASE_LIVEOPS']
  },
  {
    dir: '26_RELEASE_LIVEOPS',
    name: 'Release & LiveOps Pipeline',
    purpose: 'Manage App Store / Play Store release checklists, CI/CD deployment pipelines, build targets, and post-launch roadmap.',
    responsibilities: ['Build pipeline management', 'App Store compliance', 'LiveOps deployment'],
    systems: ['CI/CD Pipeline', 'Store Release Package', 'LiveOps Manager'],
    dependencies: ['25_PRODUCTION_MANAGEMENT'],
    future: ['Automated store metadata deployment', 'Zero-downtime hotfix updates'],
    related: ['25_PRODUCTION_MANAGEMENT', '23_MONETIZATION']
  }
];

// 1. Create Directories and README.md files
modules.forEach(mod => {
  const dirPath = path.join(rootDir, mod.dir);
  fs.mkdirSync(dirPath, { recursive: true });

  const readmeContent = `# ${mod.name} Module

## Module Purpose
${mod.purpose}

## Responsibilities
${mod.responsibilities.map(r => `- ${r}`).join('\n')}

## Systems Included
${mod.systems.map(s => `- ${s}`).join('\n')}

## Dependencies
${mod.dependencies.length > 0 ? mod.dependencies.map(d => `- [${d}](../${d}/README.md)`).join('\n') : '- None'}

## Future Specifications
${mod.future.map(f => `- ${f}`).join('\n')}

## Related Modules
${mod.related.map(rm => `- [${rm}](../${rm}/README.md)`).join('\n')}
`;

  fs.writeFileSync(path.join(dirPath, 'README.md'), readmeContent, 'utf8');
});

// 2. Create 98_CANON Directory & Documents
const canonDir = path.join(rootDir, '98_CANON');
fs.mkdirSync(canonDir, { recursive: true });

const canonFiles = {
  'Game Identity.md': `# Game Identity

## Core Summary
FLOWSTATE is a luminous, physics-driven momentum runner where player skill and resonance directly transform a living 3D environment.

## Product Pillars
- **Luminous Minimalism**: Uncluttered visual aesthetics and sleek dark modes.
- **Physics-Driven Flow**: High-speed momentum and deterministic movement.
- **Living Eco-Resonance**: The world blooms and reacts dynamically as the player masters movement.
`,
  'Core Gameplay Laws.md': `# Core Gameplay Laws

## Non-Negotiable Mechanics
1. **Momentum Conservation**: High velocity expands FOV and unlocks resonance mechanics.
2. **Zero Pay-to-Win**: All performance is derived strictly from player input mastery.
3. **Living Environment Feedback**: Biome health and visual vibrancy reflect active player flow state ratio.
`,
  'Player Fantasy.md': `# Player Fantasy

## The Experience
The player experiences effortless control and frictionless momentum, gliding across glowing organic ribbon tracks while watching a muted living ecosystem ignite into vibrant light and vegetation under their influence.
`,
  'Visual Language.md': `# Visual Language

## Design Guidelines
- **Color Palette**: Dark background scrims (\`var(--flow-text-scrim)\`), glowing cyan energy accents, and dynamic organic vegetation hues.
- **Typography**: Sleek sans-serif fonts using strict CSS token hierarchy.
- **Atmosphere**: Volumetric bloom, glassmorphic HUD overlays, and clean lighting.
`,
  'Audio Identity.md': `# Audio Identity

## Dynamic Soundscapes
- **Resonance Stems**: Music stems layer seamlessly based on momentum and energy multiplier.
- **Spatial Audio**: 3D positioning for energy rings, wind effects, and track surface friction.
- **Tactile Haptics**: Micro-haptic triggers synchronized with jump landings and curve drifts.
`,
  'Emotional Journey.md': `# Emotional Journey

## Player Feeling
From initial calm focus to intense, exhilarating flow state mastery, where movement and environment synthesize into a pure state of harmony.
`
};

Object.entries(canonFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(canonDir, filename), content, 'utf8');
});

// 3. Create 99_PROJECT_MEMORY Directory & Documents
const memoryDir = path.join(rootDir, '99_PROJECT_MEMORY');
fs.mkdirSync(memoryDir, { recursive: true });

const memoryFiles = {
  'DECISION_LOG.md': `# Project Decision Log

| ID | Title | Status | Date | Summary |
|---|---|---|---|---|
| DEC-001 | GDOS Architecture Framework | Approved | 2026-07-23 | Adopt modular GDOS architecture for AI pair programming. |
| DEC-002 | UI Token Discipline | Approved | 2026-07-23 | Strictly enforce CSS token rules in tokens.css. |
| DEC-003 | HUD vs DevPanel Isolation | Approved | 2026-07-23 | Decouple player HUD from technical dev telemetry. |
`,
  'CONFIRMED_FEATURES.md': `# Confirmed Features

- Spherical Momentum Kinetics
- Ribbon Track Generation
- Living Eco-Resonance Engine
- Dynamic FOV Camera System
- Spatial Stem Audio System
`,
  'EXPERIMENTAL_FEATURES.md': `# Experimental Features

- Wind Drag Vectors
- Magnetic Ring Boosters
- Realtime Seasonal Biome Shifts
`,
  'REJECTED_IDEAS.md': `# Rejected Ideas

- Pay-to-Win Mechanics
- Cluttered On-Screen Telemetry Overlay on Player HUD
- Hardcoded Hex Color Strings in UI Component Code
`,
  'ARCHITECTURE_HISTORY.md': `# Architecture History

- **v1.0**: Prototype Canvas Setup & Basic Ribbon Physics.
- **v2.0**: Full GDOS AI-Native Operating System & Specification Pipeline.
`,
  'CHANGELOG.md': `# Master Changelog

## [1.0.0] - 2026-07-23
- Established FLOWSTATE_MASTER_GUIDE structure.
- Scaffolded 27 core domain modules.
- Created 98_CANON and 99_PROJECT_MEMORY frameworks.
`,
  'KNOWN_LIMITATIONS.md': `# Known Limitations

- WebGL2 canvas context fallback handling on legacy mobile GPUs.
- Mobile thermal throttling under prolonged high-particle rendering.
`,
  'OPEN_PROBLEMS.md': `# Open Problems

- Optimizing GPU instancing memory footprint for zero-drop 60 FPS mobile target.
- Deterministic cross-platform floating point physics sync for async replays.
`,
  'LESSONS_LEARNED.md': `# Lessons Learned

- AI agent pair programming requires explicit do-not-break rules and single source of truth decision logging to prevent context drift.
- Decoupling visual presentation layers from physics solvers guarantees zero regression during UI passes.
`
};

Object.entries(memoryFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(memoryDir, filename), content, 'utf8');
});

// 4. Create AGENT_PROMPTS Directory
const promptsDir = path.join(rootDir, 'AGENT_PROMPTS');
fs.mkdirSync(promptsDir, { recursive: true });
fs.writeFileSync(path.join(promptsDir, 'README.md'), `# AGENT_PROMPTS Directory

This directory contains executable work phase packages for Antigravity IDE and Codex.
`, 'utf8');

// 5. Create INDEX.md, DEPENDENCY_GRAPH.md, and ROADMAP.md
const indexContent = `# FLOWSTATE GDOS v1.0 — Master Index

Welcome to the **Game Development Operating System (GDOS)** for **FLOWSTATE**.

## Navigation Map

### Core & Foundation
- [00_PROJECT_CORE](00_PROJECT_CORE/README.md)
- [98_CANON](98_CANON/Game%20Identity.md)
- [99_PROJECT_MEMORY](99_PROJECT_MEMORY/DECISION_LOG.md)

### Gameplay & Physics
- [01_GAMEPLAY](01_GAMEPLAY/README.md)
- [02_PHYSICS](02_PHYSICS/README.md)
- [07_PLAYER_SPHERE](07_PLAYER_SPHERE/README.md)

### Track & World Generation
- [03_LEVEL_DESIGN](03_LEVEL_DESIGN/README.md)
- [08_TRACK_SYSTEM](08_TRACK_SYSTEM/README.md)
- [04_LIVING_WORLD_SIMULATION](04_LIVING_WORLD_SIMULATION/README.md)
- [05_ENVIRONMENT_RENDERING](05_ENVIRONMENT_RENDERING/README.md)
- [06_ART_DIRECTION](06_ART_DIRECTION/README.md)

### Progression, Economy & Perks
- [09_PROGRESSION](09_PROGRESSION/README.md)
- [10_PERKS](10_PERKS/README.md)
- [11_COSMETICS_ECONOMY](11_COSMETICS_ECONOMY/README.md)
- [14_BALANCE](14_BALANCE/README.md)
- [23_MONETIZATION](23_MONETIZATION/README.md)

### Audio, UI & Technical Engine
- [12_AUDIO_ENGINE](12_AUDIO_ENGINE/README.md)
- [13_UI_UX](13_UI_UX/README.md)
- [15_TECHNICAL_ENGINE](15_TECHNICAL_ENGINE/README.md)
- [16_SHADER_SYSTEM](16_SHADER_SYSTEM/README.md)
- [17_ASSET_PIPELINE](17_ASSET_PIPELINE/README.md)
- [18_OPTIMIZATION_LOD](18_OPTIMIZATION_LOD/README.md)

### Social, Backend, Analytics & Ops
- [19_SOCIAL_MULTIPLAYER](19_SOCIAL_MULTIPLAYER/README.md)
- [20_BACKEND_INFRASTRUCTURE](20_BACKEND_INFRASTRUCTURE/README.md)
- [21_SAVE_CLOUD_SYSTEM](21_SAVE_CLOUD_SYSTEM/README.md)
- [22_ANALYTICS_TELEMETRY](22_ANALYTICS_TELEMETRY/README.md)
- [24_TESTING_QA](24_TESTING_QA/README.md)
- [25_PRODUCTION_MANAGEMENT](25_PRODUCTION_MANAGEMENT/README.md)
- [26_RELEASE_LIVEOPS](26_RELEASE_LIVEOPS/README.md)
- [AGENT_PROMPTS](AGENT_PROMPTS/README.md)

---

## Architectural Systems Overview
- [DEPENDENCY_GRAPH.md](DEPENDENCY_GRAPH.md) — Module inter-dependencies & blocking relationships.
- [ROADMAP.md](ROADMAP.md) — Five-Milestone production execution roadmap.
`;

fs.writeFileSync(path.join(rootDir, 'INDEX.md'), indexContent, 'utf8');

const dependencyGraphContent = `# FLOWSTATE GDOS — Dependency Graph

| Module | Dependencies | Provides | Blocks |
|---|---|---|---|
| **00_PROJECT_CORE** | None | Architectural Rules, Do-Not-Break Boundaries | All Modules |
| **01_GAMEPLAY** | 02_PHYSICS, 07_PLAYER_SPHERE | Core Loop, Controls, Scoring | 09_PROGRESSION, 10_PERKS, 14_BALANCE |
| **02_PHYSICS** | 15_TECHNICAL_ENGINE | Kinetics, Surface Friction, Collisions | 01_GAMEPLAY, 08_TRACK_SYSTEM |
| **03_LEVEL_DESIGN** | 08_TRACK_SYSTEM, 02_PHYSICS | Track Generation, Level Seeds | 04_LIVING_WORLD_SIMULATION |
| **04_LIVING_WORLD_SIMULATION** | 01_GAMEPLAY | Resonance Eco-System, Weather Cycles | 05_ENVIRONMENT_RENDERING |
| **05_ENVIRONMENT_RENDERING** | 04_LIVING_WORLD_SIMULATION, 16_SHADER_SYSTEM | GPU Instancing, Terrain Splatting | 06_ART_DIRECTION, 18_OPTIMIZATION_LOD |
| **06_ART_DIRECTION** | None | Color Language, Visual Aesthetics | 05_ENVIRONMENT_RENDERING, 13_UI_UX |
| **07_PLAYER_SPHERE** | 02_PHYSICS, 06_ART_DIRECTION | Sphere Mesh, Trails, Skins | 01_GAMEPLAY, 11_COSMETICS_ECONOMY |
| **08_TRACK_SYSTEM** | 02_PHYSICS | Ribbon Architecture, Curvature Splines | 03_LEVEL_DESIGN |
| **09_PROGRESSION** | 01_GAMEPLAY | XP, Player Levels, Achievements | 10_PERKS, 11_COSMETICS_ECONOMY |
| **10_PERKS** | 09_PROGRESSION, 01_GAMEPLAY | Passive/Active Perks, Skill Trees | 14_BALANCE |
| **11_COSMETICS_ECONOMY** | 07_PLAYER_SPHERE, 09_PROGRESSION | Sphere Skins, Visual Themes | 23_MONETIZATION |
| **12_AUDIO_ENGINE** | 01_GAMEPLAY, 04_LIVING_WORLD_SIMULATION | Dynamic Stem Audio, Haptics | 13_UI_UX |
| **13_UI_UX** | 00_PROJECT_CORE, 06_ART_DIRECTION | HUD Scrims, DevPanel Telemetry | 01_GAMEPLAY |
| **14_BALANCE** | 01_GAMEPLAY, 09_PROGRESSION, 10_PERKS | Score Formulas, Difficulty Curves | 25_PRODUCTION_MANAGEMENT |
| **15_TECHNICAL_ENGINE** | None | Core Loop, Memory Pooling, Input Router | 02_PHYSICS, 16_SHADER_SYSTEM |
| **16_SHADER_SYSTEM** | 15_TECHNICAL_ENGINE | GLSL/HLSL Materials, Post-FX | 05_ENVIRONMENT_RENDERING |
| **17_ASSET_PIPELINE** | None | Asset Standards, Texture Streaming | 05_ENVIRONMENT_RENDERING, 18_OPTIMIZATION_LOD |
| **18_OPTIMIZATION_LOD** | 15_TECHNICAL_ENGINE, 16_SHADER_SYSTEM | Instancing, VRAM Budgets | 26_RELEASE_LIVEOPS |
| **19_SOCIAL_MULTIPLAYER** | 20_BACKEND_INFRASTRUCTURE | Leaderboards, Ghost Replays | 21_SAVE_CLOUD_SYSTEM |
| **20_BACKEND_INFRASTRUCTURE** | None | REST/WS APIs, Auth, Database | 19_SOCIAL_MULTIPLAYER, 21_SAVE_CLOUD_SYSTEM |
| **21_SAVE_CLOUD_SYSTEM** | 20_BACKEND_INFRASTRUCTURE | State Serialization, Cloud Sync | 09_PROGRESSION |
| **22_ANALYTICS_TELEMETRY** | 20_BACKEND_INFRASTRUCTURE | Performance Logging, Crash Reports | 25_PRODUCTION_MANAGEMENT |
| **23_MONETIZATION** | 11_COSMETICS_ECONOMY, 20_BACKEND_INFRASTRUCTURE | Cosmetic Store, IAP Validation | 26_RELEASE_LIVEOPS |
| **24_TESTING_QA** | 00_PROJECT_CORE | Unit Tests, Physics Determinism | 25_PRODUCTION_MANAGEMENT |
| **25_PRODUCTION_MANAGEMENT** | 00_PROJECT_CORE | Roadmap, Risk Register, Debt | 26_RELEASE_LIVEOPS |
| **26_RELEASE_LIVEOPS** | 25_PRODUCTION_MANAGEMENT | CI/CD, App Store / Play Store | Post-Launch LiveOps |
`;

fs.writeFileSync(path.join(rootDir, 'DEPENDENCY_GRAPH.md'), dependencyGraphContent, 'utf8');

const roadmapContent = `# FLOWSTATE Production Roadmap

## Milestone 1: Engine Foundation & Core Physics
- Modules: 00_PROJECT_CORE, 02_PHYSICS, 07_PLAYER_SPHERE, 08_TRACK_SYSTEM, 13_UI_UX, 15_TECHNICAL_ENGINE
- Target: Establish zero-leak engine loop, sphere momentum kinetics, dynamic camera, and HUD/DevPanel isolation.

## Milestone 2: Core Gameplay & Living World Simulation
- Modules: 01_GAMEPLAY, 03_LEVEL_DESIGN, 04_LIVING_WORLD_SIMULATION, 05_ENVIRONMENT_RENDERING, 06_ART_DIRECTION, 16_SHADER_SYSTEM
- Target: Implement eco-growth resonance state machine, weather cycles, day/night transitions, and terrain splat rendering.

## Milestone 3: Content, Biomes, Cosmetics & Progression
- Modules: 09_PROGRESSION, 10_PERKS, 11_COSMETICS_ECONOMY, 12_AUDIO_ENGINE, 14_BALANCE, 17_ASSET_PIPELINE
- Target: Build XP/level curves, perk trees, cosmetics catalog, spatial stem audio mixing, and balance matrix.

## Milestone 4: Polish, Mobile Optimization & Balancing
- Modules: 18_OPTIMIZATION_LOD, 22_ANALYTICS_TELEMETRY, 24_TESTING_QA, 25_PRODUCTION_MANAGEMENT
- Target: Optimize draw calls and VRAM for 60 FPS target on mobile, verify physics determinism, and complete accessibility suite.

## Milestone 5: Backend, Cloud Save, Store Release & LiveOps
- Modules: 19_SOCIAL_MULTIPLAYER, 20_BACKEND_INFRASTRUCTURE, 21_SAVE_CLOUD_SYSTEM, 23_MONETIZATION, 26_RELEASE_LIVEOPS
- Target: Complete cloud save synchronization, leaderboards, IAP validation, store release build packages, and CI/CD automation.
`;

fs.writeFileSync(path.join(rootDir, 'ROADMAP.md'), roadmapContent, 'utf8');

console.log('GDOS v1.0 Foundation Setup Completed Successfully!');
