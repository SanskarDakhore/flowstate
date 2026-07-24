import { CanopyMicroclimateSnapshot, ForestSuccessionStage } from '@flowstate/shared';

export class CanopyEcologySolver {
  private currentSnapshot: CanopyMicroclimateSnapshot = {
    shadeFactor: 0.1,
    temperatureDropC: 0.4,
    humidityRetention: 1.03,
    windDampingFactor: 0.06,
  };

  public solve(
    treeVitality: number,
    leafDensity: number,
    successionStage: ForestSuccessionStage
  ): CanopyMicroclimateSnapshot {
    let canopyMultiplier = 0.1;

    switch (successionStage) {
      case ForestSuccessionStage.BareGround:
      case ForestSuccessionStage.Grass:
        canopyMultiplier = 0.05;
        break;
      case ForestSuccessionStage.Wildflowers:
        canopyMultiplier = 0.1;
        break;
      case ForestSuccessionStage.Shrubs:
        canopyMultiplier = 0.3;
        break;
      case ForestSuccessionStage.YoungTrees:
        canopyMultiplier = 0.6;
        break;
      case ForestSuccessionStage.Forest:
        canopyMultiplier = 0.85;
        break;
      case ForestSuccessionStage.AncientForest:
        canopyMultiplier = 1.0;
        break;
    }

    const shadeFactor = Math.min(1.0, (treeVitality * 0.6 + leafDensity * 0.4) * canopyMultiplier);
    const temperatureDropC = shadeFactor * 4.0;
    const humidityRetention = 1.0 + (shadeFactor * 0.35);
    const windDampingFactor = shadeFactor * 0.6;

    this.currentSnapshot = {
      shadeFactor,
      temperatureDropC,
      humidityRetention,
      windDampingFactor,
    };

    return this.currentSnapshot;
  }

  public getCurrentMicroclimate(): CanopyMicroclimateSnapshot {
    return this.currentSnapshot;
  }
}
