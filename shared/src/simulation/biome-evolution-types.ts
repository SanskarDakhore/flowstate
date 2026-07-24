export type BiomeType = 'DESERT_CANYON' | 'VERDANT_VALLEY' | 'ANCIENT_FOREST' | 'CRYSTAL_PEAKS';

export interface BiomeEvolutionConfig {
  readonly canyonEndMeters: number;  // 500m
  readonly valleyEndMeters: number;  // 1500m
  readonly forestEndMeters: number;  // 3000m
  readonly blendWindowMeters: number;// 100m blend transition zone
}

export interface BiomeWeights {
  readonly canyonWeight: number;
  readonly valleyWeight: number;
  readonly forestWeight: number;
  readonly peaksWeight: number;
}

export interface BiomeTransitionState {
  readonly currentPrimaryBiome: BiomeType;
  readonly targetBiome: BiomeType;
  readonly isBlending: boolean;
  readonly distanceMeters: number;
  readonly weights: BiomeWeights;
  readonly splatWeightsRgba: [number, number, number, number];
  readonly targetFloraDensityCap: number;
}

export interface BiomeTransitionEvent {
  readonly previousBiome: BiomeType;
  readonly newBiome: BiomeType;
  readonly trackDistanceMeters: number;
}
