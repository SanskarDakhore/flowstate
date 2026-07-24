export enum PlantLifeStage {
  Dormant = 'Dormant',
  Seed = 'Seed',
  Sprouting = 'Sprouting',
  Juvenile = 'Juvenile',
  Growing = 'Growing',
  Blooming = 'Blooming',
  Thriving = 'Thriving',
  Ancient = 'Ancient',
  NaturalDecline = 'NaturalDecline',
  SoilRenewal = 'SoilRenewal',
}

export enum ForestSuccessionStage {
  BareGround = 'BareGround',
  Grass = 'Grass',
  Wildflowers = 'Wildflowers',
  Shrubs = 'Shrubs',
  YoungTrees = 'YoungTrees',
  Forest = 'Forest',
  AncientForest = 'AncientForest',
}

export interface CanopyMicroclimateSnapshot {
  readonly shadeFactor: number;          // 0.0 (full sun) to 1.0 (deep canopy shade)
  readonly temperatureDropC: number;     // Microclimatic cooling (0.0 to 4.0 C)
  readonly humidityRetention: number;    // Soil moisture retention boost (1.0 to 1.35)
  readonly windDampingFactor: number;    // Ground wind reduction (0.0 to 0.6)
}

export interface WindDispersalVector {
  readonly directionX: number;
  readonly directionZ: number;
  readonly velocityMs: number;
  readonly seedDriftRate: number;
  readonly pollenCount: number;
  readonly petalDriftRate: number;
}

export interface BotanicalTelemetry {
  readonly totalBiomass: number;            // 0.0 to 1.0
  readonly flowerBloomRatio: number;        // 0.0 to 1.0
  readonly canopyCoverRatio: number;        // 0.0 to 1.0
  readonly grassCoverage: number;           // 0.0 to 1.0
  readonly pollinatorPopulation: number;    // 0.0 to 1.0
  readonly forestMaturity: number;          // 0.0 to 1.0
  readonly ecologicalDiversityScore: number; // 0.0 to 1.0
  readonly recoveryScore: number;           // 0.0 to 1.0
}

export interface BotanicalEcologySnapshot {
  readonly lifeStage: PlantLifeStage;
  readonly successionStage: ForestSuccessionStage;
  readonly canopyMicroclimate: CanopyMicroclimateSnapshot;
  readonly windVector: WindDispersalVector;
  readonly telemetry: BotanicalTelemetry;
  readonly pathRecoveryRatio: number;      // 0.0 to 1.0
  readonly soilRichness: number;           // 0.0 to 1.0
  readonly timestamp: number;
}
