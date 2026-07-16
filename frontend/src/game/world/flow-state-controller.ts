import { LivingWorldConfig } from './living-world-types';

export class FlowStateController {
  private flowState: number = 0.0;
  private config: LivingWorldConfig;

  constructor(config: LivingWorldConfig) {
    this.config = config;
  }

  public setConfig(config: LivingWorldConfig): void {
    this.config = config;
  }

  public getFlowState(): number {
    return this.flowState;
  }

  public reset(initialValue: number = 0.0): void {
    this.flowState = Math.max(0.0, Math.min(100.0, initialValue));
  }

  public update(
    speed: number,
    flowComboScalar: number,
    isAirborne: boolean,
    deltaTimeSeconds: number
  ): number {
    if (deltaTimeSeconds <= 0) {
      return this.flowState;
    }

    const { maxHorizontalSpeed, speedWeight, flowComboWeight, airbornePenaltyWeight, decayRate } =
      this.config;

    // 1. Calculate normalized speed ratio
    const normalizedSpeed = Math.min(1.0, Math.max(0.0, speed / Math.max(0.001, maxHorizontalSpeed)));

    // 2. Airborne penalty modifier (1.0 if grounded, scaled down if airborne)
    const airborneFlag = isAirborne ? 1.0 : 0.0;
    const airborneMultiplier = Math.max(0.0, 1.0 - airborneFlag * airbornePenaltyWeight);

    // 3. Instantaneous kinetic accumulation rate (dFS/dt)
    const accumulationRate =
      (speedWeight * normalizedSpeed + flowComboWeight * flowComboScalar) * airborneMultiplier;

    // 4. Determine decay trigger: if speed is negligible (< 1.0 u/s) or combo is 0, apply decay
    if (normalizedSpeed < 0.05 && flowComboScalar <= 0) {
      this.flowState -= decayRate * deltaTimeSeconds;
    } else {
      this.flowState += accumulationRate * deltaTimeSeconds;
    }

    // Enforce Invariant A: 0 <= FS <= 100
    this.flowState = Math.max(0.0, Math.min(100.0, this.flowState));

    return this.flowState;
  }
}
