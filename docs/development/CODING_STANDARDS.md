# Coding Standards

## TypeScript / JavaScript (Frontend, Middleware, Backend, Shared)
- 2-space indentation
- `kebab-case.ts` for file names
- `camelCase` for functions, methods, and variables
- `PascalCase` for types, interfaces, enums, and classes
- `UPPER_SNAKE_CASE` for true constants
- Strict TypeScript mode enabled across all workspaces (`noImplicitAny`, `strictNullChecks`)
- Prefer discriminated unions, explicit interfaces, and small composable modules over complex inheritance chains
- Shared cross-boundary contracts belong in `@flowstate/shared`

## General
- No magic numbers — use named constants
- No commented-out code in committed files
- Prefer explicit dependencies over global singletons
