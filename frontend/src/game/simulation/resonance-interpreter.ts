import { GameplaySignalSnapshot, WorldInputSnapshot } from '@flowstate/shared';

export class ResonanceInterpreter {
  private lastInput: WorldInputSnapshot = {
    growthPotential: 0,
    environmentEnergy: 0,
    harmony: 1.0,
    stability: 1.0,
    recovery: 1.0,
    timestamp: Date.now(),
  };

  /**
   * Translates raw gameplay concepts (flowRatio, trajectoryAccuracy)
   * into environmental simulation concepts (growthPotential, environmentEnergy).
   * Pure deterministic calculation, 0-byte frame allocations.
   */
  public interpret(gameplay: Readonly<GameplaySignalSnapshot>): Readonly<WorldInputSnapshot> {
    const growth = Math.min(1.0, gameplay.flowRatio * gameplay.speedRetention * 1.2);
    const energy = Math.min(100.0, gameplay.kineticEnergy * 0.05 * gameplay.resonance);
    const harmony = Math.min(1.0, Math.max(0.0, gameplay.stability * gameplay.trajectoryAccuracy));
    const recovery = gameplay.flowRatio < 0.2 ? 0.5 : 1.0;

    this.lastInput = {
      growthPotential: growth,
      environmentEnergy: energy,
      harmony,
      stability: gameplay.stability,
      recovery,
      timestamp: Date.now(),
    };

    return this.lastInput;
  }

  public getLastInput(): Readonly<WorldInputSnapshot> {
    return this.lastInput;
  }
}
