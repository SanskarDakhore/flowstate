const fs = require('fs');
const path = require('path');

const gdosDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');
const memoryDir = path.join(gdosDir, '99_PROJECT_MEMORY');

fs.mkdirSync(memoryDir, { recursive: true });

const universalYaml = (title, phase = "00.04") => `---
Title: "${title}"
Module: "99_PROJECT_MEMORY"
Status: Active
Priority: Critical
Milestone: 1
Phase: "${phase}"
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
`;

const memoryFiles = {
  'DECISION_LOG.md': `${universalYaml('Project Decision Log')}
# Project Decision Log

This log is the single source of truth for architectural, design, and technical decisions in FLOWSTATE.

---

### DEC-001: GDOS Architecture Framework
- **Decision ID**: DEC-001
- **Title**: Adopt Game Development Operating System (GDOS) v2.0
- **Date**: 2026-07-23
- **Author**: Antigravity IDE / Codex & User
- **Problem**: Large AI-assisted projects drift over time when guided by monolithic prompts.
- **Decision**: Scaffold \`FLOWSTATE_MASTER_GUIDE/\` containing 27 domain modules, templates, canon rules, project memory, and 100 modular phase packages.
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
- **Decision**: All UI components must strictly dereference CSS variables from \`tokens.css\` and use \`var(--flow-text-scrim)\` for text backgrounds over 3D canvases.
- **Alternatives Considered**: Direct inline styles; arbitrary tailwind classes.
- **Reasoning**: Enforces Luminous Minimalism and maintains contrast hierarchy across dynamic camera angles and biomes.
- **Consequences**: Direct hex values or un-tokenized font stacks in TS UI files are prohibited.
- **Affected Modules**: \`13_UI_UX\`, \`06_ART_DIRECTION\`
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
- **Decision**: Keep \`PlayerHud\` unobtrusive ("Luminous Minimalism") and isolate technical debug metrics (FPS, raw position vectors, input intents) inside \`DevPanel\`.
- **Alternatives Considered**: Single unified UI overlay with toggle flags.
- **Reasoning**: Maintains player flow state while providing full engineering telemetry.
- **Consequences**: Telemetry data is delivered via read-only event buses.
- **Affected Modules**: \`13_UI_UX\`, \`00_PROJECT_CORE\`
- **Affected Phases**: Phase 01, Phase 13
- **Related ADRs**: [ARCHITECTURAL_DECISIONS.md](ARCHITECTURAL_DECISIONS.md#adr-003)
- **Status**: Approved
`,

  'ARCHITECTURE_HISTORY.md': `${universalYaml('Architecture History')}
# Project Architecture History

## 1. Prototype Era (v0.1.0 - Early 2026)
- Initial Babylon.js 3D canvas rendering setup.
- Basic ball controller with direct keyboard event listeners.
- Simple ribbon track spline generation prototype.
- Initial HUD components with inline style rules.

## 2. Foundation Era (v1.0.0 - July 2026)
- Monorepo workspace structure established (\`frontend/\`, \`middleware/\`, \`backend/\`, \`shared/\`).
- Introduction of CSS design tokens in \`frontend/src/ui/styles/tokens.css\`.
- Separation of \`PlayerHud\` and \`DevPanel\` telemetry drawer.
- Creation of \`FLOWSTATE_MASTER_GUIDE/\` GDOS architecture.

## 3. Engine Evolution (v2.0.0 Target)
- Implementation of zero-allocation physics kinetics solver.
- Deterministic floating-point spline curvature mathematics.
- Object pooling engine for procedural ribbon segments and particles.

## 4. Rendering Evolution (v2.0.0 Target)
- Terrain System 2.0 with GPU-optimized splat materials.
- Instanced foliage renderer for dynamic grass and flower blooming.
- Volumetric atmosphere and dynamic day/night light cycle.

## 5. Gameplay Evolution (v2.0.0 Target)
- Eco-resonance growth state machine linking flow state ratio to biome health.
- Spatial stem audio mixing engine.
- Active and passive perk upgrade tree matrix.

## 6. Future Production Milestones
- Asynchronous ghost replay engine.
- App Store / Play Store release build packaging.
- LiveOps seasonal biome rotation infrastructure.
`,

  'CHANGELOG.md': `${universalYaml('Master Changelog')}
# Master Changelog

All notable changes to the FLOWSTATE project will be documented in this file using semantic versioning.

## [1.0.0] - 2026-07-23
### Added
- **GDOS Core**: Created \`FLOWSTATE_MASTER_GUIDE/\` with 27 top-level domain modules.
- **Canon Bible**: Created \`98_CANON/\` with 10 documents including 27 Core Gameplay Laws and 42 Anti-Patterns.
- **Templates**: Established \`TEMPLATES/\` with 10 standardized specification templates.
- **Memory System**: Expanded \`99_PROJECT_MEMORY/\` with 18 tracking registers and \`MEMORY_PROTOCOL.md\`.
- **TypeScript Health**: Fixed type errors in \`input-router.ts\` and \`prototype-metrics.ts\`, achieving 0-error \`npm run typecheck\` across all monorepo workspaces.

### Documentation
- Scaffolded \`INDEX.md\`, \`DEPENDENCY_GRAPH.md\`, and \`ROADMAP.md\`.
`,

  'CONFIRMED_FEATURES.md': `${universalYaml('Confirmed Features')}
# Confirmed Features Register

### FEAT-001: Spherical Kinetic Momentum Engine
- **Description**: Physics-driven momentum system where velocity conservation unlocks dynamic camera FOV and energy resonance multipliers.
- **Current Status**: Active Prototype
- **Dependencies**: \`02_PHYSICS\`, \`15_TECHNICAL_ENGINE\`
- **Implementation Phase**: Phase 02
- **Acceptance Criteria**: Smooth momentum scaling, zero physics jitter, stable 60 FPS.
- **Future Extensions**: Dynamic atmospheric drag vectors.

---

### FEAT-002: Luminous Ribbon Track Spline Architecture
- **Description**: Procedurally generated organic tracks with smooth curve banking, slope transitions, and collision boundaries.
- **Current Status**: Active Prototype
- **Dependencies**: \`08_TRACK_SYSTEM\`, \`03_LEVEL_DESIGN\`
- **Implementation Phase**: Phase 04
- **Acceptance Criteria**: Zero mesh gaps between track segments, smooth spline banking angle interpolation.
- **Future Extensions**: Destructible track ribbon segments.

---

### FEAT-003: Living Eco-Resonance Engine
- **Description**: Dynamic environment simulation where high player flow state ratio ignites muted landscapes into blooming foliage and vibrant light transitions.
- **Current Status**: Design Specification Completed
- **Dependencies**: \`04_LIVING_WORLD_SIMULATION\`, \`05_ENVIRONMENT_RENDERING\`
- **Implementation Phase**: Phase 21
- **Acceptance Criteria**: Seamless GPU foliage spawning around track, smooth light temperature interpolation.
- **Future Extensions**: Seasonal biome transitions during single runs.
`,

  'EXPERIMENTAL_FEATURES.md': `${universalYaml('Experimental Features')}
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
- **Success Criteria**: Subtle pull effect ($< 1.5 \\text{ m/s}^2$) feels satisfying and fluid.
- **Failure Criteria**: Magnetism feels like artificial auto-steering.
- **Exit Conditions**: Reject if magnetism overrides manual player steering intent.
- **Decision Date**: Scheduled for Milestone 2 evaluation.
`,

  'REJECTED_IDEAS.md': `${universalYaml('Rejected Ideas')}
# Rejected Ideas Register

### REJ-001: Pay-to-Win Speed Boost Purchases
- **Idea**: Selling consumable speed boosts or collision shields for real money.
- **Reason for Rejection**: Violates Core Gameplay Law #5 ("Cosmetics Never Provide Gameplay Power") and Anti-Pattern #1.
- **Lessons Learned**: Gameplay integrity and player trust are non-negotiable core pillars.
- **Reconsideration**: NEVER.

---

### REJ-002: Monolithic Telemetry Overlay on Player HUD
- **Idea**: Rendering FPS counters, velocity vectors, and input graphs directly over the player sphere.
- **Reason for Rejection**: Violates Core Gameplay Law #10, Anti-Pattern #2, and DEC-003. Clutters player view and destroys flow state immersion.
- **Lessons Learned**: Technical metrics belong exclusively in \`DevPanel\`.
- **Reconsideration**: NEVER for Player HUD.

---

### REJ-003: Hardcoded CSS Hex Colors in TypeScript UI Classes
- **Idea**: Writing inline color strings like \`#00ffff\` inside TS component files.
- **Reason for Rejection**: Violates DEC-002 and Anti-Pattern #13. Causes visual drift and breaks dark mode theme consistency.
- **Lessons Learned**: All visual tokens must derive from \`tokens.css\`.
- **Reconsideration**: NEVER.
`,

  'KNOWN_LIMITATIONS.md': `${universalYaml('Known Limitations')}
# Known Engine & System Limitations

## 1. Performance & Hardware Limitations
- **Mobile Thermal Throttling**: Extended play sessions (> 25 mins) on Tier 1 mobile GPUs trigger thermal throttling if particle counts exceed 5,000.
- **WebGL2 Context Restoration**: Canvas context loss on mobile backgrounding requires full mesh re-binding.

## 2. Rendering Limitations
- **Shadow Map Resolution**: Dynamic shadow maps are limited to 1024x1024 on mobile targets to preserve 60 FPS budget.

## 3. Physics Limitations
- **Single-Threaded Kinetics**: Physics calculations currently run on the main WebGL looper thread.

## 4. Tool & Workflow Limitations
- **Manual Spec Verification**: Phase prompt packages require explicit manual command invocation for verification.

## 5. Production Limitations
- **Monorepo Build Times**: Full monorepo typecheck requires ~3.5 seconds.
`,

  'OPEN_PROBLEMS.md': `${universalYaml('Open Problems')}
# Open Engineering & Design Problems

### PRB-001: Zero-Allocation GPU Instancing Memory Footprint
- **Description**: Instanced foliage rendering must achieve 0-byte memory allocation per frame while dynamically spawning flowers around moving sphere position.
- **Priority**: High
- **Dependencies**: \`05_ENVIRONMENT_RENDERING\`, \`18_OPTIMIZATION_LOD\`
- **Possible Solutions**: Reusable ring buffer for instance transformation matrices; compute shader matrix updates.
- **Assigned Milestone**: Milestone 2 (Phase 24)

---

### PRB-002: Deterministic Cross-Platform Replay Floating Point Sync
- **Description**: Asynchronous ghost replays must produce exact trajectory matches across x86 and ARM float implementations.
- **Priority**: High
- **Dependencies**: \`02_PHYSICS\`, \`19_SOCIAL_MULTIPLAYER\`
- **Possible Solutions**: Fixed-point math solver for ghost recordings; trajectory waypoint quantization.
- **Assigned Milestone**: Milestone 5 (Phase 83)
`,

  'LESSONS_LEARNED.md': `${universalYaml('Lessons Learned')}
# Lessons Learned Register

### LRN-001: AI Pair Programming Requires Strict Memory Protocols
- **Phase**: Phase 00.01 - Phase 00.04
- **What Worked**: Decoupling tasks into machine-executable phase packages with explicit read-first dependencies and Do-Not-Break rules.
- **What Failed**: Relying on single massive prompt instructions led to context drift and silent architectural regressions.
- **Unexpected Discoveries**: AI coding agents perform exponentially better when given explicit 10-Point AI Quality Gate checklists and pre-file inspection lists.
- **Recommended Practices**: Mandatory execution of [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) at the start and end of every development phase.

---

### LRN-002: Decoupled UI & Read-Only Telemetry Contracts Prevent Code Churn
- **Phase**: Phase 01
- **What Worked**: Forcing UI screen controllers to consume read-only telemetry events prevented UI visual passes from mutating movement physics.
- **What Failed**: Direct property assignments on shared intent objects caused TypeScript \`TS2540\` read-only compilation errors.
- **Unexpected Discoveries**: Using internal mutable helper types (\`Mutable<T>\`) cleanly isolates internal state modifications from public read-only interfaces.
- **Recommended Practices**: Always export read-only public contracts for state objects.
`,

  'ARCHITECTURAL_DECISIONS.md': `${universalYaml('Architectural Decisions')}
# Architecture Decision Records (ADRs)

### ADR-001: Game Development Operating System (GDOS) Framework
- **Status**: Approved
- **Context**: Need a scalable methodology to guide AI-assisted coding across 100 development phases without context degradation.
- **Decision**: Establish \`FLOWSTATE_MASTER_GUIDE/\` containing 27 modules, standardized templates, immutable canon, project memory, and self-contained phase packages.
- **Consequences**: Every phase must follow GDOS specs and satisfy 10-Point Quality Gates.

### ADR-002: CSS Design Token Discipline (\`tokens.css\`)
- **Status**: Approved
- **Context**: Need visual harmony and dark mode support across WebGL canvas UI overlays.
- **Decision**: Prohibit raw hex color values and arbitrary font stacks in TS UI components. Force usage of \`tokens.css\` variables.
- **Consequences**: Theme consistency is guaranteed across all screens.

### ADR-003: Player HUD and DevPanel Architecture Decoupling
- **Status**: Approved
- **Context**: Telemetry metrics (FPS, raw vectors) ruin player immersion if rendered on the player HUD.
- **Decision**: Keep \`PlayerHud\` luminous and minimal; isolate dev debug metrics inside \`DevPanel\`.
- **Consequences**: Pristine player presentation backed by full engineering telemetry.
`,

  'DESIGN_RATIONALE.md': `${universalYaml('Design Rationale')}
# Deep Design Rationale

## Why Kinetic Momentum Drives the World
In traditional infinite runners, speed is merely a hazard multiplier. In FLOWSTATE, speed is a creative force. The rationale behind linking momentum to environmental blooming (\`Eco-Resonance\`) is to turn high-speed gameplay into a rewarding aesthetic transformation rather than just a stress test.

## Why Dark Scrims Are Mandatory
3D WebGL scenes feature dynamic lighting, vibrant particle VFX, and shifting skyboxes. Rendering plain text over fluctuating brightness causes cognitive fatigue and eye strain. Dark background scrims (\`var(--flow-text-scrim)\`) guarantee constant high-contrast legibility ($> 7:1$ ratio) regardless of 3D canvas state.
`,

  'IMPLEMENTATION_PATTERNS.md': `${universalYaml('Implementation Patterns')}
# Established Implementation Patterns

## Pattern 1: Read-Only Event Bus Dispatch
\`\`\`typescript
public dispatchTelemetry(state: Readonly<PlayerState>): void {
  this.eventBus.emit('telemetry:update', Object.freeze({ ...state }));
}
\`\`\`

## Pattern 2: 0-Byte Object Allocation Loop
\`\`\`typescript
private static readonly TEMP_VEC = new Vector3();

public updatePosition(target: Vector3): void {
  Vector3.CopyToRef(target, PhysicsEngine.TEMP_VEC);
}
\`\`\`
`,

  'CODING_PATTERNS.md': `${universalYaml('Coding Patterns')}
# Coding Conventions & Standards

1. **TypeScript Strictness**: Zero \`any\` types permitted. All functions must declare explicit parameter and return types.
2. **Immutability by Default**: Mark all interface fields \`readonly\` unless internal mutation is explicitly required.
3. **CSS Variable Access**: Access colors via \`getComputedStyle(document.documentElement).getPropertyValue('--flow-cyan-400')\` or CSS class bindings.
4. **Error Handling**: Never catch and swallow exceptions silently. Log structured errors to telemetry.
`,

  'AI_AGENT_NOTES.md': `${universalYaml('AI Agent Execution Notes')}
# AI Agent Pair Programming Notes

- **Primary Persona**: Antigravity IDE / Codex pair programming assistant.
- **Operating Instructions**:
  1. ALWAYS read [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) before writing code.
  2. ALWAYS inspect \`FLOWSTATE_MASTER_GUIDE/00_PROJECT_CORE/Do_Not_Break_Rules.md\` to prevent protected file mutations.
  3. ALWAYS verify compilation with \`npm run typecheck\` before declaring a phase complete.
  4. NEVER import core physics solvers into presentation UI components.
`,

  'COMMON_FAILURES.md': `${universalYaml('Common Failures & Pitfalls')}
# Common Failures & Prevention Strategies

| Failure Mode | Root Cause | Preventative Rule |
|---|---|---|
| **TS2540 Readonly Error** | Attempting to mutate \`readonly\` interface properties directly | Use internal \`Mutable<T>\` helper or construct sanitized copies |
| **FPS Drop on Mobile** | Allocating new objects inside WebGL frame render loop | Enforce static object pooling pattern |
| **Illegible UI Text** | Omitting dark scrim background over bright WebGL background | Enforce \`var(--flow-text-scrim)\` on all HUD text containers |
| **Context Drift** | Executing prompt tasks without checking \`DECISION_LOG.md\` | Mandatory compliance with [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) |
`,

  'TECHNICAL_DEBT.md': `${universalYaml('Technical Debt Backlog')}
# Technical Debt Backlog

| Debt ID | System / File | Description | Priority | Resolution Milestone |
|---|---|---|---|---|
| DEBT-001 | \`prototype-metrics.ts\` | Optional property checks require defensive fallback checks | Low | Milestone 1 (Phase 05) |
| DEBT-002 | \`input-router.ts\` | Internal intent mutation requires \`MutableMovementIntent\` cast | Low | Milestone 1 (Phase 05) |
| DEBT-003 | Dev UI Components | Legacy inline styles in early prototype overlays need token migration | Medium | Milestone 1 (Phase 13) |
`,

  'REPOSITORY_KNOWLEDGE.md': `${universalYaml('Repository Knowledge Base')}
# Repository Knowledge Base & Workspace Map

## Monorepo Workspace Map
- **\`frontend/\`**: Core WebGL 3D game client (Babylon.js), UI screens, HUD, and physics solvers.
- **\`middleware/\`**: Express / Node.js API gateway and WebSocket session handlers.
- **\`backend/\`**: Serverless cloud functions, database schemas, and analytics processing.
- **\`shared/\`**: Shared TypeScript types, vector math utilities, and spline calculators.
- **\`FLOWSTATE_MASTER_GUIDE/\`**: AI-Native Game Development Operating System (GDOS).
- **\`.agents/AGENTS.md\`**: AI repository rules and Do-Not-Break constraints.

## Critical Entry Points
- Game Client Entry: \`frontend/src/main.ts\`
- Render Engine Canvas: \`frontend/src/rendering/canvas-engine.ts\`
- Physics Movement Solver: \`frontend/src/core/physics/movement-engine.ts\`
- CSS Tokens: \`frontend/src/ui/styles/tokens.css\`
`,

  'MEMORY_PROTOCOL.md': `${universalYaml('Memory Protocol')}
# Mandatory AI Memory Protocol

Every AI agent, subagent, and human engineer **MUST** strictly follow this **10-Step Memory Protocol** for every execution phase. Skipping any step is a protocol violation.

\`\`\`mermaid
flowchart TD
    Step1[1. Read Canon] --> Step2[2. Read Decision Log]
    Step2 --> Step3[3. Read Architectural Decisions]
    Step3 --> Step4[4. Read Open Problems]
    Step4 --> Step5[5. Read Repository Knowledge]
    Step5 --> Step6[6. Execute Code Implementation]
    Step6 --> Step7[7. Update Decision Log]
    Step7 --> Step8[8. Update Changelog]
    Step8 --> Step9[9. Update Lessons Learned]
    Step9 --> Step10[10. Verify Quality Gates & Consistency]
\`\`\`

## Protocol Steps
1. **Read Canon**: Review \`FLOWSTATE_MASTER_GUIDE/98_CANON/\` to align with game vision and laws.
2. **Read Decision Log**: Check \`99_PROJECT_MEMORY/DECISION_LOG.md\` to prevent re-opening settled decisions.
3. **Read Architectural Decisions**: Review \`ARCHITECTURAL_DECISIONS.md\` for ADR constraints.
4. **Read Open Problems**: Check \`OPEN_PROBLEMS.md\` for related open issues.
5. **Read Repository Knowledge**: Review \`REPOSITORY_KNOWLEDGE.md\` for file maps and entry points.
6. **Execute Code Implementation**: Perform changes adhering strictly to Do-Not-Break rules.
7. **Update Decision Log**: Record any new architectural decisions in \`DECISION_LOG.md\`.
8. **Update Changelog**: Add entry to \`CHANGELOG.md\` under active version.
9. **Update Lessons Learned**: Record discoveries or issues in \`LESSONS_LEARNED.md\`.
10. **Verify Consistency**: Execute \`npm run typecheck\` and verify 10-Point AI Quality Gate compliance.
`
};

Object.entries(memoryFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(memoryDir, filename), content, 'utf8');
});

// Update INDEX.md to reference all 18 Memory documents
const indexPath = path.join(gdosDir, 'INDEX.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const memoryIndexBlock = `### Project Memory & Institutional System (\`99_PROJECT_MEMORY/\`)
- [MEMORY_PROTOCOL.md](99_PROJECT_MEMORY/MEMORY_PROTOCOL.md) — Mandatory 10-Step Memory Protocol.
- [DECISION_LOG.md](99_PROJECT_MEMORY/DECISION_LOG.md) — Single source of truth decision log.
- [ARCHITECTURE_HISTORY.md](99_PROJECT_MEMORY/ARCHITECTURE_HISTORY.md) — Chronological engine evolution.
- [CHANGELOG.md](99_PROJECT_MEMORY/CHANGELOG.md) — Semantic versioning master changelog.
- [CONFIRMED_FEATURES.md](99_PROJECT_MEMORY/CONFIRMED_FEATURES.md) — Confirmed features registry.
- [EXPERIMENTAL_FEATURES.md](99_PROJECT_MEMORY/EXPERIMENTAL_FEATURES.md) — R&D testing features.
- [REJECTED_IDEAS.md](99_PROJECT_MEMORY/REJECTED_IDEAS.md) — Rejected ideas & design constraints.
- [KNOWN_LIMITATIONS.md](99_PROJECT_MEMORY/KNOWN_LIMITATIONS.md) — Engine & performance limitations.
- [OPEN_PROBLEMS.md](99_PROJECT_MEMORY/OPEN_PROBLEMS.md) — Open engineering problems backlog.
- [LESSONS_LEARNED.md](99_PROJECT_MEMORY/LESSONS_LEARNED.md) — Phase execution discoveries & lessons.
- [ARCHITECTURAL_DECISIONS.md](99_PROJECT_MEMORY/ARCHITECTURAL_DECISIONS.md) — Architecture Decision Records (ADRs).
- [DESIGN_RATIONALE.md](99_PROJECT_MEMORY/DESIGN_RATIONALE.md) — Deep design rationale & philosophy.
- [IMPLEMENTATION_PATTERNS.md](99_PROJECT_MEMORY/IMPLEMENTATION_PATTERNS.md) — System implementation patterns.
- [CODING_PATTERNS.md](99_PROJECT_MEMORY/CODING_PATTERNS.md) — TypeScript & CSS coding standards.
- [AI_AGENT_NOTES.md](99_PROJECT_MEMORY/AI_AGENT_NOTES.md) — Execution notes for AI coding agents.
- [COMMON_FAILURES.md](99_PROJECT_MEMORY/COMMON_FAILURES.md) — Failure modes & preventative rules.
- [TECHNICAL_DEBT.md](99_PROJECT_MEMORY/TECHNICAL_DEBT.md) — Technical debt backlog.
- [REPOSITORY_KNOWLEDGE.md](99_PROJECT_MEMORY/REPOSITORY_KNOWLEDGE.md) — Monorepo workspace map & entry points.
`;

if (indexContent.includes('[99_PROJECT_MEMORY](99_PROJECT_MEMORY/DECISION_LOG.md)')) {
  indexContent = indexContent.replace('- [99_PROJECT_MEMORY](99_PROJECT_MEMORY/DECISION_LOG.md)', memoryIndexBlock);
} else if (!indexContent.includes('### Project Memory & Institutional System')) {
  indexContent += '\n' + memoryIndexBlock;
}

fs.writeFileSync(indexPath, indexContent, 'utf8');

// Update ROADMAP.md to track Memory System completeness
const roadmapPath = path.join(gdosDir, 'ROADMAP.md');
let roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

if (!roadmapContent.includes('## Project Memory System Tracking')) {
  roadmapContent += `
---

## Project Memory System Tracking (\`99_PROJECT_MEMORY/\`)

| Memory Document | Status | Completeness | Last Updated |
|---|---|---|---|
| **MEMORY_PROTOCOL.md** | Active | 100% (10 Steps) | 2026-07-23 |
| **DECISION_LOG.md** | Active | 100% (DEC-001 - DEC-003) | 2026-07-23 |
| **ARCHITECTURE_HISTORY.md** | Active | 100% | 2026-07-23 |
| **CHANGELOG.md** | Active | 100% (v1.0.0) | 2026-07-23 |
| **CONFIRMED_FEATURES.md** | Active | 100% | 2026-07-23 |
| **EXPERIMENTAL_FEATURES.md** | Active | 100% | 2026-07-23 |
| **REJECTED_IDEAS.md** | Active | 100% | 2026-07-23 |
| **KNOWN_LIMITATIONS.md** | Active | 100% | 2026-07-23 |
| **OPEN_PROBLEMS.md** | Active | 100% | 2026-07-23 |
| **LESSONS_LEARNED.md** | Active | 100% | 2026-07-23 |
| **ARCHITECTURAL_DECISIONS.md** | Active | 100% (ADR-001 - ADR-003) | 2026-07-23 |
| **DESIGN_RATIONALE.md** | Active | 100% | 2026-07-23 |
| **IMPLEMENTATION_PATTERNS.md** | Active | 100% | 2026-07-23 |
| **CODING_PATTERNS.md** | Active | 100% | 2026-07-23 |
| **AI_AGENT_NOTES.md** | Active | 100% | 2026-07-23 |
| **COMMON_FAILURES.md** | Active | 100% | 2026-07-23 |
| **TECHNICAL_DEBT.md** | Active | 100% | 2026-07-23 |
| **REPOSITORY_KNOWLEDGE.md** | Active | 100% | 2026-07-23 |
`;
  fs.writeFileSync(roadmapPath, roadmapContent, 'utf8');
}

console.log('Phase 00.04 Project Memory System scaffolded successfully!');
