// =============================================================================
// FLOWSTATE — Player Routes
// Player profile endpoints.
// =============================================================================

import { Router, Request, Response } from 'express';

export const playerRoutes = Router();

/**
 * GET /api/v1/player/me
 * Get the authenticated player's profile.
 */
playerRoutes.get('/me', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Player profile retrieval not yet implemented.' },
  });
});

/**
 * PATCH /api/v1/player/me
 * Update the authenticated player's profile.
 */
playerRoutes.patch('/me', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Player profile update not yet implemented.' },
  });
});
