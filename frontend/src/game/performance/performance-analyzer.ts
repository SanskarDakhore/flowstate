import { QualityTier } from '@flowstate/shared';

export class PerformanceAnalyzer {
  private currentTier: QualityTier = QualityTier.High;
  private belowTargetCounter: number = 0;
  private aboveTargetCounter: number = 0;

  private static readonly DROP_HYSTERESIS_FRAMES = 60; // 60 sustained slow frames before drop
  private static readonly RECOVER_HYSTERESIS_FRAMES = 120; // 120 sustained fast frames before recovery

  public analyzeFrame(currentFPS: number, targetFPS: number): QualityTier {
    if (currentFPS < targetFPS - 5) {
      this.belowTargetCounter++;
      this.aboveTargetCounter = 0;

      if (this.belowTargetCounter >= PerformanceAnalyzer.DROP_HYSTERESIS_FRAMES) {
        this.belowTargetCounter = 0;
        if (this.currentTier < QualityTier.Minimal) {
          this.currentTier = (this.currentTier + 1) as QualityTier;
        }
      }
    } else if (currentFPS >= targetFPS - 1) {
      this.aboveTargetCounter++;
      this.belowTargetCounter = 0;

      if (this.aboveTargetCounter >= PerformanceAnalyzer.RECOVER_HYSTERESIS_FRAMES) {
        this.aboveTargetCounter = 0;
        if (this.currentTier > QualityTier.Ultra) {
          this.currentTier = (this.currentTier - 1) as QualityTier;
        }
      }
    }

    return this.currentTier;
  }

  public getCurrentTier(): QualityTier {
    return this.currentTier;
  }

  public reset(): void {
    this.currentTier = QualityTier.High;
    this.belowTargetCounter = 0;
    this.aboveTargetCounter = 0;
  }
}
