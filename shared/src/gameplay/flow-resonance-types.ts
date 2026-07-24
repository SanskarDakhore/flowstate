export type FlowResonanceTier = 'BUILDING' | 'IN_FLOW' | 'HYPER_FLOW' | 'ZENITH_FLOW';

export interface FlowResonanceConfig {
  readonly minVelocityForFlow: number;  // 20.0 m/s
  readonly maxFlowMeter: number;        // 1.0
  readonly decayRatePerSec: number;     // 0.05 per sec when slow
  readonly impactPenaltyScalar: number; // 0.30 (30% meter loss on hard impact)
}

export interface FlowResonanceState {
  readonly currentTier: FlowResonanceTier;
  readonly flowMeterProgress: number;   // [0.0, 1.0]
  readonly scoreMultiplier: number;     // 1.0x -> 2.5x
  readonly speedBoostFactor: number;    // 1.0x -> 1.35x
  readonly isAuraActive: boolean;
}

export interface ResonanceMultiplierResult {
  readonly previousTier: FlowResonanceTier;
  readonly newTier: FlowResonanceTier;
  readonly tierChanged: boolean;
  readonly currentMultiplier: number;
}
