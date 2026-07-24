export interface WorldInputSnapshot {
  readonly growthPotential: number;
  readonly environmentEnergy: number;
  readonly harmony: number;
  readonly stability: number;
  readonly recovery: number;
  readonly timestamp: number;
}

export function createDefaultWorldInput(): WorldInputSnapshot {
  return {
    growthPotential: 0,
    environmentEnergy: 0,
    harmony: 1.0,
    stability: 1.0,
    recovery: 1.0,
    timestamp: Date.now(),
  };
}
