# API Overview

## Base URL
```
/api/v1/
```

## Endpoints

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| GET | /health | System health check | ✅ Functional |
| POST | /auth/guest | Guest authentication | 501 |
| POST | /auth/refresh | Token refresh | 501 |
| GET | /player/me | Get player profile | 501 |
| PATCH | /player/me | Update profile | 501 |
| GET | /progression | Get progression | 501 |
| GET | /inventory | Get inventory | 501 |
| GET | /cosmetics | List cosmetics | 501 |
| POST | /sessions/start | Start session | 501 |
| POST | /sessions/:id/complete | Complete session | 501 |
| POST | /game-results | Submit results | 501 |
| GET | /leaderboards/:id | Get leaderboard | 501 |
| GET | /leaderboards/:id/me | My position | 501 |
| GET | /config | Remote config | 501 |
| POST | /analytics | Ingest analytics events | 501 |


## Authentication
Bearer token in Authorization header. See `AUTHENTICATION.md`.

## Errors
Standardized error format. See `ERROR_FORMAT.md`.
