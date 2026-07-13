// =============================================================================
// FLOWSTATE — Request Context Middleware
// Attaches request ID, timestamps, and user context to each request.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Attaches a unique request ID and timestamp to every request.
 * Enables request tracing across logs and systems.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string || randomUUID();

  // Attach to response headers for client correlation
  res.setHeader('X-Request-Id', requestId);

  // TODO: Attach to request object for downstream use
  // (req as any).requestId = requestId;
  // (req as any).requestTimestamp = Date.now();

  next();
}
