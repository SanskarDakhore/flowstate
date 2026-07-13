import { SceneId } from './scene-id';
import { GameEventBus } from '../core/events/game-event-bus';

export class SceneRouter {
  private currentScene: SceneId = SceneId.BOOTSTRAP;
  private eventBus: GameEventBus;

  constructor(eventBus: GameEventBus) {
    this.eventBus = eventBus;
  }

  public getCurrentScene(): SceneId {
    return this.currentScene;
  }

  public loadScene(targetScene: SceneId): void {
    if (this.currentScene === targetScene) {
      return;
    }

    const previousScene = this.currentScene;
    this.currentScene = targetScene;

    console.log(`[SceneRouter] Navigating scene: ${previousScene} -> ${targetScene}`);
  }
}
