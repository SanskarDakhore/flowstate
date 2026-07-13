// =============================================================================
// FLOWSTATE — Authorization Middleware
// Checks user permissions for protected resources.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Factory function for authorization checks.
 * Verifies the authenticated user has the required permissions.
 */
export function authorizationMiddleware(requiredRole?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Check user role/permissions from request context
    // TODO: Return 403 if insufficient permissions

    next();
  };
}
