export class BotanicalMemoryRepository {
  private soilRichness: number = 0.2; // 0.0 to 1.0
  private pathRecoveryRatio: number = 1.0; // 0.0 (trampled) to 1.0 (fully recovered)
  private persistentBiomassMemory: number = 0.1;
  private totalValleyAgeSec: number = 0.0;

  public updateMemory(
    currentBiomass: number,
    health: number,
    isTrampled: boolean,
    deltaTimeSec: number
  ): void {
    if (deltaTimeSec <= 0) return;

    this.totalValleyAgeSec += deltaTimeSec;

    // Soil richness slowly enriches with higher health and biomass persistence
    if (health > 0.4) {
      this.soilRichness = Math.min(1.0, this.soilRichness + deltaTimeSec * 0.001 * health);
    }

    // Path recovery: if trampled, ratio drops; otherwise it slowly recovers over 45s
    if (isTrampled) {
      this.pathRecoveryRatio = Math.max(0.0, this.pathRecoveryRatio - deltaTimeSec * 0.5);
    } else if (this.pathRecoveryRatio < 1.0) {
      this.pathRecoveryRatio = Math.min(1.0, this.pathRecoveryRatio + deltaTimeSec * 0.022); // ~45 sec recovery
    }

    // Continuous valley biomass memory retention
    this.persistentBiomassMemory = (this.persistentBiomassMemory * 0.999) + (currentBiomass * 0.001);
  }

  public getSoilRichness(): number {
    return this.soilRichness;
  }

  public getPathRecoveryRatio(): number {
    return this.pathRecoveryRatio;
  }

  public getPersistentBiomassMemory(): number {
    return this.persistentBiomassMemory;
  }

  public getTotalValleyAgeSec(): number {
    return this.totalValleyAgeSec;
  }

  public reset(): void {
    this.soilRichness = 0.2;
    this.pathRecoveryRatio = 1.0;
    this.persistentBiomassMemory = 0.1;
    this.totalValleyAgeSec = 0.0;
  }
}
