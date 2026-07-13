// =============================================================================
// FLOWSTATE — Express Application Setup
// Configures Express with middleware and routes.
// =============================================================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from './routes';

/**
 * Create and configure the Express application.
 * Separated from server.ts to enable testing without starting the HTTP server.
 */
export function createApp(): Application {
  const app = express();

  // --- Security ---
  app.use(helmet());

  // --- CORS ---
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
  }));

  // --- Body Parsing ---
  app.use(express.json({ limit: '1mb' }));

  // --- Request Logging ---
  // TODO: Add logging middleware from middleware package

  // --- Request Context ---
  // TODO: Add request context middleware

  // --- Routes ---
  registerRoutes(app);

  // --- Error Handling ---
  // TODO: Add error handler middleware (must be last)

  return app;
}
