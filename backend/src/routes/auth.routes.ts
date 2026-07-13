// =============================================================================
// FLOWSTATE — Auth Routes
// Authentication endpoints for guest login and token refresh.
// =============================================================================

import { Router, Request, Response } from 'express';

export const authRoutes = Router();

/**
 * POST /api/v1/auth/guest
 * Create a guest account and return auth tokens.
 */
authRoutes.post('/guest', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Guest authentication not yet implemented.' },
  });
});

/**
 * POST /api/v1/auth/refresh
 * Refresh an expired access token using a refresh token.
 */
authRoutes.post('/refresh', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Token refresh not yet implemented.' },
  });
});
