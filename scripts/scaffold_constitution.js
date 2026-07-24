const fs = require('fs');
const path = require('path');

const gdosDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');
const coreDir = path.join(gdosDir, '00_PROJECT_CORE');

fs.mkdirSync(coreDir, { recursive: true });

const universalYaml = (title, phase = "00.05") => `---
Title: "${title}"
Module: "00_PROJECT_CORE"
Status: Active
Priority: Critical
Milestone: 1
Phase: "${phase}"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [98_CANON, 99_PROJECT_MEMORY]
Provides: [Engineering Constitution & Code Review Governance]
Blocks: [Phase 00.06, Implementation Phases]
Estimated Work: 4 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---
`;

const constitutionFiles = {
  'ENGINEERING_CONSTITUTION.md': `${universalYaml('Engineering Constitution')}
# FLOWSTATE Engineering Constitution

This Engineering Constitution defines the non-negotiable technical laws governing code implementation, system architecture, performance budgets, quality assurance, and AI-assisted development across FLOWSTATE.

---

## 1. Development Philosophy
- **Composability**: Build modular, decoupled systems with clear single responsibilities.
- **Deterministic Behavior**: Ensure physics calculations and game loop updates are deterministic across frame rates and hardware tiers.
- **Zero Overhead**: Avoid unnecessary abstractions, indirect wrappers, or premature general-purpose frameworks.
- **Performance-First**: Frame rate, latency, and memory efficiency take precedence over visual excess.
- **Mobile-First Ergonomics**: Optimize for touch responsiveness, low memory footprints, thermal limits, and battery preservation.
- **Long-Term Maintainability**: Code must be self-documenting, tokenized, and structured for long-term AI-assisted iteration.

---

## 2. Architectural Laws
- **Single Responsibility**: Every class, module, and component must have one clearly defined responsibility.
- **Event-Driven Communication**: Decouple subsystems using read-only event buses and telemetry dispatchers.
- **Presentation Separated from Simulation**: UI overlays and HUD presentation must never mutate simulation state directly.
- **Rendering Separated from Gameplay**: WebGL shader execution and mesh transforms must consume read-only physics state snapshots.
- **No Circular Dependencies**: TypeScript modules must form a strict directed acyclic graph (DAG).
- **No Hidden Global State**: Prohibit global mutable variables or undocumented singleton mutations.
- **Immutable Public Interfaces**: Expose \`readonly\` properties on state interfaces to prevent unintended mutations.
- **Dependency Inversion**: High-level game systems depend on abstractions, not concrete low-level implementations.
- **Strict Layer Isolation**: \`02_PHYSICS\` $\\rightarrow$ \`04_LIVING_WORLD_SIMULATION\` $\\rightarrow$ \`05_ENVIRONMENT_RENDERING\` $\\rightarrow$ \`13_UI_UX\`.

---

## 3. Repository Laws
- **One Source of Truth**: Every system specification, decision record, and token parameter has exactly one canonical location.
- **No Duplicate Systems**: Never write parallel utility helpers or duplicate spline calculators. Check \`99_PROJECT_MEMORY/REPOSITORY_KNOWLEDGE.md\` first.
- **Relative Links Only**: All markdown links between GDOS specifications must use relative paths.
- **Meaningful Filenames**: Use descriptive, lowercase-kebab-case or title-cased filenames matching exact module conventions.
- **Consistent Folder Ownership**: System files reside strictly within their designated monorepo workspace (\`frontend/\`, \`middleware/\`, \`backend/\`, \`shared/\`).

---

## 4. Performance Constitution
- **60 FPS Target**: Maintain stable 60 FPS (16.67ms frame budget) across all target hardware tiers.
- **Zero Frame Allocations**: Prohibit object instantiation (\`new Vector3()\`, \`new Array()\`) inside the 60 FPS update loop.
- **Object Pooling**: Mandatory static object pooling for track segments, foliage instances, and particle emitters.
- **Shader Budgets**: $< 12$ active compiled shader passes per frame.
- **Texture Budgets**: Maximum 2048x2048 compressed textures (KTX2 / WebP) with VRAM $< 100 \\text{ MB}$.
- **Draw Call Limits**: $< 40$ draw calls per frame on mobile targets.
- **Memory Limits**: $< 150 \\text{ MB}$ total process RAM footprint.
- **Thermal & Battery Awareness**: Dynamically throttle particle density when GPU temperatures exceed 42°C.

---

## 5. Documentation Constitution
Every implementation phase MUST update:
1. **Decision Log**: Record architectural decisions in \`99_PROJECT_MEMORY/DECISION_LOG.md\`.
2. **Changelog**: Record code deltas in \`99_PROJECT_MEMORY/CHANGELOG.md\`.
3. **Lessons Learned**: Document technical discoveries in \`99_PROJECT_MEMORY/LESSONS_LEARNED.md\`.
4. **Specifications**: Update target specifications in \`FLOWSTATE_MASTER_GUIDE/\`.
5. **ADR Register**: Log architectural changes in \`99_PROJECT_MEMORY/ARCHITECTURAL_DECISIONS.md\`.

---

## 6. Testing Constitution
Every implementation phase requires 7 mandatory checks:
1. **Build Verification**: \`npm run build\` completes with 0 errors.
2. **Linting Check**: Zero linter errors.
3. **TypeScript Verification**: \`npm run typecheck\` returns 0 diagnostic errors.
4. **Unit Tests**: Pass all automated unit tests (\`npm test\`).
5. **Regression Tests**: Verify protected physics and collision files remain un-mutated.
6. **Manual Validation**: Verify 60 FPS rendering and UI scrim contrast in canvas viewport.
7. **Performance Validation**: Confirm 0-byte frame allocation and draw call budget compliance.

---

## 7. Breaking Change Rules
- **Minor Changes**: Non-breaking internal refactors or localized bug fixes. Requires standard pull request validation.
- **Major Changes**: Modifying public module interfaces or data schemas. Requires migration scripts and version bump.
- **Architectural Changes**: Modifying core physics, simulation data flows, or monorepo workspace boundaries. Requires explicit ADR entry and approval.
- **Rollback Safety**: Every major phase package must include a verified \`Rollback.md\` protocol.

---

## 8. Feature Acceptance Process
1. **Idea Stage**: Logged in \`99_PROJECT_MEMORY/EXPERIMENTAL_FEATURES.md\`.
2. **Specification Stage**: Spec document scaffolded using \`TEMPLATES/Specification_Template.md\`.
3. **Review Stage**: Evaluated against [98_CANON/Player Experience Checklist.md](../98_CANON/Player%20Experience%20Checklist.md).
4. **Prototype Stage**: Built in isolated experimental module.
5. **Implementation Stage**: Code written according to GDOS spec.
6. **Verification Stage**: Verified against 10-Point AI Quality Gate.
7. **Production Stage**: Merged into main build and logged in \`CONFIRMED_FEATURES.md\`.
8. **Maintenance & Deprecation**: Monitored via telemetry; deprecated if superseded.

---

## 9. AI Development Rules
Antigravity IDE, Codex, and AI agents MUST follow this sequential execution protocol:
1. **Read Canon**: Review \`FLOWSTATE_MASTER_GUIDE/98_CANON/\`.
2. **Read Memory**: Execute [99_PROJECT_MEMORY/MEMORY_PROTOCOL.md](../99_PROJECT_MEMORY/MEMORY_PROTOCOL.md).
3. **Read Specifications**: Inspect target GDOS specifications.
4. **Inspect Repository**: Read authoritative target source code files.
5. **Implement**: Write code respecting Do-Not-Break rules.
6. **Test**: Run \`npm run typecheck\` and \`npm test\`.
7. **Benchmark**: Confirm 60 FPS and 0-byte frame allocation.
8. **Document**: Update CHANGELOG, DECISION_LOG, and LESSONS_LEARNED.
9. **Verify**: Verify 10-Point AI Quality Gate compliance.
10. **Complete**: Submit completed work package summary.

---

## 10. Master 10-Point AI Quality Gate Checklist
Every phase completion requires passing all 10 checks:
- [ ] **1. Architecture**: Decoupled tier separation; zero circular dependencies.
- [ ] **2. Performance**: Stable 60 FPS target; $< 40$ draw calls; $< 150 \\text{ MB}$ RAM.
- [ ] **3. Gameplay**: Momentum conservation preserved; deterministic physics solvers intact.
- [ ] **4. UX & Aesthetics**: Tokenized CSS colors (\`tokens.css\`); text legibility backed by \`var(--flow-text-scrim)\`.
- [ ] **5. Accessibility**: Touch targets $\\ge 44\\times 44\\text{px}$; safe-area bounds respected.
- [ ] **6. Documentation**: All GDOS specs, DECISION_LOG, and CHANGELOG updated.
- [ ] **7. Testing**: \`npm run typecheck\` and unit tests pass with 0 errors.
- [ ] **8. Regression**: Protected files in \`Do_Not_Break_Rules.md\` untouched.
- [ ] **9. Memory**: 0-byte object allocation per frame during rendering loop.
- [ ] **10. Canon Alignment**: 100% compliant with 27 Gameplay Laws and 42 Anti-Patterns.

---

## Related Core Documents
- [CODE_REVIEW_STANDARD.md](CODE_REVIEW_STANDARD.md)
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
- [PHASE_COMPLETION_CHECKLIST.md](PHASE_COMPLETION_CHECKLIST.md)
`,

  'CODE_REVIEW_STANDARD.md': `${universalYaml('Code Review Standard')}
# Code Review Standard

This document establishes the code quality, maintainability, and review rules for all pull requests and code modifications in FLOWSTATE.

## 1. Naming Conventions
- **Files & Directories**: Lowercase kebab-case (\`movement-controller.ts\`, \`spline-calculator.ts\`).
- **Classes & Interfaces**: PascalCase (\`MovementController\`, \`ReadOnlyTelemetry\`).
- **Methods & Variables**: camelCase (\`calculateVelocity\`, \`currentSpeed\`).
- **Constants**: UPPER_SNAKE_CASE (\`MAX_VELOCITY\`, \`DEFAULT_FOV\`).
- **CSS Custom Properties**: Lowercase kebab-case prefixed with \`--flow-\` (\`--flow-cyan-400\`, \`--flow-text-scrim\`).

## 2. Architecture & Decoupling
- UI components MUST NOT import or mutate physics engine classes directly.
- All telemetry updates must be dispatched via read-only interfaces or immutable event payloads.

## 3. Performance & Memory
- No \`new\` object allocations permitted inside \`update()\`, \`render()\`, or frame tick callbacks.
- Reuse static temporary structures (\`Vector3.TEMP\`) for intermediate calculations.

## 4. Readability & Maintainability
- Max function length: 50 lines.
- Max file length: 400 lines (split into sub-modules if exceeded).
- Use self-documenting code with explicit TypeScript types. Zero \`any\` permitted.

## 5. Security & Safety
- Validate all user inputs and cloud save payloads before serialization.
- Sanitize telemetry payloads to exclude personally identifiable information.

## Related Core Documents
- [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md)
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
`,

  'IMPLEMENTATION_CHECKLIST.md': `${universalYaml('Implementation Checklist')}
# Pre-Merge Implementation Checklist

Use this one-page checklist before merging any code modification or pull request into main:

### Code Quality & Types
- [ ] Explicit TypeScript types assigned (zero \`any\` types).
- [ ] No circular dependencies introduced (\`npm run typecheck\` returns 0 errors).
- [ ] No hardcoded hex colors or inline style overrides in TS components.
- [ ] All colors derive from \`tokens.css\` variables.

### Architecture & Safety
- [ ] Protected files in \`Do_Not_Break_Rules.md\` remain untouched.
- [ ] UI components consume read-only telemetry payloads only.
- [ ] Event listeners cleanly removed on unmount.

### Performance & Memory
- [ ] Zero object allocations inside frame update loops.
- [ ] Draw call budget ($< 40$ calls) and VRAM budget ($< 100 \\text{ MB}$) respected.

### Documentation & Memory
- [ ] \`99_PROJECT_MEMORY/DECISION_LOG.md\` updated for any architectural choice.
- [ ] \`99_PROJECT_MEMORY/CHANGELOG.md\` updated under active version.

## Related Core Documents
- [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md)
- [PHASE_COMPLETION_CHECKLIST.md](PHASE_COMPLETION_CHECKLIST.md)
`,

  'PHASE_COMPLETION_CHECKLIST.md': `${universalYaml('Phase Completion Checklist')}
# Mandatory Phase Completion Checklist

Before marking any development phase closed in \`ROADMAP.md\` or \`AGENT_PROMPTS/\`, verify the following **10 Criteria**:

- [ ] **1. Task Scope Completed**: All deliverables in \`Phase_XX/Task.md\` fulfilled.
- [ ] **2. 0-Error Compilation**: \`npm run typecheck\` completes cleanly.
- [ ] **3. Automated Tests Pass**: All unit & integration tests pass (\`npm test\`).
- [ ] **4. Quality Gates Verified**: All 10 points in [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md#10-master-10-point-ai-quality-gate-checklist) satisfied.
- [ ] **5. Performance Benchmarked**: 60 FPS verified with 0-byte frame memory leak.
- [ ] **6. Mobile Verified**: Touch gesture regions and safe-area bounds verified.
- [ ] **7. Canon Alignment Verified**: 100% compliant with 27 Gameplay Laws & 42 Anti-Patterns.
- [ ] **8. Memory Protocol Executed**: [MEMORY_PROTOCOL.md](../99_PROJECT_MEMORY/MEMORY_PROTOCOL.md) executed in full.
- [ ] **9. Phase Documents Updated**: \`README.md\`, \`Acceptance.md\`, and \`Verification.md\` updated in phase package.
- [ ] **10. Changelog & Decision Log Updated**: Delta recorded in \`CHANGELOG.md\` and \`DECISION_LOG.md\`.

## Related Core Documents
- [ENGINEERING_CONSTITUTION.md](ENGINEERING_CONSTITUTION.md)
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
`
};

Object.entries(constitutionFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(coreDir, filename), content, 'utf8');
});

// Create ARCHITECTURE_MAP.md in FLOWSTATE_MASTER_GUIDE/ root
const architectureMapContent = `${universalYaml('Runtime Architecture Map')}
# FLOWSTATE Runtime Architecture Map

This document outlines the runtime data flow and execution hierarchy of the FLOWSTATE game engine. While \`DEPENDENCY_GRAPH.md\` maps documentation modules, this blueprint details how data flows through system subsystems at runtime.

---

## High-Level Data Flow Architecture

\`\`\`mermaid
flowchart TD
    Input[1. Raw Hardware Input: Touch / Keyboard / Gamepad] --> InputRouter[2. Input Router: Gesture & Command Normalizer]
    InputRouter --> MovementController[3. Movement Controller: Intent & Trajectory Solver]
    MovementController --> PhysicsEngine[4. Physics Engine: Kinetics & Spline Collision]
    PhysicsEngine --> TelemetryBus[5. Read-Only Telemetry Event Stream]
    
    TelemetryBus --> EcoSim[6. Living World Simulation: Ecosystem & Weather]
    TelemetryBus --> AudioEngine[7. Audio Engine: Spatial Audio & Stem Mixer]
    TelemetryBus --> HUD[8. Player HUD & Glassmorphism Scrim Overlay]

    EcoSim --> RenderPipeline[9. Environment Rendering: GPU Instancing & Splat Shaders]
    PhysicsEngine --> RenderPipeline
    RenderPipeline --> Canvas[10. Babylon.js 3D WebGL Canvas Engine]
\`\`\`

---

## System Tier Breakdown

### Tier 1: Hardware & Input Layer
- **Input Router**: Converts raw pointer, touch, and keyboard events into normalized \`MovementIntent\` snapshots (\`horizontal\`, \`vertical\`, \`jumpPressed\`).

### Tier 2: Core Physics & Kinetics Layer
- **Movement Controller**: Evaluates intent against spline curvature and surfaces.
- **Physics Engine**: Solves kinetic equations, momentum conservation, gravity multipliers, and collision responses.
- **Telemetry Event Bus**: Dispatches immutable, read-only frame telemetry snapshots (\`position\`, \`velocity\`, \`currentSpeed\`, \`flowStateRatio\`).

### Tier 3: Simulation & Ecosystem Layer
- **Living World Simulation**: Consumes \`flowStateRatio\` telemetry to drive eco-resonance growth, foliage blooming, weather transitions, and day/night light temperature.
- **Audio Engine**: Adjusts active stem layers, spatial sound positioning, and haptic feedback based on momentum and ring passes.

### Tier 4: Presentation & Rendering Layer
- **Environment Rendering**: Renders terrain splat materials, GPU-instanced foliage, volumetric bloom, and particle VFX.
- **Player HUD**: Displays speed indicators, objective pills, energy meters, and DevPanel telemetry over dark scrims (\`tokens.css\`).
- **WebGL Canvas**: Output frame rendered via Babylon.js engine at steady 60 FPS target.

---

## Related Blueprint Documents
- [DEPENDENCY_GRAPH.md](DEPENDENCY_GRAPH.md) — Documentation dependency blueprint.
- [INDEX.md](INDEX.md) — GDOS Master Directory.
`;

fs.writeFileSync(path.join(gdosDir, 'ARCHITECTURE_MAP.md'), architectureMapContent, 'utf8');

// Update INDEX.md to reference core constitution files and ARCHITECTURE_MAP.md
const indexPath = path.join(gdosDir, 'INDEX.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const constitutionIndexBlock = `### Engineering Constitution & Governance (\`00_PROJECT_CORE/\`)
- [ARCHITECTURE_MAP.md](ARCHITECTURE_MAP.md) — Runtime data flow architecture blueprint.
- [00_PROJECT_CORE/ENGINEERING_CONSTITUTION.md](00_PROJECT_CORE/ENGINEERING_CONSTITUTION.md) — Permanent 10-section engineering constitution.
- [00_PROJECT_CORE/CODE_REVIEW_STANDARD.md](00_PROJECT_CORE/CODE_REVIEW_STANDARD.md) — Code review & naming standards.
- [00_PROJECT_CORE/IMPLEMENTATION_CHECKLIST.md](00_PROJECT_CORE/IMPLEMENTATION_CHECKLIST.md) — Pre-merge implementation checklist.
- [00_PROJECT_CORE/PHASE_COMPLETION_CHECKLIST.md](00_PROJECT_CORE/PHASE_COMPLETION_CHECKLIST.md) — Phase closure 10-point checklist.
- [00_PROJECT_CORE/Do_Not_Break_Rules.md](00_PROJECT_CORE/Do_Not_Break_Rules.md) — Protected code boundaries.
- [00_PROJECT_CORE/Architecture_Rules.md](00_PROJECT_CORE/Architecture_Rules.md) — Decoupled tier separation rules.
`;

if (indexContent.includes('- [00_PROJECT_CORE/Vision.md](00_PROJECT_CORE/Vision.md)')) {
  indexContent = indexContent.replace('- [00_PROJECT_CORE/Vision.md](00_PROJECT_CORE/Vision.md)', constitutionIndexBlock);
} else if (!indexContent.includes('### Engineering Constitution & Governance')) {
  indexContent += '\n' + constitutionIndexBlock;
}

fs.writeFileSync(indexPath, indexContent, 'utf8');

// Update ROADMAP.md to reflect the revised Phase 00 Roadmap
const roadmapPath = path.join(gdosDir, 'ROADMAP.md');
let roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

const revisedPhase00Block = `## Phase 00 Foundation Roadmap (System Setup)

| Phase | Goal | Status |
|---|---|---|
| **Phase 00.01** | GDOS Folder Architecture | ✅ Complete |
| **Phase 00.02** | Universal Templates | ✅ Complete |
| **Phase 00.03** | FLOWSTATE Canon | ✅ Complete |
| **Phase 00.04** | Project Memory System | ✅ Complete |
| **Phase 00.05** | Engineering Constitution | ✅ Complete |
| **Phase 00.06** | AI Operating Rules & Generate \`.agents/AGENTS.md\` | Planned |
| **Phase 00.07** | Repository Validator & GDOS Consistency Checker | Planned |
| **Phase 00.08** | Repository Audit & Gap Analysis | Planned |
| **Milestone 1** | Begin Milestone 1 Implementation (Phases 01-20) | Planned |
`;

if (roadmapContent.includes('## Phase 00 Foundation Roadmap')) {
  roadmapContent = roadmapContent.replace(/## Phase 00 Foundation Roadmap[\s\S]*?(?=## Milestone 1)/, revisedPhase00Block + '\n\n');
} else {
  roadmapContent = revisedPhase00Block + '\n\n' + roadmapContent;
}

fs.writeFileSync(roadmapPath, roadmapContent, 'utf8');

console.log('Phase 00.05 Engineering Constitution scaffolded successfully!');
