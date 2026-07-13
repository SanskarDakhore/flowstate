import { GameMode, SessionStatus } from '../../enums';

export interface GameplayEventPayloads {
  'session:started': { sessionId: string; mode: GameMode; timestamp: number };
  'session:ended': { sessionId: string; status: SessionStatus; finalScore: number };
  'player:moved': { positionX: number; positionY: number; velocity: number };
  'energy:collected': { amount: number; currentTotal: number };
  'combo:changed': { count: number; multiplier: number };
  'harmony:changed': { level: number; delta: number };
  'world:transformed': { stage: number; description: string };
  'game:paused': { timestamp: number };
  'game:resumed': { timestamp: number };
}

export type GameEventName = keyof GameplayEventPayloads;
