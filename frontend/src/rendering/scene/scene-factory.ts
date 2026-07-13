import { Engine } from '@babylonjs/core';
import { GameplayScene } from './gameplay-scene';

export class SceneFactory {
  public static createGameplayScene(engine: Engine, canvas: HTMLCanvasElement): GameplayScene {
    return new GameplayScene(engine, canvas);
  }
}
