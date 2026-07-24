const fs = require('fs');
const path = require('path');

const gdosDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');
const canonDir = path.join(gdosDir, '98_CANON');

fs.mkdirSync(canonDir, { recursive: true });

const universalYaml = (title, phase = "00.03") => `---
Title: "${title}"
Module: "98_CANON"
Status: Completed
Priority: Critical
Milestone: 1
Phase: "${phase}"
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
`;

const canonFiles = {
  'Game Identity.md': `${universalYaml('Game Identity')}
# Game Identity Specification

## Vision
FLOWSTATE is an AI-native, luminous physics-driven momentum runner that transforms player movement and resonance into a living, evolving 3D world. It synthesizes speed, spatial mastery, and environmental growth into a state of effortless flow.

## Mission
To deliver a mobile and desktop gaming experience defined by high-fidelity mechanics, luminous minimalism, zero friction, and ethical player progression.

## Core Promise
Every second played feels fluid, responsive, and aesthetically transcendent. The better you play, the more alive, resonant, and beautiful the world becomes.

## Genre & Hybrid Identity
- **Primary Genre**: Physics-Driven Kinetic Runner
- **Sub-Genres**: Environmental Simulation, Flow-State Arcade, Rhythm-Resonance Experience

## Design Pillars
1. **Kinetic Mastery**: Pure physics-driven movement with momentum conservation and skill-based trajectories.
2. **Luminous Eco-Resonance**: Reactive environment where speed and high flow ratio trigger blooming foliage, dynamic lighting, and weather harmonizations.
3. **Luminous Minimalism**: Clean, uncluttered UI featuring dark scrims (\`var(--flow-text-scrim)\`), glassmorphism, and high-readability typography.
4. **Ethical Player Agency**: Zero pay-to-win mechanics, non-intrusive monetization (purely cosmetic), and respect for player time.

## Emotional Goals
- Exhilaration through seamless velocity.
- Deep focus and zen-like flow state.
- Awe as a muted world erupts into vibrant life.

## Target Audience & Motivations
- **Kinetic Gamers**: Seeking high skill ceiling, physics precision, and leaderboard mastery.
- **Zen & Flow Seekers**: Seeking immersive audiovisual harmony and stress-reducing momentum.
- **Aesthetic Explorers**: Drawn to visual polish, customization, and environmental storytelling.

## Competitive Positioning
Unlike traditional infinite runners built on rigid grid lanes or coin-grinding monetization, FLOWSTATE provides continuous spline-based ribbon tracks, physics-driven momentum, and a living ecosystem that evolves dynamically.

## What FLOWSTATE Is
- A physics-first kinetic flow experience.
- A visual and auditory masterpiece of luminous minimalism.
- A skill-indexed game where mastery transforms the environment.
- An ethically designed product respecting user time and focus.

## What FLOWSTATE Is Not
- NOT a pay-to-win or stat-buying game.
- NOT a cluttered, ad-riddled arcade title.
- NOT a rigid lane-runner with artificial invisible walls.
- NOT an aggressive dark-pattern retention trap.

## Related Canon Documents
- [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md)
- [Player Fantasy.md](Player%20Fantasy.md)
- [Anti-Patterns.md](Anti-Patterns.md)
`,

  'Core Gameplay Laws.md': `${universalYaml('Core Gameplay Laws')}
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
14. **Tokenized UI Discipline**: All visual elements must derive colors and metrics from \`tokens.css\`.
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
27. **Preservation of Game Memory**: All major decisions must be recorded in \`99_PROJECT_MEMORY/DECISION_LOG.md\`.

## Related Canon Documents
- [Game Identity.md](Game%20Identity.md)
- [Design Principles.md](Design%20Principles.md)
`,

  'Player Fantasy.md': `${universalYaml('Player Fantasy')}
# Player Fantasy Specification

## Who the Player Becomes
The player embodies the **Conductor of Kinetic Resonance**—a swift, glowing entity gliding across luminous ribbon tracks suspended over an ancient, sleeping world. The player is not merely navigating a course; they are awakening a living ecosystem with their speed and grace.

## How the Player Feels
- **Fluid & Weightless**: Gliding across splines with frictionless momentum.
- **Empowered & Focused**: Achieving a state of hyper-focus where time feels slower and movement becomes instinctive.
- **Aesthetic Creator**: Feeling directly responsible for igniting dark valleys into vibrant, blooming visual sanctuaries.

## Why They Return
- **The Chase of Pure Flow**: Reaching the elusive flow state where physics and music blend into pure harmony.
- **Mastery Satisfaction**: Shaving milliseconds off personal bests and ascending leaderboard ranks.
- **Cosmetic Expression**: Showcasing rare, luminous sphere materials and custom kinetic trail signatures.

## Emotional Progression & Journey
1. **Discovery Stage**: Intrigued by sleek aesthetics and smooth momentum mechanics.
2. **Mastery Stage**: Learning spline banking, air tilt adjustments, and perfect ring chaining.
3. **Transcendence Stage**: Operating purely in flow state, effortlessly transforming world biomes while maintaining maximum velocity.

## Related Canon Documents
- [Emotional Journey.md](Emotional%20Journey.md)
- [Visual Language.md](Visual%20Language.md)
`,

  'Emotional Journey.md': `${universalYaml('Emotional Journey')}
# Emotional Journey & Player Arc

## Player Emotional Arc Mapping

### First Minute
- **Emotion**: Curiosity & Serenity.
- **Experience**: Soft atmospheric audio, clean luminous HUD, smooth acceleration down an open ribbon spline.

### First Session (10-15 Minutes)
- **Emotion**: Exhilaration & Discovery.
- **Experience**: First speed threshold reached; dynamic FOV expands, energy rings ignite, grass and flowers bloom around the track.

### First Hour
- **Emotion**: Focus & Challenge.
- **Experience**: Mastering steep spline curves, timing jumps over track gaps, experimenting with initial passive perks.

### First Week
- **Emotion**: Competence & Pride.
- **Experience**: Unlocking custom sphere materials, achieving top 10% leaderboard runs, mastering biome transitions.

### First Month & Beyond
- **Emotion**: Mastery & Transcendence.
- **Experience**: Seamless flow state runs, zero-error time attacks, participating in seasonal leaderboard events.

## Emotional State Machine Diagram
\`\`\`mermaid
stateDiagram-v2
    [*] --> Serenity: Launch Run
    Serenity --> Focus: Acceleration
    Focus --> Exhilaration: Flow State Threshold
    Exhilaration --> Transcendence: Perfect Run Combo
    Focus --> Determination: Track Collision / Reset
    Determination --> Serenity: Instant Restart
\`\`\`

## Related Canon Documents
- [Player Fantasy.md](Player%20Fantasy.md)
- [Design Vocabulary.md](Design%20Vocabulary.md)
`,

  'Visual Language.md': `${universalYaml('Visual Language')}
# Visual Language Specification

## Lighting & Color Philosophy
- **Base Scrims**: Dark, rich background tones (\`var(--flow-text-scrim)\`) to ensure 3D canvas legibility.
- **Resonance Accents**: Cyan (\`#00f0ff\`), luminous teal, vibrant magenta, and radiant gold for high-energy states.
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
- Smooth positional lag ($k_{\\text{damp}} = 0.15$) to convey kinetic weight without causing motion sickness.

## Related Canon Documents
- [Audio Identity.md](Audio%20Identity.md)
- [Design Vocabulary.md](Design%20Vocabulary.md)
`,

  'Audio Identity.md': `${universalYaml('Audio Identity')}
# Audio Identity & Soundscape Specification

## Musical Philosophy
- **Dynamic Stem Mixing**: Ambient synthesizer stems that dynamically unmute and layer based on player velocity and flow state multiplier.
- **Rhythmic Harmony**: Sound effects (energy ring passes, jump launches, surface drifts) are key-tuned to match the active background musical scale.

## Audio Layers & Stems
1. **Bass & Sub-Bass**: Unlocks at medium velocity; provides weight and kinetic rhythm.
2. **Lead Melody & Synths**: Unlocks during high flow state ratios (> 80%).
3. **Ambient Nature Stems**: Wind, dynamic rain, and wildlife chime layers reacting to world eco-state.

## Silence & Micro-Haptics
- **Tactile Silence**: Pauses in music during high-altitude jumps to create weightlessness tension.
- **Micro-Haptics**: Subtle, crisp haptic pulses synchronized with ring passes, spline banking, and soft landings.

## Related Canon Documents
- [Visual Language.md](Visual%20Language.md)
- [Emotional Journey.md](Emotional%20Journey.md)
`,

  'Design Vocabulary.md': `${universalYaml('Design Vocabulary')}
# Shared Design Vocabulary

Below are the canonical definitions for all design, technical, and aesthetic terms used across FLOWSTATE GDOS.

- **Resonance**: The state where player velocity, input accuracy, and track alignment harmonize to ignite the living ecosystem.
- **Harmony**: The seamless synchronization of dynamic music stems, haptics, and particle visuals with player movement.
- **Flow**: The psychological and mechanical state of frictionless velocity and hyper-focused control.
- **Chaos**: High-friction or off-track states where energy dissipates and environmental bloom recedes.
- **Bloom**: The dynamic sprouting of GPU instanced foliage, flowers, and ambient light around the ribbon track.
- **Living World**: The reactive environmental simulation engine encompassing biomes, weather, day/night cycles, and wildlife.
- **Pulse**: The rhythmic energy wave emitted by the player sphere upon passing through energy rings or achieving combo milestones.
- **Momentum**: The scalar physical velocity preserved across spline curves, jumps, and surface transitions.
- **Awakening**: The visual transition of a dark, serene biome into a vibrant, glowing ecosystem during high-performance runs.
- **Drift**: Controlled trajectory slide along banked spline curves maintaining high momentum without losing track contact.
- **Energy**: The resource accumulated via ring passes and clean lines, driving perk abilities and resonance multipliers.

## Related Canon Documents
- [Game Identity.md](Game%20Identity.md)
- [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md)
`,

  'Anti-Patterns.md': `${universalYaml('Anti-Patterns')}
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
13. **Hardcoded CSS Colors**: Writing raw hex strings in TypeScript files instead of using \`tokens.css\`.
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
27. **Silent Exception Swallowing**: Wrapping broken API calls in empty \`catch {}\` blocks.
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
41. **Un-Tracked Architectural Drift**: Making major structural changes without updating \`DECISION_LOG.md\`.
42. **Superficial Bug Fixes**: Masking root-cause physics bugs with band-aid fallback values.

## Related Canon Documents
- [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md)
- [Design Principles.md](Design%20Principles.md)
`,

  'Design Principles.md': `${universalYaml('Design Principles')}
# Practical Design Principles

Every proposed feature, mechanic, and architectural change must be evaluated against these **6 Practical Design Principles**:

1. **The Flow Test**: Does this feature increase or preserve player kinetic flow? If it creates unnecessary friction or cognitive overload, simplify or reject it.
2. **The Luminous Minimalism Rule**: Does this visual element add clarity or noise? If it clutters the viewport without aiding gameplay readability, remove it.
3. **The Eco-Resonance Principle**: Does this mechanic reward good play with environmental feedback? Ensure player mastery directly enriches the living world.
4. **The Zero-Tech-Debt Standard**: Does this implementation maintain decoupled tier separation (Physics vs Simulation vs UI)? Never sacrifice architecture for a quick prototype.
5. **The Mobile-First Ergonomic Rule**: Is this control layout effortless on touch displays? Test touch gestures within natural thumb arcs.
6. **The Ethical Player Trust Principle**: Does this progression system respect the player? Avoid predatory monetization, energy timers, or dark patterns.

## Related Canon Documents
- [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md)
- [Player Experience Checklist.md](Player%20Experience%20Checklist.md)
`,

  'Player Experience Checklist.md': `${universalYaml('Player Experience Checklist')}
# Mandatory Player Experience Checklist

Before marking any feature, phase, or build ready for release, evaluate these **7 Mandatory Questions**:

- [ ] **1. Does this improve flow?** (Smooth momentum, zero input stutter, instant restarts)
- [ ] **2. Does this improve mastery?** (Clear physics feedback, deterministic collision response, rewarding skill progression)
- [ ] **3. Does this improve beauty?** (Harmonious lighting, vibrant eco-resonance bloom, crisp luminous minimalism)
- [ ] **4. Does this reduce friction?** (Sub-500ms restarts, clean UI navigation, instant load times)
- [ ] **5. Does this maintain readability?** (Clear track hazard boundaries, tokenized text scrims, zero particle noise clutter)
- [ ] **6. Does this respect mobile players?** (60 FPS performance, low battery draw, safe-area bounds respected, natural touch ergonomics)
- [ ] **7. Does this fit FLOWSTATE?** (Strictly aligned with [Game Identity.md](Game%20Identity.md) and [Core Gameplay Laws.md](Core%20Gameplay%20Laws.md))

## Related Canon Documents
- [Design Principles.md](Design%20Principles.md)
- [Anti-Patterns.md](Anti-Patterns.md)
`
};

Object.entries(canonFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(canonDir, filename), content, 'utf8');
});

// Update INDEX.md to reference all 10 Canon documents
const indexPath = path.join(gdosDir, 'INDEX.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const canonIndexBlock = `### Canon & Immutable Design Bible (\`98_CANON/\`)
- [Game Identity.md](98_CANON/Game%20Identity.md) — Product vision, pillars, and core identity.
- [Core Gameplay Laws.md](98_CANON/Core%20Gameplay%20Laws.md) — 27 immutable gameplay laws.
- [Player Fantasy.md](98_CANON/Player%20Fantasy.md) — Player role, feelings, and journey.
- [Emotional Journey.md](98_CANON/Emotional%20Journey.md) — Player emotional arc & state diagrams.
- [Visual Language.md](98_CANON/Visual%20Language.md) — Lighting, color, materials, and UI rules.
- [Audio Identity.md](98_CANON/Audio%20Identity.md) — Adaptive soundtrack & spatial audio specs.
- [Design Vocabulary.md](98_CANON/Design%20Vocabulary.md) — Canonical design terms & definitions.
- [Anti-Patterns.md](98_CANON/Anti-Patterns.md) — 42 prohibited design practices.
- [Design Principles.md](98_CANON/Design%20Principles.md) — Practical feature design principles.
- [Player Experience Checklist.md](98_CANON/Player%20Experience%20Checklist.md) — Mandatory 7-question validation checklist.
`;

if (indexContent.includes('[98_CANON](98_CANON/Game%20Identity.md)')) {
  indexContent = indexContent.replace('- [98_CANON](98_CANON/Game%20Identity.md)', canonIndexBlock);
} else if (!indexContent.includes('### Canon & Immutable Design Bible')) {
  indexContent += '\n' + canonIndexBlock;
}

fs.writeFileSync(indexPath, indexContent, 'utf8');

// Update ROADMAP.md to track Canon completeness
const roadmapPath = path.join(gdosDir, 'ROADMAP.md');
let roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

if (!roadmapContent.includes('## Canon Completeness Tracking')) {
  roadmapContent += `
---

## Canon Completeness Tracking (\`98_CANON/\`)

| Canon Document | Status | Completeness | Last Updated |
|---|---|---|---|
| **Game Identity.md** | Completed | 100% | 2026-07-23 |
| **Core Gameplay Laws.md** | Completed | 100% (27 Laws) | 2026-07-23 |
| **Player Fantasy.md** | Completed | 100% | 2026-07-23 |
| **Emotional Journey.md** | Completed | 100% | 2026-07-23 |
| **Visual Language.md** | Completed | 100% | 2026-07-23 |
| **Audio Identity.md** | Completed | 100% | 2026-07-23 |
| **Design Vocabulary.md** | Completed | 100% | 2026-07-23 |
| **Anti-Patterns.md** | Completed | 100% (42 Anti-Patterns) | 2026-07-23 |
| **Design Principles.md** | Completed | 100% | 2026-07-23 |
| **Player Experience Checklist.md** | Completed | 100% | 2026-07-23 |
`;
  fs.writeFileSync(roadmapPath, roadmapContent, 'utf8');
}

console.log('Phase 00.03 FLOWSTATE Canon scaffolded successfully!');
