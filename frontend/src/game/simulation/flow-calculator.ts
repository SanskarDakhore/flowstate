export interface FlowMetrics {
  readonly flowRatio: number; // \Phi(t) \in [0, 1]
  readonly pathAdherence: number; // [0, 1]
  readonly comboMultiplier: number;
  readonly streakCount: number;
  readonly lastHitImpact: number;
}

export class FlowCalculator {
  private currentFlow: number = 0.5; // Start at baseline 50% flow
  private targetFlow: number = 0.5;
  private comboCount: number = 0;
  private maxCombo: number = 0;
  private recentHitImpact: number = 0;
  private adherenceScore: number = 1.0;

  private static readonly DECAY_LAMBDA = 0.2; // Continuous idle flow decay factor
  private static readonly ADHERENCE_WEIGHT = 0.6;
  private static readonly MOMENTUM_WEIGHT = 0.4;

  public update(
    lateralDeviance: number,
    pathWidth: number,
    speedRatio: number,
    deltaTimeSeconds: number
  ): FlowMetrics {
    if (deltaTimeSeconds <= 0) return this.getMetrics();

    // 1. Calculate Path Adherence [0, 1]
    const maxAllowedDeviance = Math.max(0.1, pathWidth * 0.5);
    const rawDevianceRatio = Math.min(1.0, Math.abs(lateralDeviance) / maxAllowedDeviance);
    this.adherenceScore = 1.0 - Math.pow(rawDevianceRatio, 1.5); // Smooth non-linear penalty for edge drift

    // 2. Target Flow Calculation
    const instantFlow =
      this.adherenceScore * FlowCalculator.ADHERENCE_WEIGHT +
      Math.min(1.0, speedRatio) * FlowCalculator.MOMENTUM_WEIGHT;

    // 3. Smooth Exponential Interpolation
    const alpha = 1.0 - Math.exp(-FlowCalculator.DECAY_LAMBDA * deltaTimeSeconds * 5.0);
    this.currentFlow += (instantFlow - this.currentFlow) * alpha;

    // 4. Hit Impact Decay
    if (this.recentHitImpact > 0) {
      this.recentHitImpact = Math.max(0, this.recentHitImpact - deltaTimeSeconds * 2.0);
    }

    return this.getMetrics();
  }

  public registerResonancePickup(qualityBonus: number = 0.1): void {
    this.comboCount++;
    if (this.comboCount > this.maxCombo) {
      this.maxCombo = this.comboCount;
    }
    // Instantaneous flow boost
    this.currentFlow = Math.min(1.0, this.currentFlow + qualityBonus);
  }

  public registerHazardHit(penalty: number = 0.3): void {
    this.comboCount = 0;
    this.recentHitImpact = penalty;
    this.currentFlow = Math.max(0.0, this.currentFlow - penalty);
  }

  public getMetrics(): FlowMetrics {
    const comboMult = 1.0 + Math.min(3.0, Math.floor(this.comboCount / 5) * 0.25);
    return {
      flowRatio: Math.max(0, Math.min(1.0, this.currentFlow)),
      pathAdherence: Math.max(0, Math.min(1.0, this.adherenceScore)),
      comboMultiplier: comboMult,
      streakCount: this.comboCount,
      lastHitImpact: this.recentHitImpact,
    };
  }

  public reset(): void {
    this.currentFlow = 0.5;
    this.targetFlow = 0.5;
    this.comboCount = 0;
    this.maxCombo = 0;
    this.recentHitImpact = 0;
    this.adherenceScore = 1.0;
  }
}
