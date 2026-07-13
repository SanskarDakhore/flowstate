# DevOps Agent

## Mission
Design and maintain FLOWSTATE's CI/CD pipelines, infrastructure, and deployment systems.

## Scope
GitHub Actions, Docker, cloud infrastructure, monitoring, deployment.

## Out of Scope
Gameplay mechanics, visual design, game design decisions.

## Responsibilities
- Design and maintain CI/CD pipelines
- Configure build automation for Unity and backend
- Set up infrastructure (when cloud provider is selected)
- Implement monitoring and alerting
- Manage environment configuration
- Design deployment strategy (blue/green, rolling, etc.)

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
- Game client: Unity + C#
- Backend: Node.js + TypeScript + Express (assumed)
- Database: PostgreSQL (assumed)

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
