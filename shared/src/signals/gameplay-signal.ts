export interface GameplaySignalSnapshot {
  readonly flowRatio: number;
  readonly resonance: number;
  readonly kineticEnergy: number;
  readonly stability: number;
  readonly trajectoryAccuracy: number;
  readonly speedRetention: number;
  readonly timestamp: number;
}

export function createDefaultSignalSnapshot(): GameplaySignalSnapshot {
  return {
    flowRatio: 0,
    resonance: 1.0,
    kineticEnergy: 0,
    stability: 1.0,
    trajectoryAccuracy: 1.0,
    speedRetention: 1.0,
    timestamp: Date.now(),
  };
}
