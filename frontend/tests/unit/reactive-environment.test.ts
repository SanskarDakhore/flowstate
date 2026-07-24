import { EnvironmentOrchestrator } from '../../src/rendering/environment/systems/environment-orchestrator';
import { LightingSystem } from '../../src/rendering/environment/systems/lighting-system';
import { SkySystem } from '../../src/rendering/environment/systems/sky-system';
import { TerrainRenderer } from '../../src/rendering/environment/systems/terrain-renderer';
import { VegetationSystem } from '../../src/rendering/environment/systems/vegetation-system';
import { AtmosphereSystem } from '../../src/rendering/environment/systems/atmosphere-system';
import { ParticleSystem } from '../../src/rendering/environment/systems/particle-system';
import { PresentationResolver } from '../../src/game/presentation/presentation-resolver';
import { WorldStateEnum, createDefaultWorldStateSnapshot } from '@flowstate/shared';

describe('Reactive Environment Rendering & Change Detection Caching', () => {
  let lighting: LightingSystem;
  let sky: SkySystem;
  let terrain: TerrainRenderer;
  let vegetation: VegetationSystem;
  let atmosphere: AtmosphereSystem;
  let particles: ParticleSystem;
  let orchestrator: EnvironmentOrchestrator;
  let resolver: PresentationResolver;

  beforeEach(() => {
    lighting = new LightingSystem();
    sky = new SkySystem();
    terrain = new TerrainRenderer();
    vegetation = new VegetationSystem();
    atmosphere = new AtmosphereSystem();
    particles = new ParticleSystem();

    orchestrator = new EnvironmentOrchestrator({
      lighting,
      sky,
      terrain,
      vegetation,
      atmosphere,
      particles,
    });

    resolver = new PresentationResolver();
  });

  it('should delegate substate updates to subsystems on initial frame', () => {
    const worldState = createDefaultWorldStateSnapshot();
    const presentation = resolver.resolve(worldState);

    orchestrator.update(presentation, 0.016);

    expect(lighting.getUpdateCount()).toBe(1);
    expect(sky.getUpdateCount()).toBe(1);
    expect(terrain.getUpdateCount()).toBe(1);
    expect(vegetation.getUpdateCount()).toBe(1);
    expect(atmosphere.getUpdateCount()).toBe(1);
    expect(particles.getUpdateCount()).toBe(1);
  });

  it('should skip GPU updates when snapshot parameters are unchanged (Change Detection Caching)', () => {
    const worldState = createDefaultWorldStateSnapshot();
    const presentation = resolver.resolve(worldState);

    orchestrator.update(presentation, 0.016);
    expect(lighting.getUpdateCount()).toBe(1);

    // Second update with identical presentation snapshot
    orchestrator.update(presentation, 0.016);
    expect(lighting.getUpdateCount()).toBe(1); // Skipped due to cache match
    expect(sky.getUpdateCount()).toBe(1);
  });

  it('should update only corresponding subsystems when specific substates change', () => {
    const worldStateIdle = createDefaultWorldStateSnapshot();
    const pres1 = resolver.resolve(worldStateIdle);
    orchestrator.update(pres1, 0.016);

    const worldStateThriving = {
      ...worldStateIdle,
      currentState: WorldStateEnum.THRIVING,
      energyBuffer: 85.0,
      vegetationWeight: 0.9,
    };
    const pres2 = resolver.resolve(worldStateThriving);
    orchestrator.update(pres2, 0.016);

    expect(lighting.getUpdateCount()).toBe(2);
    expect(vegetation.getUpdateCount()).toBe(2);
    expect(vegetation.getCachedState()?.grassDensity).toBe(0.9);
  });
});
