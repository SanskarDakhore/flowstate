import { SunshaftSystem } from '../../src/rendering/environment/volumetrics/sunshaft-system';
import { VolumetricFogSystem } from '../../src/rendering/environment/volumetrics/volumetric-fog-system';

describe('Atmospheric Volumetrics & Sunshaft Lighting', () => {
  let sunshaftSystem: SunshaftSystem;
  let fogSystem: VolumetricFogSystem;

  beforeEach(() => {
    sunshaftSystem = new SunshaftSystem();
    fogSystem = new VolumetricFogSystem();
  });

  it('should compute Henyey-Greenstein Mie scattering phase intensity', () => {
    const forwardPhase = sunshaftSystem.computePhaseIntensity(0.0, 0.75); // Forward angle
    const sidePhase = sunshaftSystem.computePhaseIntensity(Math.PI / 2.0, 0.75); // Side angle

    expect(forwardPhase).toBeGreaterThan(sidePhase);
  });

  it('should calculate exponential height fog falloff', () => {
    const seaLevelFog = fogSystem.computeHeightFogDensity(0.02, 0.0, 25.0);
    const highAltitudeFog = fogSystem.computeHeightFogDensity(0.02, 50.0, 25.0);

    expect(seaLevelFog).toBeCloseTo(0.02);
    expect(highAltitudeFog).toBeLessThan(seaLevelFog);
  });
});
