// =============================================================================
// FLOWSTATE — Leaderboard Routes
// =============================================================================

import { Router, Request, Response } from 'express';

export const leaderboardRoutes = Router();

/** GET /api/v1/leaderboards/:boardId */
leaderboardRoutes.get('/:boardId', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Leaderboard retrieval not yet implemented.' },
  });
});

/** GET /api/v1/leaderboards/:boardId/me */
leaderboardRoutes.get('/:boardId/me', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Player leaderboard position not yet implemented.' },
  });
});
