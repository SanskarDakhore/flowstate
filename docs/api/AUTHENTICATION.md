# Authentication

## Strategy
JWT-based authentication with guest accounts.

## Flow
1. Client calls `POST /api/v1/auth/guest` to create anonymous account
2. Server returns access token + refresh token
3. Client includes `Authorization: Bearer <token>` on subsequent requests
4. Client calls `POST /api/v1/auth/refresh` before token expiry

## Future
- Link guest account to Google/Apple ID
- Account merge on re-login
