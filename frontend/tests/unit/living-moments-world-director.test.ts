import { WorldDirector } from '../../src/game/experience/world-director';
import { WorldStateEnum, WorldStateSnapshot, createDefaultPresentationSnapshot, createDefaultWeatherState, createDefaultVegetationGrowthState, createDefaultWildlifeState, createDefaultWorldEventState } from '@flowstate/shared';

describe('Living Moments Bible & World Director Architecture', () => {
  let worldDirector: WorldDirector;

  beforeEach(() => {
    worldDirector = new WorldDirector();
  });

  it('should orchestrate timing alignment holding breeze during blooming moments', () => {
    const mockWorldState: WorldStateSnapshot = {
      currentState: WorldStateEnum.BLOOMING,
      targetState: WorldStateEnum.BLOOMING,
      transitionProgress: 1.0,
      energyBuffer: 80,
      growthWeight: 0.8,
      vegetationWeight: 0.9,
      weatherWeight: 0.5,
      musicWeight: 0.8,
      wildlifeWeight: 0.9,
      weatherState: createDefaultWeatherState(),
      vegetationState: { ...createDefaultVegetationGrowthState(), growth: 0.85 }, // High bloom!
      wildlifeState: createDefaultWildlifeState(),
      eventState: createDefaultWorldEventState(),
      timestamp: Date.now(),
    };

    const { harmonics } = worldDirector.conductWorldPerformance(
      mockWorldState,
      createDefaultPresentationSnapshot(),
      0.5, // Midday
      0.016
    );

    expect(harmonics.breezeHoldActive).toBe(true); // World Director held breeze for petal drift!
  });

  it('should evoke sacred dusk fireflies when day progress enters dusk (0.8) without UI notifications', () => {
    const mockDuskState: WorldStateSnapshot = {
      currentState: WorldStateEnum.BLOOMING,
      targetState: WorldStateEnum.BLOOMING,
      transitionProgress: 1.0,
      energyBuffer: 80,
      growthWeight: 0.8,
      vegetationWeight: 0.9,
      weatherWeight: 0.5,
      musicWeight: 0.8,
      wildlifeWeight: 0.9,
      weatherState: createDefaultWeatherState(),
      vegetationState: { ...createDefaultVegetationGrowthState(), growth: 0.8 },
      wildlifeState: createDefaultWildlifeState(),
      eventState: createDefaultWorldEventState(),
      timestamp: Date.now(),
    };

    const { experience, harmonics } = worldDirector.conductWorldPerformance(
      mockDuskState,
      createDefaultPresentationSnapshot(),
      0.8, // Dusk
      0.016
    );

    expect(experience.mood).toBe('joyful');
    expect(harmonics.duskFireflyDensity).toBeGreaterThan(0.0); // Fireflies emerged naturally at dusk!
  });
});
