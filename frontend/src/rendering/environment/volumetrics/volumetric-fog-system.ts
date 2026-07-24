export class VolumetricFogSystem {
  public computeHeightFogDensity(baseDensity: number, altitude: number, falloff: number): number {
    if (falloff <= 0) return baseDensity;
    return baseDensity * Math.exp(-altitude / falloff);
  }
}
