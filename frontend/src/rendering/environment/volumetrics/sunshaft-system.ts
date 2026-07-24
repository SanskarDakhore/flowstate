export class SunshaftSystem {
  public computePhaseIntensity(angleRad: number, gFactor: number): number {
    const cosTheta = Math.cos(angleRad);
    const g2 = gFactor * gFactor;
    const denom = Math.pow(1.0 + g2 - (2.0 * gFactor * cosTheta), 1.5);
    if (denom <= 0) return 0.0;
    return (1.0 - g2) / (4.0 * Math.PI * denom);
  }
}
