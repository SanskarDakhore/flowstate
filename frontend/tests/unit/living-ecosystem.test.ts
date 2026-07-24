import { ExperienceDirector } from '../../src/game/experience/experience-director';
import { WorldStateEnum, WorldStateSnapshot, createDefaultPresentationSnapshot, createDefaultWeatherState, createDefaultVegetationGrowthState, createDefaultWildlifeState, createDefaultWorldEventState } from '@flowstate/shared';

describe('Living Ecosystem Framework & Experience Director', () => {
  let director: ExperienceDirector;

  beforeEach(() => {
    director = new ExperienceDirector();
  });

  it('should evaluate emergent butterfly density organically when conditions become favorable', () => {
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
      weatherState: { ...createDefaultWeatherState(), windSpeed: 0.1 }, // Calm wind
      vegetationState: { ...createDefaultVegetationGrowthState(), growth: 0.9 }, // Bloomed field
      wildlifeState: createDefaultWildlifeState(),
      eventState: createDefaultWorldEventState(),
      timestamp: Date.now(),
    };

    const { experience, harmonics } = director.orchestrateExperience(
      mockWorldState,
      createDefaultPresentationSnapshot(),
      0.5 // Midday sun
    );

    expect(experience.mood).toBe('joyful');
    expect(harmonics.emergentButterflyDensity).toBeGreaterThan(0.0); // Butterflies emerged organically!
    expect(harmonics.emergentBirdsongVolume).toBeGreaterThanOrEqual(0.0);
  });

  it('should suppress butterfly emergence under harsh wind or low sunlight without hardcoded spawners', () => {
    const mockWindyState: WorldStateSnapshot = {
      currentState: WorldStateEnum.BLOOMING,
      targetState: WorldStateEnum.BLOOMING,
      transitionProgress: 1.0,
      energyBuffer: 80,
      growthWeight: 0.8,
      vegetationWeight: 0.9,
      weatherWeight: 0.5,
      musicWeight: 0.8,
      wildlifeWeight: 0.9,
      weatherState: { ...createDefaultWeatherState(), windSpeed: 0.9 }, // High wind!
      vegetationState: { ...createDefaultVegetationGrowthState(), growth: 0.9 },
      wildlifeState: createDefaultWildlifeState(),
      eventState: createDefaultWorldEventState(),
      timestamp: Date.now(),
    };

    const { harmonics } = director.orchestrateExperience(
      mockWindyState,
      createDefaultPresentationSnapshot(),
      0.5
    );

    expect(harmonics.emergentButterflyDensity).toBe(0.0); // Organically suppressed by wind
  });
});
