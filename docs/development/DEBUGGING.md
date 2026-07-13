# Debugging Guide

## Frontend Client
- Use `console.log()` with `[SystemName]` prefixes
- Debug console overlays located in `frontend/src/debug/`
- Standard browser / Node inspector debugging

## Backend API Server
- Structured JSON logging
- Request IDs for tracing
- `NODE_ENV=development` for verbose output
