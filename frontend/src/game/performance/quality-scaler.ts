import { QualityTier } from '@flowstate/shared';

export interface SystemQualityMultipliers {
  readonly particleDensity: number;
  readonly grassDensity: number;
  readonly cloudComplexity: number;
  readonly shadowDistance: number;
  readonly mistQuality: number;
  readonly wildlifeDensity: number;
  readonly postProcessingQuality: number;
  readonly internalRenderScale: number;
}

export class QualityScaler {
  public calculateMultipliers(tier: QualityTier): SystemQualityMultipliers {
    switch (tier) {
      case QualityTier.Ultra:
        return {
          particleDensity: 1.0,
          grassDensity: 1.0,
          cloudComplexity: 1.0,
          shadowDistance: 1.0,
          mistQuality: 1.0,
          wildlifeDensity: 1.0,
          postProcessingQuality: 1.0,
          internalRenderScale: 1.0,
        };
      case QualityTier.High:
        return {
          particleDensity: 0.8, // 1. Particle density pruned first
          grassDensity: 0.9,
          cloudComplexity: 1.0,
          shadowDistance: 1.0,
          mistQuality: 1.0,
          wildlifeDensity: 1.0,
          postProcessingQuality: 1.0,
          internalRenderScale: 1.0,
        };
      case QualityTier.Medium:
        return {
          particleDensity: 0.5, // 1. Particles
          grassDensity: 0.7,    // 2. Grass density
          cloudComplexity: 0.8, // 3. Cloud complexity
          shadowDistance: 0.8,  // 4. Shadow distance
          mistQuality: 0.9,
          wildlifeDensity: 1.0,
          postProcessingQuality: 1.0,
          internalRenderScale: 1.0,
        };
      case QualityTier.Low:
        return {
          particleDensity: 0.25,
          grassDensity: 0.4,
          cloudComplexity: 0.5,
          shadowDistance: 0.5,
          mistQuality: 0.6,    // 5. Mist quality
          wildlifeDensity: 0.7, // 6. Wildlife density
          postProcessingQuality: 0.8, // 7. Post processing
          internalRenderScale: 1.0, // Internal resolution stays 1.0!
        };
      case QualityTier.Minimal:
      default:
        return {
          particleDensity: 0.1,
          grassDensity: 0.2,
          cloudComplexity: 0.3,
          shadowDistance: 0.3,
          mistQuality: 0.4,
          wildlifeDensity: 0.4,
          postProcessingQuality: 0.5,
          internalRenderScale: 0.85, // Resolution reduced as absolute last resort
        };
    }
  }
}
