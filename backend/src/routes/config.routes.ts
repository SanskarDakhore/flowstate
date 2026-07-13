// =============================================================================
// FLOWSTATE — Config Routes
// Remote configuration endpoint.
// =============================================================================

import { Router, Request, Response } from 'express';

export const configRoutes = Router();

/** GET /api/v1/config */
configRoutes.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Remote config not yet implemented.' },
  });
});
