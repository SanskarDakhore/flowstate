import { CelestialSkySolver } from '../../src/game/experience/celestial-sky-solver';

describe('Phase 04.02 — Celestial Sky & Cloud Formations Engine', () => {
  let skySolver: CelestialSkySolver;

  beforeEach(() => {
    skySolver = new CelestialSkySolver();
  });

  it('should compute Rayleigh atmospheric color gradients for Dawn/Dusk rose gold elevation', () => {
    const sky = skySolver.solveCelestialSky(0.05, 0.5, 0.2); // Dawn progress (solar elevation < 15 deg)
    expect(sky.horizonColorHex).toBe('#f43f5e'); // Rose gold horizon
    expect(sky.starVisibility).toBeGreaterThan(0.0);
  });

  it('should compute Midday Azure sky gradient and zero star visibility', () => {
    const sky = skySolver.solveCelestialSky(0.5, 0.8, 0.2); // Midday
    expect(sky.horizonColorHex).toBe('#38bdf8'); // Azure horizon
    expect(sky.starVisibility).toBe(0.0);
    expect(sky.mieScatteringIntensity).toBeGreaterThan(0.5);
  });
});
