// =============================================================================
// FLOWSTATE — API Response Contract
// Standardized API response wrapper.
// =============================================================================

/**
 * Standard successful API response.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

/**
 * Standard error API response.
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  };
}

/**
 * Player identity in API responses.
 */
export interface PlayerIdentity {
  id: string;
  displayName: string | null;
  avatarId: string | null;
}

/**
 * Game session lifecycle.
 */
export interface SessionStartRequest {
  mode: string;
}

export interface SessionStartResponse {
  sessionId: string;
  startedAt: string;
}

export interface SessionCompleteRequest {
  clientScore: number;
  clientMaxCombo: number;
  clientMaxHarmony: number;
  clientEnergyCollected: number;
  clientDurationSeconds: number;
  // Additional validation data TBD
}

/**
 * Game result submission.
 */
export interface GameResultResponse {
  resultId: string;
  validatedScore: number;
  isValidated: boolean;
  leaderboardUpdated: boolean;
}

/**
 * Leaderboard entry.
 */
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  score: number;
  achievedAt: string;
}

/**
 * Remote configuration values.
 */
export interface RemoteConfigResponse {
  version: string;
  features: {
    leaderboards: boolean;
    cosmetics: boolean;
    analytics: boolean;
  };
  gameplay: {
    baseSpeed: number;
    comboExpiryMs: number;
    harmonyThreshold: number;
  };
}

