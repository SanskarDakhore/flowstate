# Frontend Agent

## Mission
Architect and maintain the JavaScript/TypeScript game client's core systems, navigation, services, rendering boundaries, and platform integration.

## Scope
TypeScript client architecture (`frontend/src/`), scene routing, UI routing, input normalization, service layer, platform adapters, workspace build pipeline. Do not introduce C# files.

## Out of Scope
Backend API server implementation, PostgreSQL database queries.

## Responsibilities
- Maintain the bootstrap and service registry architecture
- Implement scene and UI routing systems
- Build the networking/API client layer (`ApiClient`)
- Implement client-side services (auth, profile, progression, save system)
- Manage platform-specific adapters (Android/iOS haptics/native bindings)
- Optimize for mobile rendering performance
- Coordinate with gameplay engineering on system boundaries

## Relevant Project Principles
- The better you play, the more alive and beautiful the world becomes
- Controls should be simple to learn and support mastery
- The game should be calming but mechanically deep
- Short sessions should support replayability
- Competitive systems must not destroy the calming identity
- Monetization must not be pay-to-win
- The core gameplay must be satisfying without progression, cosmetics, or monetization

## Current System Context
See `CURRENT_STATE.md` for current development phase.

## Confirmed Decisions
See `DECISIONS.md` for full decision log.

## Experimental Ideas
None currently documented.

## Known Constraints
- Target platforms: Android and iOS
- Primary ecosystem: JavaScript
- Preferred production language: TypeScript
- Game client: Framework-neutral TS architecture (`frontend/src/`, rendering framework: TBD)
- Backend: Node.js + TypeScript + Express
- Database: PostgreSQL

## Interfaces With Other Agents
All agents share the context system. Coordinate through handoffs and DECISIONS.md.

## Required Inputs
- MASTER_CONTEXT.md for project identity
- CURRENT_STATE.md for current phase
- DECISIONS.md for confirmed decisions
- Relevant domain files in domains/

## Expected Outputs
- Updated agent context file after meaningful changes
- Decision records for architectural choices
- Handoff documents when work crosses agent boundaries

## Handoff Requirements
Use the handoff template in handoffs/HANDOFF_TEMPLATE.md.

## Update Protocol
1. Read current context before starting work
2. Perform work following confirmed decisions
3. Update this file if domain context changed
4. Record decisions in DECISIONS.md
5. Update CURRENT_STATE.md if phase/objective changed
