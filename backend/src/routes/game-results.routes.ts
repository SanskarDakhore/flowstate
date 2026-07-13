// =============================================================================
// FLOWSTATE — Game Results Routes
// Score and result submission endpoint.
// =============================================================================

import { Router, Request, Response } from 'express';

export const gameResultsRoutes = Router();

/**
 * POST /api/v1/game-results
 * Submit game results for server validation.
 * NOTE: Server MUST validate scores — client data is not authoritative.
 */
gameResultsRoutes.post('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Game result submission not yet implemented.' },
  });
});
