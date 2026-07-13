import { BootstrapConfig, defaultBootstrapConfig } from './bootstrap-config';
import { GameContext } from '../architecture/game-context';
import { ApplicationState } from '../state-machine/game-state';

export class GameBootstrap {
  private config: BootstrapConfig;
  private context: GameContext;
  private isInitialized = false;

  constructor(config: BootstrapConfig = defaultBootstrapConfig) {
    this.config = config;
    this.context = new GameContext();
  }

  public async initialize(surface?: HTMLCanvasElement): Promise<GameContext> {
    if (this.isInitialized) {
      return this.context;
    }

    console.log(`[GameBootstrap] Initializing FLOWSTATE client in ${this.config.environment} mode...`);

    // 1. Initialize Event Bus & State Machine
    this.context.stateMachine.transitionTo(ApplicationState.BOOTSTRAP);

    // 2. Register core services
    this.context.haptics.initialize();
    this.context.audio.initialize();

    // 3. Initialize 3D Rendering Engine if canvas surface is provided
    if (surface) {
      this.context.renderingEngine.initialize(surface);
      this.context.renderingEngine.start();
    }

    // 4. Complete bootstrap state transition
    this.isInitialized = true;
    this.context.stateMachine.transitionTo(ApplicationState.MAIN_MENU);

    console.log('[GameBootstrap] Initialization complete.');
    return this.context;
  }

  public getContext(): GameContext {
    return this.context;
  }
}
