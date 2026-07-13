import { ApplicationState } from './game-state';
import { GameEventBus } from '../events/game-event-bus';

export class GameStateMachine {
  private currentState: ApplicationState = ApplicationState.BOOTSTRAP;
  private eventBus: GameEventBus;

  constructor(eventBus: GameEventBus) {
    this.eventBus = eventBus;
  }

  public getCurrentState(): ApplicationState {
    return this.currentState;
  }

  public transitionTo(nextState: ApplicationState): void {
    if (this.currentState === nextState) {
      return;
    }

    const previousState = this.currentState;
    this.currentState = nextState;

    console.log(`[GameStateMachine] Transitioned: ${previousState} -> ${nextState}`);
  }
}
