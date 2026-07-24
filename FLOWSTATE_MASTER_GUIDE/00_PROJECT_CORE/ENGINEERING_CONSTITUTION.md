---
Title: "Engineering Constitution"
Module: "00_PROJECT_CORE"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.05"
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
- **Immutable Public Interfaces**: Expose `readonly` properties on state interfaces to prevent unintended mutations.
- **Dependency Inversion**: High-level game systems depend on abstractions, not concrete low-level implementations.
- **Strict Layer Isolation**: `02_PHYSICS` $\rightarrow$ `04_LIVING_WORLD_SIMULATION` $\rightarrow$ `05_ENVIRONMENT_RENDERING` $\rightarrow$ `13_UI_UX`.

---

## 3. Repository Laws
- **One Source of Truth**: Every system specification, decision record, and token parameter has exactly one canonical location.
- **No Duplicate Systems**: Never write parallel utility helpers or duplicate spline calculators. Check `99_PROJECT_MEMORY/REPOSITORY_KNOWLEDGE.md` first.
- **Relative Links Only**: All markdown links between GDOS specifications must use relative paths.
- **Meaningful Filenames**: Use descriptive, lowercase-kebab-case or title-cased filenames matching exact module conventions.
- **Consistent Folder Ownership**: System files reside strictly within their designated monorepo workspace (`frontend/`, `middleware/`, `backend/`, `shared/`).

---

## 4. Performance Constitution
- **60 FPS Target**: Maintain stable 60 FPS (16.67ms frame budget) across all target hardware tiers.
- **Zero Frame Allocations**: Prohibit object instantiation (`new Vector3()`, `new Array()`) inside the 60 FPS update loop.
- **Object Pooling**: Mandatory static object pooling for track segments, foliage instances, and particle emitters.
- **Shader Budgets**: $< 12$ active compiled shader passes per frame.
- **Texture Budgets**: Maximum 2048x2048 compressed textures (KTX2 / WebP) with VRAM $< 100 \text{ MB}$.
- **Draw Call Limits**: $< 40$ draw calls per frame on mobile targets.
- **Memory Limits**: $< 150 \text{ MB}$ total process RAM footprint.
- **Thermal & Battery Awareness**: Dynamically throttle particle density when GPU temperatures exceed 42°C.

---

## 5. Documentation Constitution
Every implementation phase MUST update:
1. **Decision Log**: Record architectural decisions in `99_PROJECT_MEMORY/DECISION_LOG.md`.
2. **Changelog**: Record code deltas in `99_PROJECT_MEMORY/CHANGELOG.md`.
3. **Lessons Learned**: Document technical discoveries in `99_PROJECT_MEMORY/LESSONS_LEARNED.md`.
4. **Specifications**: Update target specifications in `FLOWSTATE_MASTER_GUIDE/`.
5. **ADR Register**: Log architectural changes in `99_PROJECT_MEMORY/ARCHITECTURAL_DECISIONS.md`.

---

## 6. Testing Constitution
Every implementation phase requires 7 mandatory checks:
1. **Build Verification**: `npm run build` completes with 0 errors.
2. **Linting Check**: Zero linter errors.
3. **TypeScript Verification**: `npm run typecheck` returns 0 diagnostic errors.
4. **Unit Tests**: Pass all automated unit tests (`npm test`).
5. **Regression Tests**: Verify protected physics and collision files remain un-mutated.
6. **Manual Validation**: Verify 60 FPS rendering and UI scrim contrast in canvas viewport.
7. **Performance Validation**: Confirm 0-byte frame allocation and draw call budget compliance.

---

## 7. Breaking Change Rules
- **Minor Changes**: Non-breaking internal refactors or localized bug fixes. Requires standard pull request validation.
- **Major Changes**: Modifying public module interfaces or data schemas. Requires migration scripts and version bump.
- **Architectural Changes**: Modifying core physics, simulation data flows, or monorepo workspace boundaries. Requires explicit ADR entry and approval.
- **Rollback Safety**: Every major phase package must include a verified `Rollback.md` protocol.

---

## 8. Feature Acceptance Process
1. **Idea Stage**: Logged in `99_PROJECT_MEMORY/EXPERIMENTAL_FEATURES.md`.
2. **Specification Stage**: Spec document scaffolded using `TEMPLATES/Specification_Template.md`.
3. **Review Stage**: Evaluated against [98_CANON/Player Experience Checklist.md](../98_CANON/Player%20Experience%20Checklist.md).
4. **Prototype Stage**: Built in isolated experimental module.
5. **Implementation Stage**: Code written according to GDOS spec.
6. **Verification Stage**: Verified against 10-Point AI Quality Gate.
7. **Production Stage**: Merged into main build and logged in `CONFIRMED_FEATURES.md`.
8. **Maintenance & Deprecation**: Monitored via telemetry; deprecated if superseded.

---

## 9. AI Development Rules
Antigravity IDE, Codex, and AI agents MUST follow this sequential execution protocol:
1. **Read Canon**: Review `FLOWSTATE_MASTER_GUIDE/98_CANON/`.
2. **Read Memory**: Execute [99_PROJECT_MEMORY/MEMORY_PROTOCOL.md](../99_PROJECT_MEMORY/MEMORY_PROTOCOL.md).
3. **Read Specifications**: Inspect target GDOS specifications.
4. **Inspect Repository**: Read authoritative target source code files.
5. **Implement**: Write code respecting Do-Not-Break rules.
6. **Test**: Run `npm run typecheck` and `npm test`.
7. **Benchmark**: Confirm 60 FPS and 0-byte frame allocation.
8. **Document**: Update CHANGELOG, DECISION_LOG, and LESSONS_LEARNED.
9. **Verify**: Verify 10-Point AI Quality Gate compliance.
10. **Complete**: Submit completed work package summary.

---

## 10. Master 10-Point AI Quality Gate Checklist
Every phase completion requires passing all 10 checks:
- [ ] **1. Architecture**: Decoupled tier separation; zero circular dependencies.
- [ ] **2. Performance**: Stable 60 FPS target; $< 40$ draw calls; $< 150 \text{ MB}$ RAM.
- [ ] **3. Gameplay**: Momentum conservation preserved; deterministic physics solvers intact.
- [ ] **4. UX & Aesthetics**: Tokenized CSS colors (`tokens.css`); text legibility backed by `var(--flow-text-scrim)`.
- [ ] **5. Accessibility**: Touch targets $\ge 44\times 44\text{px}$; safe-area bounds respected.
- [ ] **6. Documentation**: All GDOS specs, DECISION_LOG, and CHANGELOG updated.
- [ ] **7. Testing**: `npm run typecheck` and unit tests pass with 0 errors.
- [ ] **8. Regression**: Protected files in `Do_Not_Break_Rules.md` untouched.
- [ ] **9. Memory**: 0-byte object allocation per frame during rendering loop.
- [ ] **10. Canon Alignment**: 100% compliant with 27 Gameplay Laws and 42 Anti-Patterns.

---

## Related Core Documents
- [CODE_REVIEW_STANDARD.md](CODE_REVIEW_STANDARD.md)
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
- [PHASE_COMPLETION_CHECKLIST.md](PHASE_COMPLETION_CHECKLIST.md)
