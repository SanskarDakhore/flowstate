import { Router, Request, Response } from 'express';

export const analyticsRoutes = Router();

/**
 * POST /api/v1/analytics
 * Ingest analytics events.
 */
analyticsRoutes.post('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Analytics ingestion not yet implemented.' },
  });
});

