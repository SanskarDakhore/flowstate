# Context — AI Agent Knowledge System

This directory maintains persistent project knowledge for AI coding agents and human developers.

## Purpose

The context system provides structured, distilled project knowledge so any new developer or AI agent can understand the project's current state, confirmed decisions, and architectural boundaries without reading the entire codebase.

## Structure

| File | Purpose |
|------|---------|
| `MASTER_CONTEXT.md` | Stable project identity, vision, principles |
| `CURRENT_STATE.md` | Current development phase and status |
| `DECISIONS.md` | Architectural and design decision log |
| `OPEN_QUESTIONS.md` | Unresolved questions requiring decisions |
| `CHANGELOG.md` | Context-specific change log |
| `agents/` | Individual AI agent context files |
| `domains/` | Domain-specific knowledge files |
| `handoffs/` | Agent-to-agent handoff documents |
| `archive/` | Archived context no longer actively used |

## Protocol for AI Agents

### 1. Read Context First
Before starting any task, read:
1. `MASTER_CONTEXT.md` — understand the project identity
2. `CURRENT_STATE.md` — understand what phase we're in
3. `DECISIONS.md` — understand what's been decided
4. Your agent-specific file in `agents/`
5. Relevant domain files in `domains/`

### 2. Perform Work
Execute your task following confirmed decisions and project principles.

### 3. Update State
After meaningful changes, update:
- `CURRENT_STATE.md` — if phase/objective changed
- Your agent file — if your domain context changed
- Relevant domain files — if domain knowledge changed

### 4. Record Decisions
When you make or identify an architectural decision, add it to `DECISIONS.md`.

### 5. Create Handoffs
When work needs to continue in another agent's domain, create a handoff document in `handoffs/`.

## Rules

- Context is documentation, NOT runtime configuration
- Do not treat experimental ideas as confirmed decisions
- Keep files concise — distilled knowledge, not conversation dumps
- Update regularly — stale context is worse than no context
