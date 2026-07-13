export interface SessionTelemetryPoint {
  timestampDeltaMs: number;
  inputEventType: string;
  positionX: number;
  positionY: number;
}

export interface GameplaySessionSummary {
  sessionId: string;
  gameMode: string;
  durationMs: number;
  finalScore: number;
  harmonyLevel: number;
  maxCombo: number;
  energyCollectedCount: number;
}
