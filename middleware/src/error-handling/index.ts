// =============================================================================
// FLOWSTATE — Error Handling Middleware
// Standardized error response formatting.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 * Catches all errors and formats them into standardized responses.
 *
 * Must be registered LAST in the middleware chain.
 */
export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[Error] ${err.message}`, err.stack);

  const statusCode = (err as any).statusCode || 500;
  const code = (err as any).code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: {
      code,
      message: statusCode === 500 ? 'An unexpected error occurred.' : err.message,
      // requestId: (req as any).requestId,
    },
  });
}
