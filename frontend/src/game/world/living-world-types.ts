export enum BiomePhase {
  DORMANT = 0,
  AWAKENING = 1,
  LIVING = 2,
  BLOOMING = 3,
  RADIANT = 4,
}

export const BIOME_PHASE_LABELS: Record<BiomePhase, string> = Object.freeze({
  [BiomePhase.DORMANT]: 'DORMANT',
  [BiomePhase.AWAKENING]: 'AWAKENING',
  [BiomePhase.LIVING]: 'LIVING',
  [BiomePhase.BLOOMING]: 'BLOOMING',
  [BiomePhase.RADIANT]: 'RADIANT',
});

export function getBiomePhaseOrder(phase: BiomePhase): number {
  return phase;
}

export enum LivingWorldEventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export enum LivingWorldEventType {
  FLOW_STATE_GAINED = 0,
  FLOW_STATE_LOST = 1,
  RESONANCE_LEVEL_UP = 2,
  BIOME_PHASE_CHANGED = 3,
  WORLD_BLOOM_STARTED = 4,
  WORLD_BLOOM_FINISHED = 5,
  FIRST_RADIANT_STATE = 6,
  WORLD_PROFILE_CHANGED = 7, // Reserved multi-biome switch event
}

export const LIVING_WORLD_EVENT_LABELS: Record<LivingWorldEventType, string> = Object.freeze({
  [LivingWorldEventType.FLOW_STATE_GAINED]: 'FLOW_STATE_GAINED',
  [LivingWorldEventType.FLOW_STATE_LOST]: 'FLOW_STATE_LOST',
  [LivingWorldEventType.RESONANCE_LEVEL_UP]: 'RESONANCE_LEVEL_UP',
  [LivingWorldEventType.BIOME_PHASE_CHANGED]: 'BIOME_PHASE_CHANGED',
  [LivingWorldEventType.WORLD_BLOOM_STARTED]: 'WORLD_BLOOM_STARTED',
  [LivingWorldEventType.WORLD_BLOOM_FINISHED]: 'WORLD_BLOOM_FINISHED',
  [LivingWorldEventType.FIRST_RADIANT_STATE]: 'FIRST_RADIANT_STATE',
  [LivingWorldEventType.WORLD_PROFILE_CHANGED]: 'WORLD_PROFILE_CHANGED',
});

export interface LivingWorldEvent {
  readonly eventIndex: number;
  readonly type: LivingWorldEventType;
  readonly priority: LivingWorldEventPriority;
  readonly timestamp: number;
  readonly payload?: Readonly<Record<string, unknown>>;
}

export interface BiomePhaseThresholds {
  readonly awakening: number; // Default: 15
  readonly living: number;    // Default: 40
  readonly blooming: number;  // Default: 70
  readonly radiant: number;   // Default: 90
}

export interface LivingWorldConfig {
  readonly version: number;
  readonly biomeId: string;
  readonly maxHorizontalSpeed: number;  // Reference v_max for scaling
  readonly flowComboWeight: number;      // k_c scalar
  readonly speedWeight: number;          // k_v scalar
  readonly airbornePenaltyWeight: number;// k_air scalar
  readonly conversionRate: number;       // Rate of converting FS -> WR per second
  readonly decayRate: number;            // FS decay rate per second when idle
  readonly phaseThresholds: BiomePhaseThresholds;
}

export const DEFAULT_LIVING_WORLD_CONFIG: LivingWorldConfig = Object.freeze({
  version: 1,
  biomeId: 'LIVING_VALLEY',
  maxHorizontalSpeed: 20.0,
  flowComboWeight: 15.0,
  speedWeight: 25.0,
  airbornePenaltyWeight: 0.5,
  conversionRate: 2.5,
  decayRate: 12.0,
  phaseThresholds: {
    awakening: 15.0,
    living: 40.0,
    blooming: 70.0,
    radiant: 90.0,
  },
});
