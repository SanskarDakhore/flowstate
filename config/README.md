# Configuration

## Structure
- `environments/` — Per-environment configuration
- `feature-flags/` — Feature flag definitions

## Environments
- **development** — Local development
- **staging** — Pre-production testing
- **production** — Live environment

## Rules
- Never commit secrets
- Use `.env.example` as the template
- Environment-specific overrides in `environments/`
