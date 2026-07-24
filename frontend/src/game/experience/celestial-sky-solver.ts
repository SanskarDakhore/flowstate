import { CelestialSkyState } from '@flowstate/shared';
import { SolarArcSolver } from './solar-arc-solver';

export class CelestialSkySolver {
  private solarSolver = new SolarArcSolver();

  public solveCelestialSky(dayProgress: number, worldWarmth: number, cloudCover: number = 0.2): CelestialSkyState {
    const solar = this.solarSolver.computeSolarArc(dayProgress, worldWarmth);
    const elevation = solar.sunElevationAngleDeg;

    let zenithHex = '#1e3a8a';
    let horizonHex = '#38bdf8';
    let starVis = 0.0;

    if (elevation < 0.0) {
      // Night / Twilight
      zenithHex = '#020617';
      horizonHex = '#1e1b4b';
      starVis = 1.0;
    } else if (elevation < 15.0) {
      // Dawn / Dusk Rose Gold
      zenithHex = '#312e81';
      horizonHex = '#f43f5e';
      starVis = 0.3;
    } else if (elevation < 35.0) {
      // Warm Morning / Golden Hour
      zenithHex = '#1e40af';
      horizonHex = '#fbbf24';
      starVis = 0.0;
    } else {
      // Midday Azure
      zenithHex = '#1d4ed8';
      horizonHex = '#38bdf8';
      starVis = 0.0;
    }

    const mieIntensity = Math.min(1.0, Math.max(0.1, (elevation / 65.0) * 0.9));

    return {
      sunElevationDeg: elevation,
      zenithColorHex: zenithHex,
      horizonColorHex: horizonHex,
      cloudDensity: cloudCover * (1.0 - (worldWarmth * 0.3)),
      mieScatteringIntensity: mieIntensity,
      starVisibility: starVis,
      timestamp: Date.now(),
    };
  }
}
