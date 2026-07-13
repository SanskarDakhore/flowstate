// =============================================================================
// FLOWSTATE — Progression Routes
// =============================================================================

import { Router, Request, Response } from 'express';

export const progressionRoutes = Router();

/** GET /api/v1/progression */
progressionRoutes.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Progression retrieval not yet implemented.' },
  });
});
