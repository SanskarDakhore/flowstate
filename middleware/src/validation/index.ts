// =============================================================================
// FLOWSTATE — Validation Middleware
// Validates request bodies and parameters against schemas.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Factory function that creates validation middleware for a given schema.
 * Schema validation library TBD (e.g., Zod, Joi, AJV).
 */
export function validationMiddleware(schema: unknown) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Validate req.body against provided schema
    // TODO: Return 400 with structured validation errors on failure

    next();
  };
}
