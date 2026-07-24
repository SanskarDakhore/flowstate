import { ForestSuccessionStage } from '@flowstate/shared';

export class ForestSuccessionSolver {
  private successionStage: ForestSuccessionStage = ForestSuccessionStage.BareGround;
  private successionProgress: number = 0.0;

  public update(growth: number, health: number, harmony: number, deltaTimeSec: number): ForestSuccessionStage {
    if (deltaTimeSec <= 0) return this.successionStage;

    const ecologicalEnergy = (growth * 0.4) + (health * 0.3) + (harmony * 0.3);

    switch (this.successionStage) {
      case ForestSuccessionStage.BareGround:
        if (ecologicalEnergy > 0.15) {
          this.successionProgress += deltaTimeSec * 0.1 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.Grass;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.Grass:
        if (ecologicalEnergy > 0.35) {
          this.successionProgress += deltaTimeSec * 0.08 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.Wildflowers;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.Wildflowers:
        if (ecologicalEnergy > 0.55) {
          this.successionProgress += deltaTimeSec * 0.06 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.Shrubs;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.Shrubs:
        if (ecologicalEnergy > 0.7) {
          this.successionProgress += deltaTimeSec * 0.05 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.YoungTrees;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.YoungTrees:
        if (ecologicalEnergy > 0.82) {
          this.successionProgress += deltaTimeSec * 0.04 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.Forest;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.Forest:
        if (ecologicalEnergy > 0.92) {
          this.successionProgress += deltaTimeSec * 0.02 * ecologicalEnergy;
          if (this.successionProgress >= 1.0) {
            this.successionStage = ForestSuccessionStage.AncientForest;
            this.successionProgress = 0.0;
          }
        }
        break;

      case ForestSuccessionStage.AncientForest:
        // Maintains maximum ecosystem sanctuary capacity
        break;
    }

    return this.successionStage;
  }

  public getSuccessionStage(): ForestSuccessionStage {
    return this.successionStage;
  }

  public getSuccessionProgress(): number {
    return this.successionProgress;
  }

  public reset(): void {
    this.successionStage = ForestSuccessionStage.BareGround;
    this.successionProgress = 0.0;
  }
}
