import { ExperienceResolver } from '../../src/game/experience/experience-resolver';
import { WorldMemoryEngine } from '../../src/game/experience/world-memory-engine';
import { SolarArcSolver } from '../../src/game/experience/solar-arc-solver';
import { WorldStateEnum, WorldStateSnapshot, createDefaultPresentationSnapshot, createDefaultWeatherState, createDefaultVegetationGrowthState, createDefaultWildlifeState, createDefaultWorldEventState } from '@flowstate/shared';

describe('Milestone 4 — Living World Experience Architecture', () => {
  let resolver: ExperienceResolver;
  let memoryEngine: WorldMemoryEngine;
  let solarSolver: SolarArcSolver;

  beforeEach(() => {
    resolver = new ExperienceResolver();
    memoryEngine = new WorldMemoryEngine();
    solarSolver = new SolarArcSolver();
  });

  it('should map world simulation states to emotional moods in Experience Resolver', () => {
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
      vegetationState: createDefaultVegetationGrowthState(),
      wildlifeState: createDefaultWildlifeState(),
      eventState: createDefaultWorldEventState(),
      timestamp: Date.now(),
    };

    const exp = resolver.resolveExperience(mockWorldState, createDefaultPresentationSnapshot());
    expect(exp.mood).toBe('joyful');
    expect(exp.worldWarmth).toBe(0.85);
  });

  it('should accumulate persistent valley healing in World Memory Engine without regression', () => {
    memoryEngine.updateMemory(0.5, 0.4);
    expect(memoryEngine.getPersistentBiomass()).toBe(0.4);

    // Drops in current growth should NOT decrease persistent biomass (world remembers healing!)
    memoryEngine.updateMemory(0.2, 0.1);
    expect(memoryEngine.getPersistentBiomass()).toBe(0.4);
  });

  it('should compute solar elevation angle and sky warmth factor', () => {
    const solar = solarSolver.computeSolarArc(0.5, 0.8); // Midday
    expect(solar.sunElevationAngleDeg).toBeCloseTo(65.0);
    expect(solar.skyWarmthFactor).toBeGreaterThan(0.5);
  });
});
