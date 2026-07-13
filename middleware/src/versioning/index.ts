// =============================================================================
// FLOWSTATE — Versioning Middleware
// Detects and routes API version from request headers or URL.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * API versioning middleware.
 * Currently FLOWSTATE uses URL-based versioning (/api/v1/).
 * This middleware extracts the version for downstream use.
 */
export function versioningMiddleware(req: Request, res: Response, next: NextFunction): void {
  // URL-based versioning is handled by route registration
  // This middleware can be extended for header-based versioning

  // Extract version from URL pattern /api/v{N}/
  const versionMatch = req.path.match(/\/api\/v(\d+)\//);
  if (versionMatch) {
    // TODO: Attach API version to request context
    // (req as any).apiVersion = parseInt(versionMatch[1], 10);
  }

  next();
}
