import { PerformanceState, QualityTier } from '@flowstate/shared';
import { PerformanceAnalyzer } from './performance-analyzer';
import { QualityScaler, SystemQualityMultipliers } from './quality-scaler';

export class PerformanceController {
  private analyzer = new PerformanceAnalyzer();
  private scaler = new QualityScaler();

  public update(currentFPS: number, targetFPS: number = 60): { state: PerformanceState; multipliers: SystemQualityMultipliers } {
    const tier = this.analyzer.analyzeFrame(currentFPS, targetFPS);
    const multipliers = this.scaler.calculateMultipliers(tier);

    const scalingLevel = (tier as number) / (QualityTier.Minimal as number);
    const reason = tier === QualityTier.High ? 'Nominal Operations' : `Adaptive Pruning (Tier ${QualityTier[tier]})`;

    const state: PerformanceState = {
      targetFPS,
      currentFPS,
      cpuUtilization: 0.2,
      gpuUtilization: 0.3,
      thermalState: 'nominal',
      batteryMode: 'normal',
      qualityTier: tier,
      scalingLevel,
      scalingReason: reason,
      timestamp: Date.now(),
    };

    return { state, multipliers };
  }

  public reset(): void {
    this.analyzer.reset();
  }
}
