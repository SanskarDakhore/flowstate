# Local Development Setup

## Prerequisites
- Unity 2022.3 LTS or later
- Node.js 18+
- npm
- PostgreSQL 15+ (or Docker)
- Git

## Backend Setup
```bash
cd backend
cp ../.env.example ../.env  # Edit with your local values
npm install
npm run dev
```

## Frontend Setup
1. Open Unity Hub
2. Add project from `frontend/` directory
3. Open the Bootstrap scene

## Database Setup
TBD — depends on migration tooling selection.

## Verification
```bash
curl http://localhost:3000/api/v1/health
```
