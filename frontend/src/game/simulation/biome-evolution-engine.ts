import {
  BiomeEvolutionConfig,
  BiomeTransitionEvent,
  BiomeTransitionState,
  BiomeType,
  BiomeWeights,
} from '@flowstate/shared';

export const DEFAULT_BIOME_CONFIG: BiomeEvolutionConfig = {
  canyonEndMeters: 500.0,
  valleyEndMeters: 1500.0,
  forestEndMeters: 3000.0,
  blendWindowMeters: 100.0,
};

export class BiomeEvolutionEngine {
  private config: BiomeEvolutionConfig;
  private currentPrimaryBiome: BiomeType = 'DESERT_CANYON';

  constructor(config: BiomeEvolutionConfig = DEFAULT_BIOME_CONFIG) {
    this.config = config;
  }

  public evaluateBiomeState(distanceMeters: number): {
    state: BiomeTransitionState;
    event: BiomeTransitionEvent | null;
  } {
    const weights = this.calculateWeights(distanceMeters);
    const primaryBiome = this.resolvePrimaryBiome(weights);

    let event: BiomeTransitionEvent | null = null;
    if (primaryBiome !== this.currentPrimaryBiome) {
      event = {
        previousBiome: this.currentPrimaryBiome,
        newBiome: primaryBiome,
        trackDistanceMeters: distanceMeters,
      };
      this.currentPrimaryBiome = primaryBiome;
    }

    const splatWeightsRgba: [number, number, number, number] = [
      weights.canyonWeight,
      weights.valleyWeight,
      weights.forestWeight,
      weights.peaksWeight,
    ];

    const isBlending =
      weights.canyonWeight > 0.0 && weights.canyonWeight < 1.0 ||
      weights.valleyWeight > 0.0 && weights.valleyWeight < 1.0 ||
      weights.forestWeight > 0.0 && weights.forestWeight < 1.0;

    const targetFloraDensityCap =
      weights.canyonWeight * 0.15 +
      weights.valleyWeight * 0.6 +
      weights.forestWeight * 1.0 +
      weights.peaksWeight * 0.4;

    const state: BiomeTransitionState = {
      currentPrimaryBiome: this.currentPrimaryBiome,
      targetBiome: primaryBiome,
      isBlending,
      distanceMeters,
      weights,
      splatWeightsRgba,
      targetFloraDensityCap,
    };

    return { state, event };
  }

  private calculateWeights(dist: number): BiomeWeights {
    const w = this.config.blendWindowMeters;

    let canyon = 0.0;
    let valley = 0.0;
    let forest = 0.0;
    let peaks = 0.0;

    if (dist < this.config.canyonEndMeters - w) {
      canyon = 1.0;
    } else if (dist < this.config.canyonEndMeters) {
      const alpha = (dist - (this.config.canyonEndMeters - w)) / w;
      canyon = 1.0 - alpha;
      valley = alpha;
    } else if (dist < this.config.valleyEndMeters - w) {
      valley = 1.0;
    } else if (dist < this.config.valleyEndMeters) {
      const alpha = (dist - (this.config.valleyEndMeters - w)) / w;
      valley = 1.0 - alpha;
      forest = alpha;
    } else if (dist < this.config.forestEndMeters - w) {
      forest = 1.0;
    } else if (dist < this.config.forestEndMeters) {
      const alpha = (dist - (this.config.forestEndMeters - w)) / w;
      forest = 1.0 - alpha;
      peaks = alpha;
    } else {
      peaks = 1.0;
    }

    return {
      canyonWeight: canyon,
      valleyWeight: valley,
      forestWeight: forest,
      peaksWeight: peaks,
    };
  }

  private resolvePrimaryBiome(w: BiomeWeights): BiomeType {
    if (w.canyonWeight >= w.valleyWeight && w.canyonWeight >= w.forestWeight && w.canyonWeight >= w.peaksWeight) {
      return 'DESERT_CANYON';
    } else if (w.valleyWeight >= w.forestWeight && w.valleyWeight >= w.peaksWeight) {
      return 'VERDANT_VALLEY';
    } else if (w.forestWeight >= w.peaksWeight) {
      return 'ANCIENT_FOREST';
    } else {
      return 'CRYSTAL_PEAKS';
    }
  }
}
