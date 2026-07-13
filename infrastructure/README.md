# Infrastructure

## Status
**Cloud provider: TBD** — No infrastructure has been provisioned.

## Structure
- `docker/` — Docker configurations for local and deployment
- `local/` — Local development infrastructure (Docker Compose, etc.)
- `cloud/` — Cloud provider configurations (TBD)
- `monitoring/` — Monitoring and alerting setup
- `logging/` — Log aggregation configuration
- `deployment/` — Deployment scripts and configurations

## Rules
- Do not commit cloud credentials
- Document all infrastructure decisions in `context/DECISIONS.md`
- Test infrastructure changes in staging before production
