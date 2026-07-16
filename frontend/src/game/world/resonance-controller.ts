import { LivingWorldConfig } from './living-world-types';

export class ResonanceController {
  private worldResonance: number = 0.0;
  private config: LivingWorldConfig;

  constructor(config: LivingWorldConfig) {
    this.config = config;
  }

  public setConfig(config: LivingWorldConfig): void {
    this.config = config;
  }

  public getWorldResonance(): number {
    return this.worldResonance;
  }

  public reset(initialValue: number = 0.0): void {
    // Monotonic floor setup
    this.worldResonance = Math.max(0.0, Math.min(100.0, initialValue));
  }

  /**
   * Continuous conversion update.
   * Converts short-term flowState into persistent worldResonance.
   * Enforces Invariant C: World Resonance is strictly monotonic (never decreases).
   */
  public update(flowState: number, deltaTimeSeconds: number): number {
    if (deltaTimeSeconds <= 0) {
      return this.worldResonance;
    }

    const { conversionRate } = this.config;
    const normalizedFlow = Math.max(0.0, Math.min(1.0, flowState / 100.0));

    // Continuous accumulation delta: dWR/dt = conversionRate * (flowState / 100)
    const deltaResonance = Math.max(0.0, conversionRate * normalizedFlow * deltaTimeSeconds);

    // Monotonic addition
    this.worldResonance += deltaResonance;

    // Enforce Invariant B: 0 <= WR <= 100
    this.worldResonance = Math.max(0.0, Math.min(100.0, this.worldResonance));

    return this.worldResonance;
  }
}
