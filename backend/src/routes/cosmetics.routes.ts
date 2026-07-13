// =============================================================================
// FLOWSTATE — Cosmetics Routes
// =============================================================================

import { Router, Request, Response } from 'express';

export const cosmeticsRoutes = Router();

/** GET /api/v1/cosmetics */
cosmeticsRoutes.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Cosmetics listing not yet implemented.' },
  });
});
