const fs = require('fs');
const path = require('path');

const gdosDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');
const templatesDir = path.join(gdosDir, 'TEMPLATES');

fs.mkdirSync(templatesDir, { recursive: true });

const universalYaml = `---
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
`;

const templates = {
  'Specification_Template.md': `${universalYaml}
# [System Name] Specification

## 1. Objective
[Concise description of what this specification accomplishes.]

## 2. Design Philosophy
[Core design principles, luminous minimalism alignment, and user experience goals.]

## 3. Current Repository State
- **Completed**: [Functionality already implemented]
- **Partial**: [Partially implemented features]
- **Missing**: [Features yet to be created]
- **Technical Debt**: [Known tech debt or refactoring targets]
- **Dependencies**: [Internal and external dependencies]

## 4. Desired Final Implementation
[Detailed description of the target state upon specification completion.]

## 5. Technical Architecture
### Equations
$$ [LaTeX Mathematical Model] $$

### Coordinate Systems
[3D World Space vs Screen Space vs Local Tangent Space]

### Timing Diagrams
\`\`\`mermaid
sequenceDiagram
    participant P as Player Sphere
    participant S as Physics Solver
    participant R as Ribbon Generator
    P->>S: Step Kinematics
    S->>R: Query Surface Tangent
\`\`\`

### State Machines
\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Accelerating: Player Input
    Accelerating --> FlowState: Threshold Velocity
\`\`\`

### Pseudocode
\`\`\`typescript
function executeSystem(delta: number): void {
  // Pseudocode implementation logic
}
\`\`\`

### Complexity Analysis
- Time Complexity: $O(1)$ per frame.
- Memory Complexity: $O(0)$ (Zero allocation per frame).

## 6. Files to Inspect
- \`[path/to/file1.ts]\`

## 7. Files to Modify
- \`[path/to/file2.ts]\`

## 8. Files Never Modify
- \`frontend/src/core/physics/movement-engine.ts\` (Protected Core)

## 9. Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## 10. Performance Budgets
- Target FPS: 60 FPS
- Memory: < 150 MB RAM
- VRAM: < 100 MB VRAM
- CPU Time: < 2.0 ms / frame
- Draw Calls: < 40 calls
- Load Times: < 1.5 seconds

## 11. Mobile Constraints
[Thermal throttling limits, touch gesture boundaries, screen aspect ratio scaling.]

## 12. Edge Cases
[Boundary conditions, lost WebGL context, zero velocity edge cases.]

## 13. Future Extensibility
[Hooks for liveops, seasonal biomes, or multiplayer synchronization.]

## 14. Executable Agent Prompt
\`\`\`text
Goal: [Execution goal]
Context: [Key context]
Repository State: [Current state]
Read First: FLOWSTATE_MASTER_GUIDE/99_PROJECT_MEMORY/DECISION_LOG.md
Files to Inspect: [Files]
Files to Modify: [Files]
Files Never Modify: [Files]
Implementation Plan: [Step by step plan]
Constraints: 60 FPS target, 0-byte frame allocation.
Acceptance Tests: npm run typecheck
Completion Checklist: 10-Point AI Quality Gate verified.
\`\`\`
`,

  'Phase_Package_Template.md': `${universalYaml}
# Phase Package Structure Template

A complete phase package consists of 7 self-contained markdown documents inside \`AGENT_PROMPTS/Phase_XX/\`:

1. **README.md**: Overview, objectives, and package document directory.
2. **Context.md**: Background context, architectural history, and dependencies.
3. **Task.md**: Step-by-step executable prompt for Antigravity IDE / Codex.
4. **Acceptance.md**: Machine & human validation criteria (10-Point AI Quality Gate).
5. **Regression.md**: Do-not-break rules and protected file registry.
6. **Verification.md**: Automated build & test execution commands.
7. **Rollback.md**: Emergency rollback and workspace reset protocol.
`,

  'README_Template.md': `${universalYaml}
# [Module Name] Module

## Module Purpose
[Summary of module purpose]

## Responsibilities
- [Responsibility 1]
- [Responsibility 2]

## Systems Included
- [System 1]
- [System 2]

## Dependencies
- [Module Name](../[Module_Dir]/README.md)

## Future Specifications
- [Future Spec 1]

## Related Modules
- [Related Module Name](../[Module_Dir]/README.md)
`,

  'Decision_Log_Template.md': `${universalYaml}
# Decision Log Record Template

### DEC-[XXX]: [Decision Title]
- **Date**: YYYY-MM-DD
- **Author**: [Author / Agent]
- **Status**: Proposed | Approved | Rejected | Superseded
- **Decision**: [Clear description of what was decided]
- **Reason**: [Core rationale and problem being solved]
- **Alternatives Considered**: [Other options evaluated and why rejected]
- **Impact**: [System impact across modules]
- **Affected Modules**: [List of affected GDOS modules]
`,

  'Architecture_Record_Template.md': `${universalYaml}
# Architecture Decision Record (ADR) Template

## ADR-[XXX]: [Architecture Title]

### Context & Problem Statement
[Describe the architectural problem and context.]

### Decision Drivers
- Performance (60 FPS target)
- Luminous Minimalism aesthetic
- Decoupled HUD vs Physics architecture

### Considered Options
1. [Option 1]
2. [Option 2]

### Decision Outcome
Chosen Option: **[Option 1]** because [Rationale].

### Consequences
- Positive: [Positive impact]
- Negative: [Negative impact or trade-offs]
`,

  'Testing_Template.md': `${universalYaml}
# Testing & QA Specification Template

## Test Suite Scope
[Target module / component being tested]

## Automated Tests
- **Unit Tests**: \`npm test -- [test-file]\`
- **Type Safety**: \`npm run typecheck\`
- **Linter Checks**: \`npm run lint\`

## Visual & Manual Verification
- [ ] Render canvas verified at 60 FPS
- [ ] Scrim legibility verified against active WebGL scene

## Regression Prevention Checklist
- [ ] No physics solver mutations
- [ ] Zero un-tokenized CSS values
`,

  'Performance_Budget_Template.md': `${universalYaml}
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
`,

  'Mathematical_Model_Template.md': `${universalYaml}
# Reusable Mathematical Model Specification

## Variables & Constants
- $\\vec{p}$: Position vector $[x, y, z]^T \\in \\mathbb{R}^3$
- $\\vec{v}$: Velocity vector $[v_x, v_y, v_z]^T \\in \\mathbb{R}^3$
- $k_{\\text{friction}}$: Surface friction coefficient ($0.0 \\le k \\le 1.0$)

## Coordinate Systems
Right-handed 3D Cartesian coordinates ($X$ right, $Y$ up, $Z$ forward).

## Governing Equations
$$ \\vec{v}_{t+\\Delta t} = \\vec{v}_t + (\\vec{g} - k_{\\text{friction}} \\vec{v}_t) \\Delta t $$

## Constraints & Stability Notes
- Numerical integration: Semi-implicit Euler step.
- Velocity clamping: $\|\\vec{v}\| \\le v_{\\max}$ to prevent float overflow.

## Big-O Analysis
- Time Complexity: $O(1)$ per tick.
- Memory Complexity: $O(1)$ static state buffers.
`,

  'Feature_Lifecycle_Template.md': `${universalYaml}
# Feature Lifecycle Specification

## Lifecycle Stages
1. **Idea**: Conceptual proposal documented in \`EXPERIMENTAL_FEATURES.md\`.
2. **Prototype**: Prototype implementation created in isolated branch or scratch.
3. **Experimental**: Evaluated with live telemetry and user feedback.
4. **Approved**: Officially approved and logged in \`DECISION_LOG.md\` and \`CONFIRMED_FEATURES.md\`.
5. **Production**: Merged into main build with 10-Point AI Quality Gate verification.
6. **Deprecated**: Marked deprecated with migration path provided.
7. **Removed**: Safely removed from codebase with zero orphaned dependencies.

## Mandatory Documentation Updates Across Stages
- Update \`99_PROJECT_MEMORY/DECISION_LOG.md\` upon Stage 4 (Approved).
- Update \`CHANGELOG.md\` upon Stage 5 (Production).
`,

  'Risk_Register_Template.md': `${universalYaml}
# Risk Register Specification

## Risk Entry Template

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy | Owner | Dependencies |
|---|---|---|---|---|---|---|
| RSK-001 | Mobile GPU thermal throttling on low-end devices | High | High | Dynamic resolution scaling & GPU LOD instancing | Graphics Lead | 18_OPTIMIZATION_LOD |
| RSK-002 | Context drift in large AI pair programming tasks | Medium | High | Enforce GDOS Project Memory checks & Do-Not-Break rules | AI Operating Spec | 00_PROJECT_CORE |
`
};

Object.entries(templates).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(templatesDir, filename), content, 'utf8');
});

// Update INDEX.md to add Templates section
const indexPath = path.join(gdosDir, 'INDEX.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('## Templates Registry')) {
  indexContent += `
---

## Templates Registry (\`TEMPLATES/\`)
- [Specification_Template.md](TEMPLATES/Specification_Template.md) — Standard 14-section architecture template.
- [Phase_Package_Template.md](TEMPLATES/Phase_Package_Template.md) — 7-document phase work package template.
- [README_Template.md](TEMPLATES/README_Template.md) — Module README template.
- [Decision_Log_Template.md](TEMPLATES/Decision_Log_Template.md) — Decision log entry format.
- [Architecture_Record_Template.md](TEMPLATES/Architecture_Record_Template.md) — ADR template.
- [Testing_Template.md](TEMPLATES/Testing_Template.md) — Testing & QA specification template.
- [Performance_Budget_Template.md](TEMPLATES/Performance_Budget_Template.md) — Reusable performance budget template.
- [Mathematical_Model_Template.md](TEMPLATES/Mathematical_Model_Template.md) — Math model specification template.
- [Feature_Lifecycle_Template.md](TEMPLATES/Feature_Lifecycle_Template.md) — Feature lifecycle stages.
- [Risk_Register_Template.md](TEMPLATES/Risk_Register_Template.md) — Risk register template.
`;
  fs.writeFileSync(indexPath, indexContent, 'utf8');
}

// Update ROADMAP.md to add Documentation Maturity Matrix
const roadmapPath = path.join(gdosDir, 'ROADMAP.md');
let roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

if (!roadmapContent.includes('## Documentation Maturity Matrix')) {
  roadmapContent += `
---

## Documentation Maturity Matrix

| Module | Foundation (README) | Partial Specs | Complete Specs |
|---|---|---|---|
| **00_PROJECT_CORE** | Complete | Complete | Complete |
| **01_GAMEPLAY** | Complete | Foundation | In-Progress |
| **02_PHYSICS** | Complete | Foundation | In-Progress |
| **03_LEVEL_DESIGN** | Complete | Foundation | Planned |
| **04_LIVING_WORLD_SIMULATION** | Complete | Foundation | Planned |
| **05_ENVIRONMENT_RENDERING** | Complete | Foundation | Planned |
| **06_ART_DIRECTION** | Complete | Foundation | Planned |
| **07_PLAYER_SPHERE** | Complete | Foundation | Planned |
| **08_TRACK_SYSTEM** | Complete | Foundation | Planned |
| **09_PROGRESSION** | Complete | Foundation | Planned |
| **10_PERKS** | Complete | Foundation | Planned |
| **11_COSMETICS_ECONOMY** | Complete | Foundation | Planned |
| **12_AUDIO_ENGINE** | Complete | Foundation | Planned |
| **13_UI_UX** | Complete | Foundation | Planned |
| **14_BALANCE** | Complete | Foundation | Planned |
| **15_TECHNICAL_ENGINE** | Complete | Foundation | Planned |
| **16_SHADER_SYSTEM** | Complete | Foundation | Planned |
| **17_ASSET_PIPELINE** | Complete | Foundation | Planned |
| **18_OPTIMIZATION_LOD** | Complete | Foundation | Planned |
| **19_SOCIAL_MULTIPLAYER** | Complete | Foundation | Planned |
| **20_BACKEND_INFRASTRUCTURE** | Complete | Foundation | Planned |
| **21_SAVE_CLOUD_SYSTEM** | Complete | Foundation | Planned |
| **22_ANALYTICS_TELEMETRY** | Complete | Foundation | Planned |
| **23_MONETIZATION** | Complete | Foundation | Planned |
| **24_TESTING_QA** | Complete | Foundation | Planned |
| **25_PRODUCTION_MANAGEMENT** | Complete | Foundation | Planned |
| **26_RELEASE_LIVEOPS** | Complete | Foundation | Planned |
`;
  fs.writeFileSync(roadmapPath, roadmapContent, 'utf8');
}

console.log('Phase 00.02 Specification Templates scaffolded successfully!');
