import { PerformanceController } from '../../src/game/performance/performance-controller';
import { QualityTier } from '@flowstate/shared';

describe('Adaptive Performance Intelligence (API)', () => {
  let controller: PerformanceController;

  beforeEach(() => {
    controller = new PerformanceController();
  });

  it('should initialize with High quality tier during nominal 60 FPS operations', () => {
    const { state, multipliers } = controller.update(60, 60);
    expect(state.qualityTier).toBe(QualityTier.High);
    expect(multipliers.internalRenderScale).toBe(1.0);
    expect(multipliers.particleDensity).toBe(0.8); // Particles pruned slightly first
  });

  it('should apply 60-frame hysteresis before dropping quality tier on sustained low FPS', () => {
    // 1. Single slow frame should NOT drop quality tier (anti-oscillation)
    controller.update(30, 60);
    expect(controller.update(30, 60).state.qualityTier).toBe(QualityTier.High);

    // 2. 60 sustained slow frames -> drops to Medium tier
    for (let i = 0; i < 60; i++) {
      controller.update(30, 60);
    }
    const { state, multipliers } = controller.update(30, 60);
    expect(state.qualityTier).toBe(QualityTier.Medium);

    // Order check: Particle and grass density scaled back, internal resolution remains 1.0 crisp
    expect(multipliers.particleDensity).toBeLessThan(0.8);
    expect(multipliers.internalRenderScale).toBe(1.0);
  });

  it('should preserve internal render resolution until Minimal quality tier is reached', () => {
    // Force drop to Minimal tier
    for (let i = 0; i < 300; i++) {
      controller.update(20, 60);
    }

    const { state, multipliers } = controller.update(20, 60);
    expect(state.qualityTier).toBe(QualityTier.Minimal);
    expect(multipliers.internalRenderScale).toBeLessThan(1.0); // Resolution pruned last as ultimate safety net
  });
});
