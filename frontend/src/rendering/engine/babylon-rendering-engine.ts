import { Engine, NullEngine } from '@babylonjs/core';
import { RenderingEngine } from './rendering-engine';
import { SceneFactory } from '../scene/scene-factory';
import { GameplayScene } from '../scene/gameplay-scene';

export class BabylonRenderingEngine implements RenderingEngine {
  public readonly engineName = 'BabylonRenderingEngine';
  private engine: Engine | NullEngine | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private activeScene: GameplayScene | null = null;
  private isRunning = false;
  private resizeHandler: (() => void) | null = null;

  public initialize(surface: HTMLCanvasElement): void {
    if (this.engine) {
      console.warn('[BabylonRenderingEngine] Already initialized.');
      return;
    }

    this.canvas = surface;

    // Safely check for real WebGL context support
    let webglSupported = false;
    try {
      if (surface && typeof surface.getContext === 'function') {
        const gl = surface.getContext('webgl2') || surface.getContext('webgl');
        webglSupported = !!gl;
      }
    } catch {
      webglSupported = false;
    }

    if (webglSupported) {
      this.engine = new Engine(this.canvas, true, {
        preserveDrawingBuffer: false,
        stencil: false,
        disableWebGL2Support: false,
      });
    } else {
      console.log('[BabylonRenderingEngine] WebGL context not present. Initializing NullEngine for headless environment...');
      this.engine = new NullEngine({
        renderHeight: 600,
        renderWidth: 800,
        textureSize: 512,
        deterministicLockstep: true,
        lockstepMaxSteps: 4,
      });
    }

    this.activeScene = SceneFactory.createGameplayScene(this.engine, this.canvas);

    this.resizeHandler = () => {
      this.resize();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeHandler);
    }

    console.log('[BabylonRenderingEngine] Engine & 3D scene initialized successfully.');
  }

  public start(): void {
    if (!this.engine || !this.activeScene || this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.engine.runRenderLoop(() => {
      if (this.activeScene && this.isRunning) {
        const deltaSeconds = this.engine?.getDeltaTime() ? this.engine.getDeltaTime() / 1000 : 0.016;
        this.activeScene.update(deltaSeconds);
        this.activeScene.render();
      }
    });

    console.log('[BabylonRenderingEngine] Render loop started.');
  }

  public stop(): void {
    if (!this.engine || !this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.engine.stopRenderLoop();
    console.log('[BabylonRenderingEngine] Render loop stopped.');
  }

  public resize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }

  public getActiveScene(): GameplayScene | null {
    return this.activeScene;
  }

  public isEngineRunning(): boolean {
    return this.isRunning;
  }

  public dispose(): void {
    this.stop();

    if (this.resizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.activeScene) {
      this.activeScene.dispose();
      this.activeScene = null;
    }

    if (this.engine) {
      this.engine.dispose();
      this.engine = null;
    }

    this.canvas = null;
    console.log('[BabylonRenderingEngine] Engine disposed cleanly.');
  }
}
