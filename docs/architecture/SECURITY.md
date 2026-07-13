# Security Architecture

## Authentication
- Guest authentication (anonymous JWT)
- Token refresh mechanism
- Future: linked accounts (Google, Apple)

## Data Protection
- No secrets in repository
- Environment-based secret management
- HTTPS only in production

## Anti-Cheat
- Client scores are informational, not authoritative
- Server validates game results before leaderboard submission
- Session lifecycle tracked server-side

## API Security
- Rate limiting on all endpoints
- Input validation on all write operations
- CORS configuration
- Helmet security headers
