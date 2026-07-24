export type EcosystemGrowthStage = 'SEED' | 'SPROUT' | 'FLORA_BLOOM' | 'OVERGROWN_CANOPY';

export interface EnvironmentalVariables {
  readonly moisture: number;      // [0.0, 1.0]
  readonly sunlight: number;      // [0.0, 1.0]
  readonly kineticEnergy: number;  // [0.0, 100.0]
  readonly temperature: number;   // [0.0, 40.0] deg C
}

export interface EcosystemConfig {
  readonly maxNodes: number;
  readonly growthRateMultiplier: number;
  readonly decayRatePerSec: number;
}

export interface FloraNodeState {
  readonly nodeId: string;
  readonly stage: EcosystemGrowthStage;
  readonly growthProgress: number; // [0.0, 1.0] within current stage
  readonly health: number;         // [0.0, 1.0]
  readonly floraDensity: number;   // [0.0, 1.0]
}

export interface EcosystemState {
  readonly activeNodesCount: number;
  readonly dominantStage: EcosystemGrowthStage;
  readonly averageHealth: number;
  readonly globalFloraDensity: number;
  readonly momentumMultiplier: number; // 1.0x -> 1.25x
}

export interface GrowthEventResult {
  readonly nodeId: string;
  readonly previousStage: EcosystemGrowthStage;
  readonly currentStage: EcosystemGrowthStage;
  readonly stageChanged: boolean;
}
