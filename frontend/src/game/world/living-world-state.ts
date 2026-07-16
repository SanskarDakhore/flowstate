import { BiomePhase } from './living-world-types';

export interface LivingWorldState {
  readonly version: number;              // Current snapshot version (1)
  readonly frameIndex: number;
  readonly timestamp: number;
  readonly elapsedSimulationTime: number; // Deterministic simulation clock (seconds)
  readonly activeBiomeId: string;

  // Primary Simulation State
  readonly flowState: number;            // Short-term flow mastery [0.0 - 100.0]
  readonly worldResonance: number;       // Persistent monotonic progress [0.0 - 100.0]

  // Derived Simulation Outputs
  readonly biomeHealthPercentage: number; // Derived status ratio [0.0 - 1.0]
  readonly biomeInfluence: number;       // Master normalized continuous driver [0.0 - 1.0]
  readonly biomePhase: BiomePhase;       // Current phase enum

  // Generic Extension Seam
  readonly extensions: {
    readonly reserved: null;             // Reserved extension seam
  };
}

export function createInitialLivingWorldState(
  activeBiomeId: string = 'LIVING_VALLEY'
): LivingWorldState {
  const state: LivingWorldState = {
    version: 1,
    frameIndex: 0,
    timestamp: 0,
    elapsedSimulationTime: 0,
    activeBiomeId,
    flowState: 0.0,
    worldResonance: 0.0,
    biomeHealthPercentage: 0.0,
    biomeInfluence: 0.0,
    biomePhase: BiomePhase.DORMANT,
    extensions: {
      reserved: null,
    },
  };

  return Object.freeze(state);
}
