# Testing Strategy

## Frontend (`frontend/tests/`)
- Unit tests in `frontend/tests/unit/` using Jest / ts-jest
- Integration & gameplay loop tests in `frontend/tests/integration/`
- Run with `npm test --workspace=frontend`

## Backend (`backend/tests/`)
- Unit tests in `backend/tests/unit/`
- Integration tests in `backend/tests/integration/`
- E2E tests in `backend/tests/e2e/`
- Run with `npm test --workspace=backend`

## Middleware (`middleware/tests/`)
- Unit tests for application logic in `middleware/tests/`
- Run with `npm test --workspace=middleware`

## Shared Contracts (`shared/`)
- Type verification via `npm run typecheck --workspace=shared`

## Monorepo Workflow
- Run all tests across workspaces: `npm test`
- Run structural check: `npm run validate`
