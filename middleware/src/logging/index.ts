// =============================================================================
// FLOWSTATE — Logging Middleware
// Structured request/response logging.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Logs incoming requests and outgoing responses.
 * Uses structured JSON format for log aggregation.
 */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      // requestId: (req as any).requestId,
    }));
  });

  next();
}
