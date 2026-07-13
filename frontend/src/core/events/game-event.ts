import { GameplayEventPayloads, GameEventName } from '@flowstate/shared';

export interface GameEvent<K extends GameEventName = GameEventName> {
  type: K;
  payload: GameplayEventPayloads[K];
  timestamp: number;
}
