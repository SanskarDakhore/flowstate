export class VegetationHealth {
  private health: number = 0.2;
  private static readonly DECAY_RATE = 0.2;

  public update(energy: number, harmony: number, recovery: number, deltaTime: number): number {
    if (deltaTime <= 0) return this.health;

    const energyNorm = Math.min(1.0, Math.max(0.0, energy / 100.0));
    const growthGain = energyNorm * harmony * 0.2 * recovery * deltaTime;
    const decay = (1.0 - energyNorm) * VegetationHealth.DECAY_RATE * deltaTime;

    this.health += growthGain - decay;
    this.health = Math.max(0.0, Math.min(1.0, this.health));

    return this.health;
  }

  public getHealth(): number {
    return this.health;
  }

  public reset(): void {
    this.health = 0.2;
  }
}
