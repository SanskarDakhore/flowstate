export interface SolarArcState {
  readonly sunElevationAngleDeg: number;
  readonly sunAzimuthAngleDeg: number;
  readonly dayCycleProgress: number; // 0.0 (Dawn) to 1.0 (Dusk)
  readonly skyWarmthFactor: number;
}

export class SolarArcSolver {
  public computeSolarArc(dayProgress: number, worldWarmth: number): SolarArcState {
    const clampedProgress = Math.min(1.0, Math.max(0.0, dayProgress));
    // Solar elevation arc equation: sin(progress * PI) * 65.0 degrees
    const elevation = Math.sin(clampedProgress * Math.PI) * 65.0;
    const azimuth = clampedProgress * 180.0; // 0 deg East to 180 deg West

    const skyWarmth = (Math.sin(clampedProgress * Math.PI) * 0.5) + (worldWarmth * 0.5);

    return {
      sunElevationAngleDeg: elevation,
      sunAzimuthAngleDeg: azimuth,
      dayCycleProgress: clampedProgress,
      skyWarmthFactor: skyWarmth,
    };
  }
}
