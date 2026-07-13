# Authentication

Client-side authentication service.

## Responsibility
- Guest authentication (initial anonymous login)
- Token storage and refresh
- Auth state management

## Rules
- Auth tokens are stored securely using platform APIs
- Token refresh should happen transparently before expiry
- Gameplay must work without auth for offline play
