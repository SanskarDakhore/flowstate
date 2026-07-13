import { GameMode } from '../../enums';

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  version: string;
}

export interface PlayerProfileContract {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartSessionRequestContract {
  gameMode: GameMode;
  clientTimestamp: number;
}

export interface StartSessionResponseContract {
  sessionId: string;
  serverTimestamp: number;
  config: {
    initialMultiplier: number;
  };
}

export interface SubmitGameResultsRequestContract {
  sessionId: string;
  score: number;
  durationSeconds: number;
  harmonyAchieved: number;
  maxCombo: number;
  telemetryChecksum?: string;
}

export interface SubmitGameResultsResponseContract {
  sessionId: string;
  verified: boolean;
  score: number;
  rank?: number;
  newHighScore: boolean;
}
