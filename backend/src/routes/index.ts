// =============================================================================
// FLOWSTATE — Route Registration
// Central route registration for all API endpoints.
// =============================================================================

import { Application } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { playerRoutes } from './player.routes';
import { progressionRoutes } from './progression.routes';
import { leaderboardRoutes } from './leaderboard.routes';
import { cosmeticsRoutes } from './cosmetics.routes';
import { inventoryRoutes } from './inventory.routes';
import { sessionsRoutes } from './sessions.routes';
import { gameResultsRoutes } from './game-results.routes';
import { configRoutes } from './config.routes';
import { analyticsRoutes } from './analytics.routes';

const API_PREFIX = '/api/v1';

/**
 * Register all API routes on the Express application.
 */
export function registerRoutes(app: Application): void {
  app.use(`${API_PREFIX}/health`, healthRoutes);
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/player`, playerRoutes);
  app.use(`${API_PREFIX}/progression`, progressionRoutes);
  app.use(`${API_PREFIX}/leaderboards`, leaderboardRoutes);
  app.use(`${API_PREFIX}/cosmetics`, cosmeticsRoutes);
  app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
  app.use(`${API_PREFIX}/sessions`, sessionsRoutes);
  app.use(`${API_PREFIX}/game-results`, gameResultsRoutes);
  app.use(`${API_PREFIX}/config`, configRoutes);
  app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
}

