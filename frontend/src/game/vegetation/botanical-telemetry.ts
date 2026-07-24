import { BotanicalTelemetry, ForestSuccessionStage, PlantLifeStage } from '@flowstate/shared';

export class BotanicalTelemetryCalculator {
  private telemetry: BotanicalTelemetry = {
    totalBiomass: 0.1,
    flowerBloomRatio: 0.0,
    canopyCoverRatio: 0.1,
    grassCoverage: 0.3,
    pollinatorPopulation: 0.0,
    forestMaturity: 0.0,
    ecologicalDiversityScore: 0.15,
    recoveryScore: 0.1,
  };

  public compute(
    growth: number,
    health: number,
    bloomProgress: number,
    lifeStage: PlantLifeStage,
    successionStage: ForestSuccessionStage,
    canopyShadeFactor: number,
    soilRichness: number
  ): BotanicalTelemetry {
    const totalBiomass = Math.min(1.0, growth * (0.5 + health * 0.5));
    const flowerBloomRatio = bloomProgress;
    const canopyCoverRatio = canopyShadeFactor;
    const grassCoverage = Math.min(1.0, 0.2 + growth * 0.8);
    const pollinatorPopulation = Math.min(1.0, bloomProgress * 0.7 + soilRichness * 0.3);

    let forestMaturity = 0.0;
    switch (successionStage) {
      case ForestSuccessionStage.BareGround:
        forestMaturity = 0.0;
        break;
      case ForestSuccessionStage.Grass:
        forestMaturity = 0.15;
        break;
      case ForestSuccessionStage.Wildflowers:
        forestMaturity = 0.3;
        break;
      case ForestSuccessionStage.Shrubs:
        forestMaturity = 0.5;
        break;
      case ForestSuccessionStage.YoungTrees:
        forestMaturity = 0.7;
        break;
      case ForestSuccessionStage.Forest:
        forestMaturity = 0.88;
        break;
      case ForestSuccessionStage.AncientForest:
        forestMaturity = 1.0;
        break;
    }

    let lifeStageDiversity = 0.2;
    if (lifeStage === PlantLifeStage.Blooming || lifeStage === PlantLifeStage.Thriving) {
      lifeStageDiversity = 0.8;
    } else if (lifeStage === PlantLifeStage.Ancient) {
      lifeStageDiversity = 1.0;
    }

    const ecologicalDiversityScore = Math.min(1.0, (forestMaturity * 0.4) + (lifeStageDiversity * 0.3) + (pollinatorPopulation * 0.3));
    const recoveryScore = Math.min(1.0, (totalBiomass * 0.4) + (health * 0.3) + (soilRichness * 0.3));

    this.telemetry = {
      totalBiomass,
      flowerBloomRatio,
      canopyCoverRatio,
      grassCoverage,
      pollinatorPopulation,
      forestMaturity,
      ecologicalDiversityScore,
      recoveryScore,
    };

    return this.telemetry;
  }

  public getTelemetry(): BotanicalTelemetry {
    return this.telemetry;
  }
}
