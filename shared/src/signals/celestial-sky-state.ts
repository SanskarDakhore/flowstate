export interface CelestialSkyState {
  readonly sunElevationDeg: number;
  readonly zenithColorHex: string;
  readonly horizonColorHex: string;
  readonly cloudDensity: number;
  readonly mieScatteringIntensity: number;
  readonly starVisibility: number;
  readonly timestamp: number;
}

export function createDefaultCelestialSkyState(): CelestialSkyState {
  return {
    sunElevationDeg: 45.0,
    zenithColorHex: '#1e3a8a',
    horizonColorHex: '#38bdf8',
    cloudDensity: 0.2,
    mieScatteringIntensity: 0.75,
    starVisibility: 0.0,
    timestamp: Date.now(),
  };
}
