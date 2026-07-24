export interface InstancedVegetationShaderState {
  readonly instanceCount: number;
  readonly windPhaseOffset: number;
  readonly swayFrequencyHz: number;
  readonly swayAmplitudeMeters: number;
  readonly bendingStiffness: number;
  readonly foliageColorTintHex: string;
}

export function createDefaultInstancedVegetationShaderState(): InstancedVegetationShaderState {
  return {
    instanceCount: 10000,
    windPhaseOffset: 0.0,
    swayFrequencyHz: 1.5,
    swayAmplitudeMeters: 0.25,
    bendingStiffness: 2.0,
    foliageColorTintHex: '#10b981',
  };
}
