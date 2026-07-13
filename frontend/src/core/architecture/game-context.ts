import { ServiceRegistry } from './service-registry';
import { GameEventBus } from '../events/game-event-bus';
import { GameStateMachine } from '../state-machine/game-state-machine';
import { SceneRouter } from '../../scenes/scene-router';
import { UIRouter } from '../../ui/navigation/ui-router';
import { ApiClient } from '../../networking/api-client';
import { AudioManager } from '../../audio/audio-manager';
import { HapticsService } from '../../haptics/haptics-service';
import { BabylonRenderingEngine } from '../../rendering/engine/babylon-rendering-engine';

export class GameContext {
  public readonly services: ServiceRegistry;
  public readonly eventBus: GameEventBus;
  public readonly stateMachine: GameStateMachine;
  public readonly sceneRouter: SceneRouter;
  public readonly uiRouter: UIRouter;
  public readonly apiClient: ApiClient;
  public readonly audio: AudioManager;
  public readonly haptics: HapticsService;
  public readonly renderingEngine: BabylonRenderingEngine;

  constructor() {
    this.services = new ServiceRegistry();
    this.eventBus = new GameEventBus();
    this.stateMachine = new GameStateMachine(this.eventBus);
    this.sceneRouter = new SceneRouter(this.eventBus);
    this.uiRouter = new UIRouter(this.eventBus);
    this.apiClient = new ApiClient();
    this.audio = new AudioManager();
    this.haptics = new HapticsService();
    this.renderingEngine = new BabylonRenderingEngine();

    // Register primary services
    this.services.register(this.audio);
    this.services.register(this.haptics);
  }
}
