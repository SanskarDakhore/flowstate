import { GrowthController } from '../../src/game/vegetation/growth-controller';
import { createDefaultWorldInput } from '@flowstate/shared';

describe('Vegetation Growth Simulation & Blooming Engine', () => {
  let controller: GrowthController;

  beforeEach(() => {
    controller = new GrowthController();
  });

  it('should initialize with minimal default vegetation biomass', () => {
    const snap = controller.getCurrentSnapshot();
    expect(snap.growth).toBeCloseTo(0.1);
    expect(snap.bloomProgress).toBe(0.0);
    expect(snap.flowerDensity).toBe(0.0);
  });

  it('should accumulate biological health, growth, and flowers as environmental energy rises without random number generators', () => {
    const lowInput = createDefaultWorldInput();
    const snap1 = controller.update(lowInput, 1.0);
    expect(snap1.growth).toBeGreaterThan(0.0);

    const highInput = {
      ...lowInput,
      environmentEnergy: 80.0,
      harmony: 0.9,
    };

    // Update ticks to simulate biological growth
    for (let i = 0; i < 10; i++) {
      controller.update(highInput, 0.5);
    }

    const snap2 = controller.getCurrentSnapshot();
    expect(snap2.health).toBeGreaterThan(0.5);
    expect(snap2.bloomProgress).toBeGreaterThan(0.0);
    expect(snap2.flowerDensity).toBeGreaterThan(0.0);
    expect(snap2.grassHeight).toBeGreaterThan(0.5);
  });

  it('should decay bloom and biomass gracefully when environmental energy drops', () => {
    const highInput = {
      ...createDefaultWorldInput(),
      environmentEnergy: 90.0,
      harmony: 1.0,
    };

    for (let i = 0; i < 10; i++) {
      controller.update(highInput, 0.5);
    }
    const peakBloom = controller.getCurrentSnapshot().bloomProgress;
    expect(peakBloom).toBeGreaterThan(0.0);

    // Energy drops
    const zeroInput = createDefaultWorldInput();
    for (let i = 0; i < 10; i++) {
      controller.update(zeroInput, 0.5);
    }

    const decayedBloom = controller.getCurrentSnapshot().bloomProgress;
    expect(decayedBloom).toBeLessThan(peakBloom);
  });
});
