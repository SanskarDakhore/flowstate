export interface ResonanceCalculationInput {
  readonly currentSpeed: number;
  readonly maxSpeed: number;
  readonly pathDeviation: number;
  readonly comboCount: number;
  readonly isGrounded: boolean;
  readonly deltaTime: number;
}

export interface ResonanceOutput {
  readonly flowRatio: number;
  readonly resonanceMultiplier: number;
  readonly kineticEnergy: number;
  readonly stabilityScore: number;
}
