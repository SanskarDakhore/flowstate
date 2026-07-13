// =============================================================================
// FLOWSTATE — Health Routes
// System health check endpoint — functional from day one.
// =============================================================================

import { Router, Request, Response } from 'express';

export const healthRoutes = Router();

/**
 * GET /api/v1/health
 * Returns system health status. Used for monitoring and load balancer checks.
 */
healthRoutes.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'flowstate-api',
    version: process.env.APP_VERSION || '0.1.0',
    timestamp: new Date().toISOString(),
  });
});
