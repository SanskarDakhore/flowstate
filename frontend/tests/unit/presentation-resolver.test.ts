import { PresentationResolver } from '../../src/game/presentation/presentation-resolver';
import { WorldStateEnum, createDefaultWorldStateSnapshot } from '@flowstate/shared';

describe('Presentation Resolver & Declarative Rendering Mapping', () => {
  let resolver: PresentationResolver;

  beforeEach(() => {
    resolver = new PresentationResolver();
  });

  it('should resolve WorldStateSnapshot into declarative PresentationSnapshot hierarchy', () => {
    const worldState = {
      ...createDefaultWorldStateSnapshot(),
      currentState: WorldStateEnum.BLOOMING,
      energyBuffer: 60.0,
      vegetationWeight: 0.72,
    };

    const presentation = resolver.resolve(worldState);

    expect(presentation.sky.skyBlend).toBeGreaterThan(0.5);
    expect(presentation.lighting.sunIntensity).toBeGreaterThan(0.5);
    expect(presentation.vegetation.grassDensity).toBe(0.72);
    expect(presentation.atmosphere.fogDensity).toBeLessThan(0.03);
    expect(presentation.audio.music.intensity).toBeGreaterThan(0);
    expect(presentation.camera.cameraMood).toBe('awakened');
  });

  it('should update presentation parameters declaratively across energy shifts', () => {
    const lowEnergyState = {
      ...createDefaultWorldStateSnapshot(),
      energyBuffer: 10.0,
      vegetationWeight: 0.1,
    };

    const lowPres = resolver.resolve(lowEnergyState);

    const highEnergyState = {
      ...createDefaultWorldStateSnapshot(),
      currentState: WorldStateEnum.THRIVING,
      energyBuffer: 85.0,
      vegetationWeight: 0.9,
    };

    const highPres = resolver.resolve(highEnergyState);

    expect(highPres.sky.skyBlend).toBeGreaterThan(lowPres.sky.skyBlend);
    expect(highPres.lighting.sunIntensity).toBeGreaterThan(lowPres.lighting.sunIntensity);
    expect(highPres.vegetation.grassDensity).toBeGreaterThan(lowPres.vegetation.grassDensity);
    expect(highPres.camera.cameraMood).toBe('kinetic-flow');
  });
});
