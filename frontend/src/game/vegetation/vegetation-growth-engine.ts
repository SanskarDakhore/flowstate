export class VegetationGrowthEngine {
  private bloomProgress: number = 0.0;
  private growthBiomass: number = 0.1;

  public update(health: number, deltaTime: number): { growth: number; bloom: number } {
    if (deltaTime <= 0) return { growth: this.growthBiomass, bloom: this.bloomProgress };

    // Continuous biological growth accumulator
    const growthTarget = Math.min(1.0, health * 1.2);
    this.growthBiomass += (growthTarget - this.growthBiomass) * Math.min(1.0, deltaTime * 0.5);

    // Blooming progress differential equation
    if (health >= 0.5) {
      this.bloomProgress += (health - 0.5) * 0.2 * deltaTime;
    } else {
      this.bloomProgress -= 0.1 * deltaTime;
    }
    this.bloomProgress = Math.max(0.0, Math.min(1.0, this.bloomProgress));

    return {
      growth: this.growthBiomass,
      bloom: this.bloomProgress,
    };
  }

  public reset(): void {
    this.bloomProgress = 0.0;
    this.growthBiomass = 0.1;
  }
}
