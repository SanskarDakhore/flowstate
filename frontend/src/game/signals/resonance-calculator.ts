import { GameplaySignalSnapshot, ResonanceCalculationInput, ResonanceOutput } from '@flowstate/shared';
import { RawGameplayFacts } from './gameplay-signal-collector';

export class ResonanceCalculator {
  private currentFlowRatio: number = 0;
  private currentResonance: number = 1.0;

  /**
   * Pure deterministic calculation of flow ratio and resonance.
   * Employs smooth dampening and bounded clamping [0, 1].
   */
  public calculate(facts: Readonly<RawGameplayFacts>): GameplaySignalSnapshot {
    const targetSpeedRatio = Math.min(1.0, Math.max(0.0, facts.speed / facts.maxSpeed));
    const devPenalty = Math.min(0.5, Math.abs(facts.pathDeviation) * 0.1);
    const targetFlow = Math.max(0.0, targetSpeedRatio - devPenalty);

    // Smooth linear interpolation for flow ratio dampening (0-byte alloc)
    const dampRate = facts.deltaTime > 0 ? Math.min(1.0, facts.deltaTime * 3.0) : 1.0;
    this.currentFlowRatio += (targetFlow - this.currentFlowRatio) * dampRate;

    // Calculate resonance multiplier based on combo and flow
    const comboBonus = Math.min(2.0, facts.comboCount * 0.1);
    this.currentResonance = 1.0 + (this.currentFlowRatio * 2.0) + comboBonus;

    const kineticEnergy = 0.5 * facts.speed * facts.speed;
    const stability = Math.max(0.0, 1.0 - devPenalty);
    const accuracy = Math.max(0.0, 1.0 - (Math.abs(facts.pathDeviation) * 0.2));

    return {
      flowRatio: Math.max(0, Math.min(1, this.currentFlowRatio)),
      resonance: Math.max(1.0, this.currentResonance),
      kineticEnergy,
      stability: Math.max(0, Math.min(1, stability)),
      trajectoryAccuracy: Math.max(0, Math.min(1, accuracy)),
      speedRetention: targetSpeedRatio,
      timestamp: Date.now(),
    };
  }

  public reset(): void {
    this.currentFlowRatio = 0;
    this.currentResonance = 1.0;
  }
}
