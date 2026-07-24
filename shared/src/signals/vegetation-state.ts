import { ForestSuccessionStage, PlantLifeStage } from './botanical-taxonomy';

export interface VegetationGrowthState {
  readonly growth: number;          // 0.0 to 1.0 overall biomass
  readonly health: number;          // 0.0 to 1.0 plant vitality
  readonly bloomProgress: number;   // 0.0 to 1.0 flower bloom ratio
  readonly flowerDensity: number;   // Active flower count multiplier
  readonly leafDensity: number;     // Foliage foliage density
  readonly grassHeight: number;     // Grass blade length factor
  readonly treeVitality: number;    // Tree leaf canopy health
  readonly colorVariation: number;  // Hue shift factor
  readonly lifeStage?: PlantLifeStage;
  readonly successionStage?: ForestSuccessionStage;
  readonly canopyCoverRatio?: number;
  readonly mossCoverage?: number;
  readonly soilRichness?: number;
  readonly pollinatorActivity?: number;
  readonly windDispersalDensity?: number;
  readonly pathRecoveryRatio?: number;
  readonly ecologicalDiversityScore?: number;
  readonly timestamp: number;
}

export function createDefaultVegetationGrowthState(): VegetationGrowthState {
  return {
    growth: 0.1,
    health: 0.2,
    bloomProgress: 0.0,
    flowerDensity: 0.0,
    leafDensity: 0.3,
    grassHeight: 0.3,
    treeVitality: 0.5,
    colorVariation: 0.0,
    lifeStage: PlantLifeStage.Dormant,
    successionStage: ForestSuccessionStage.BareGround,
    canopyCoverRatio: 0.1,
    mossCoverage: 0.05,
    soilRichness: 0.2,
    pollinatorActivity: 0.0,
    windDispersalDensity: 0.1,
    pathRecoveryRatio: 1.0,
    ecologicalDiversityScore: 0.15,
    timestamp: Date.now(),
  };
}
