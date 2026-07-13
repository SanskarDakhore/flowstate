# Session

Game session lifecycle management.

## Responsibility

- Manage the start, pause, resume, and end of gameplay sessions
- Track session duration and statistics
- Coordinate session data for results and server submission

## Rules

- Sessions are the atomic unit of gameplay
- Session start/end are critical events for analytics, scoring, and persistence
- Session data must be preserved even if the app is backgrounded
