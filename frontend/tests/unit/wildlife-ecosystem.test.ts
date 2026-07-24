import { WildlifeController } from '../../src/game/wildlife/wildlife-controller';
import { createDefaultWorldInput } from '@flowstate/shared';

describe('Wildlife Ecosystem Simulation', () => {
  let controller: WildlifeController;

  beforeEach(() => {
    controller = new WildlifeController();
  });

  it('should initialize with dormant wildlife population', () => {
    const snap = controller.getCurrentSnapshot();
    expect(snap.populationDensity).toBe(0.0);
    expect(snap.activityLevel).toBe(0.0);
    expect(snap.activeSpeciesCount).toBe(0);
  });

  it('should scale wildlife population and flock cohesion as environmental energy rises without random number generators', () => {
    const highInput = {
      ...createDefaultWorldInput(),
      environmentEnergy: 80.0,
      growthPotential: 0.9,
      harmony: 0.95,
    };

    for (let i = 0; i < 10; i++) {
      controller.update(highInput, 0.5);
    }

    const snap = controller.getCurrentSnapshot();
    expect(snap.populationDensity).toBeGreaterThan(0.2);
    expect(snap.flockCohesion).toBeGreaterThan(0.8);
    expect(snap.activityLevel).toBeGreaterThan(0.2);
    expect(snap.activeSpeciesCount).toBeGreaterThanOrEqual(1);
  });
});
