# Local Development Setup

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+ (or Docker)
- Git

## Monorepo Setup
```bash
# 1. Install workspace dependencies
npm install

# 2. Typecheck all packages (shared, middleware, backend, frontend)
npm run typecheck

# 3. Build workspaces
npm run build

# 4. Run workspace tests
npm run test

# 5. Run structure validation
npm run validate
```

## Running Backend Locally
```bash
cp .env.example .env  # Edit local environment values
npm run dev --workspace=backend
```

## Running Frontend Locally
```bash
npm run dev --workspace=frontend
```

## Verification
```bash
curl http://localhost:3000/api/v1/health
```
