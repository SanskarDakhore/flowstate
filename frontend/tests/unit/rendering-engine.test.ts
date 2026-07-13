import { BabylonRenderingEngine } from '../../src/rendering/engine/babylon-rendering-engine';
import { EnvironmentView } from '../../src/rendering/environment/environment-view';

describe('BabylonRenderingEngine Lifecycle & Presentation Adapters Unit Tests', () => {
  let engine: BabylonRenderingEngine;

  beforeEach(() => {
    engine = new BabylonRenderingEngine();
  });

  afterEach(() => {
    engine.dispose();
  });

  it('should initialize, start, stop, resize, and dispose cleanly', () => {
    // Mock canvas
    const canvas = document.createElement('canvas');

    engine.initialize(canvas);
    expect(engine.getActiveScene()).toBeDefined();

    engine.start();
    expect(engine.isEngineRunning()).toBe(true);

    engine.stop();
    expect(engine.isEngineRunning()).toBe(false);

    // Multiple start/stop calls should not throw or duplicate
    engine.start();
    engine.start();
    expect(engine.isEngineRunning()).toBe(true);

    engine.resize();
    engine.dispose();

    expect(engine.getActiveScene()).toBeNull();
    expect(engine.isEngineRunning()).toBe(false);
  });

  it('should clamp harmony values strictly between 0.0 and 1.0 in WorldPresentation adapter', () => {
    const canvas = document.createElement('canvas');
    engine.initialize(canvas);
    const activeScene = engine.getActiveScene()!;

    const envView = activeScene.environmentView;

    envView.setHarmonyLevel(-0.5);
    expect(envView.getHarmonyLevel()).toBe(0.0);

    envView.setHarmonyLevel(1.5);
    expect(envView.getHarmonyLevel()).toBe(1.0);

    envView.setHarmonyLevel(0.75);
    expect(envView.getHarmonyLevel()).toBe(0.75);
  });

  it('should synchronize player view position correctly in PlayerView adapter', () => {
    const canvas = document.createElement('canvas');
    engine.initialize(canvas);
    const activeScene = engine.getActiveScene()!;

    const playerView = activeScene.playerView;
    playerView.setPosition(10, 2.5, -5);

    const pos = playerView.getPosition();
    expect(pos.x).toBe(10);
    expect(pos.y).toBe(2.5);
    expect(pos.z).toBe(-5);
  });
});
