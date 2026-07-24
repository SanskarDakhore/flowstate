export class WorldMemoryEngine {
  private persistentBiomass: number = 0.0;
  private maxSanctuaryLevel: number = 0.0;

  public updateMemory(currentHarmony: number, currentGrowth: number): void {
    // Persistent memory only increases during session (world remembers healing)
    if (currentGrowth > this.persistentBiomass) {
      this.persistentBiomass = currentGrowth;
    }

    if (currentHarmony > this.maxSanctuaryLevel) {
      this.maxSanctuaryLevel = currentHarmony;
    }
  }

  public getPersistentBiomass(): number {
    return this.persistentBiomass;
  }

  public getMaxSanctuaryLevel(): number {
    return this.maxSanctuaryLevel;
  }

  public resetSession(): void {
    this.persistentBiomass = 0.0;
    this.maxSanctuaryLevel = 0.0;
  }
}
