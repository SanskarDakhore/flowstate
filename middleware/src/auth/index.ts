// =============================================================================
// FLOWSTATE — Auth Middleware
// Verifies JWT tokens and attaches user context to requests.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that verifies JWT authentication tokens.
 * Extracts user identity and attaches it to the request context.
 *
 * Routes that don't require auth should bypass this middleware.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authentication token.',
      },
    });
    return;
  }

  const token = authHeader.substring(7);

  // TODO: Verify JWT token
  // TODO: Extract user ID and attach to request context
  // TODO: Check token expiration

  next();
}
