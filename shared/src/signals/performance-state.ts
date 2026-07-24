export enum QualityTier {
  Ultra = 0,
  High = 1,
  Medium = 2,
  Low = 3,
  Minimal = 4,
}

export interface PerformanceState {
  readonly targetFPS: number;
  readonly currentFPS: number;
  readonly cpuUtilization: number;
  readonly gpuUtilization: number;
  readonly thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
  readonly batteryMode: 'normal' | 'saver';
  readonly qualityTier: QualityTier;
  readonly scalingLevel: number; // 0.0 (unscaled) to 1.0 (fully scaled back)
  readonly scalingReason: string;
  readonly timestamp: number;
}

export function createDefaultPerformanceState(): PerformanceState {
  return {
    targetFPS: 60,
    currentFPS: 60,
    cpuUtilization: 0.2,
    gpuUtilization: 0.3,
    thermalState: 'nominal',
    batteryMode: 'normal',
    qualityTier: QualityTier.High,
    scalingLevel: 0.0,
    scalingReason: 'Nominal Operations',
    timestamp: Date.now(),
  };
}
