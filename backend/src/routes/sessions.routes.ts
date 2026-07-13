// =============================================================================
// FLOWSTATE — Sessions Routes
// Game session lifecycle endpoints.
// =============================================================================

import { Router, Request, Response } from 'express';

export const sessionsRoutes = Router();

/** POST /api/v1/sessions/start */
sessionsRoutes.post('/start', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Session start not yet implemented.' },
  });
});

/** POST /api/v1/sessions/:sessionId/complete */
sessionsRoutes.post('/:sessionId/complete', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Session completion not yet implemented.' },
  });
});
