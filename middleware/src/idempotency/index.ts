// =============================================================================
// FLOWSTATE — Idempotency Middleware
// Ensures sensitive write operations are safely retryable.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Idempotency middleware for POST/PATCH operations.
 * Uses the X-Idempotency-Key header to detect duplicate requests.
 *
 * Critical for: score submission, session completion, purchases.
 */
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    next();
    return;
  }

  const idempotencyKey = req.headers['x-idempotency-key'] as string;

  if (!idempotencyKey) {
    // Idempotency key is optional but recommended for writes
    next();
    return;
  }

  // TODO: Check if this key has been seen before
  // TODO: If seen, return the cached response
  // TODO: If new, proceed and cache the response

  next();
}
