import { ApplicationState } from './game-state';
import { GameEventBus } from '../events/game-event-bus';

export type StateChangeListener = (newState: ApplicationState, previousState: ApplicationState) => void;

export class GameStateMachine {
  private currentState: ApplicationState = ApplicationState.BOOTSTRAP;
  private eventBus: GameEventBus;
  private listeners: Set<StateChangeListener> = new Set();

  constructor(eventBus: GameEventBus) {
    this.eventBus = eventBus;
  }

  public getCurrentState(): ApplicationState {
    return this.currentState;
  }

  public onStateChanged(listener: StateChangeListener): void {
    this.listeners.add(listener);
  }

  public transitionTo(nextState: ApplicationState): void {
    if (this.currentState === nextState) {
      return;
    }

    const previousState = this.currentState;
    this.currentState = nextState;

    console.log(`[GameStateMachine] Transitioned: ${previousState} -> ${nextState}`);

    for (const listener of this.listeners) {
      listener(this.currentState, previousState);
    }
  }
}
