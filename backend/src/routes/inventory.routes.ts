// =============================================================================
// FLOWSTATE — Inventory Routes
// =============================================================================

import { Router, Request, Response } from 'express';

export const inventoryRoutes = Router();

/** GET /api/v1/inventory */
inventoryRoutes.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Inventory retrieval not yet implemented.' },
  });
});
