import { PlayerState, MovementModelId } from './movement-types';
import { MovementIntent } from './movement-intent';

export interface MovementModel {
  readonly id: MovementModelId;

  initialize(initialState: PlayerState): void;

  update(
    state: PlayerState,
    intent: MovementIntent,
    deltaTime: number
  ): PlayerState;

  reset(): void;
}
