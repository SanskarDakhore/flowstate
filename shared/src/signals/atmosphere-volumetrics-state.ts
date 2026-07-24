export interface VolumetricLightingState {
  readonly sunshaftIntensity: number;
  readonly mieScatteringFactor: number;
  readonly fogHeightFalloff: number;
  readonly lightShaftDensity: number;
  readonly ambientGlowColorHex: string;
}

export function createDefaultVolumetricLightingState(): VolumetricLightingState {
  return {
    sunshaftIntensity: 0.5,
    mieScatteringFactor: 0.75,
    fogHeightFalloff: 25.0,
    lightShaftDensity: 0.3,
    ambientGlowColorHex: '#38bdf8',
  };
}
