# System Architecture

## Overview
FLOWSTATE uses a monorepo architecture with clean separation between frontend (Unity), backend (Node.js), and shared contracts.

## High-Level Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Unity Client   │────▶│  Express API     │────▶│  PostgreSQL  │
│  (Android/iOS)  │◀────│  (Node.js/TS)    │◀────│  Database    │
└─────────────────┘     └──────────────────┘     └──────────────┘
        │                        │
        ▼                        ▼
  Local Storage           Middleware Layer
  (Offline Play)          (Auth, Validation,
                           Rate Limiting)
```

## Dependency Rules

```
Frontend Gameplay Core → (no external dependencies)
Frontend Services → Backend API Contracts
Backend Routes → Controllers → Services → Repositories → Database
Middleware → (cross-cutting concerns, no business logic)
```

## Key Principles
- Gameplay works offline
- Server is authoritative for competitive data
- Presentation does not own game rules
- Modular monolith, not microservices
