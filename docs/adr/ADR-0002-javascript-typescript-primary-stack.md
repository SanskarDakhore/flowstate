# ADR-0002: Transition to JavaScript/TypeScript Primary Stack

* **Title:** Transition to JavaScript Ecosystem & TypeScript Primary Language
* **Status:** CONFIRMED
* **Date:** 2026-07-13
* **Supersedes:** ADR-0001 (Partially — updates client frontend stack, monorepo remains)

## Context

FLOWSTATE was initially prototyped with a C#/Unity-oriented client architecture assumptions. To achieve greater ecosystem consistency across the frontend, middleware, backend, and shared contract layers, simplify build pipelines, and facilitate seamless cross-boundary data validation, the project stack has shifted to the JavaScript ecosystem with TypeScript as the preferred production language.

## Decision

1. **Primary Technology Ecosystem:** JavaScript
2. **Preferred Production Language:** TypeScript
3. **Backend Stack:** Node.js + Express + TypeScript (Preserved)
4. **Database Stack:** PostgreSQL (Preserved)
5. **Client Architecture:** Framework-neutral TypeScript architecture (`frontend/src/`) replacing Unity MonoBehaviour / C# scaffolding.
6. **Frontend Rendering Framework:** TBD (Evaluation open between Phaser, PixiJS, Three.js, Babylon.js, React Native/Expo engine container, or custom WebGL canvas architecture).
7. **Mobile Packaging Strategy:** TBD (Evaluation open for native adapters/containers).

## Rationale

* Enables unified typing across all packages via `@flowstate/shared`.
* Eliminates language context switching between frontend (formerly C#) and backend/middleware (TypeScript).
* Simplifies developer setup and CI/CD validation tools.
* Preserves product principles and server score authority.

## Consequences

* Legacy Unity `Assets/` structure and C# source files (`.cs`) are completely removed from active architecture.
* `scripts/validation/check_structure.js` and `.github/workflows/frontend-validation.yml` now validate Node.js/TypeScript frontend workspaces.
* Game rendering framework remains `TBD` until explicit selection and prototyping alignment.
