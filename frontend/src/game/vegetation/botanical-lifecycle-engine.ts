import { PlantLifeStage } from '@flowstate/shared';

export class BotanicalLifecycleEngine {
  private currentStage: PlantLifeStage = PlantLifeStage.Dormant;
  private stageProgress: number = 0.0; // 0.0 to 1.0 within current stage
  private persistenceTimeSec: number = 0.0;

  public update(
    health: number,
    growth: number,
    harmony: number,
    soilRichness: number,
    deltaTimeSec: number
  ): PlantLifeStage {
    if (deltaTimeSec <= 0) return this.currentStage;

    this.persistenceTimeSec += deltaTimeSec;

    // Biological life cycle transition criteria
    switch (this.currentStage) {
      case PlantLifeStage.Dormant:
        if (harmony > 0.15 && soilRichness > 0.1) {
          this.currentStage = PlantLifeStage.Seed;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Seed:
        this.stageProgress += deltaTimeSec * 0.1 * (1.0 + harmony);
        if (this.stageProgress >= 1.0) {
          this.currentStage = PlantLifeStage.Sprouting;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Sprouting:
        this.stageProgress += deltaTimeSec * 0.08 * (0.5 + health);
        if (this.stageProgress >= 1.0 && growth > 0.15) {
          this.currentStage = PlantLifeStage.Juvenile;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Juvenile:
        this.stageProgress += deltaTimeSec * 0.06 * (0.5 + growth);
        if (this.stageProgress >= 1.0 && growth > 0.35) {
          this.currentStage = PlantLifeStage.Growing;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Growing:
        this.stageProgress += deltaTimeSec * 0.05 * (0.5 + health);
        if (growth >= 0.6 && harmony >= 0.5) {
          this.currentStage = PlantLifeStage.Blooming;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Blooming:
        this.stageProgress += deltaTimeSec * 0.04 * harmony;
        if (growth >= 0.8 && health >= 0.85) {
          this.currentStage = PlantLifeStage.Thriving;
          this.stageProgress = 0.0;
        } else if (health < 0.3) {
          this.currentStage = PlantLifeStage.NaturalDecline;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Thriving:
        if (this.persistenceTimeSec > 600 && health > 0.9) { // 10 mins continuous thriving
          this.currentStage = PlantLifeStage.Ancient;
          this.stageProgress = 0.0;
        } else if (health < 0.4) {
          this.currentStage = PlantLifeStage.NaturalDecline;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.Ancient:
        // Ancient plants persist indefinitely as landmarks unless severe degradation occurs
        if (health < 0.15) {
          this.currentStage = PlantLifeStage.NaturalDecline;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.NaturalDecline:
        this.stageProgress += deltaTimeSec * 0.05;
        if (this.stageProgress >= 1.0) {
          this.currentStage = PlantLifeStage.SoilRenewal;
          this.stageProgress = 0.0;
        }
        break;

      case PlantLifeStage.SoilRenewal:
        this.stageProgress += deltaTimeSec * 0.08;
        if (this.stageProgress >= 1.0) {
          this.currentStage = PlantLifeStage.Dormant;
          this.stageProgress = 0.0;
        }
        break;
    }

    return this.currentStage;
  }

  public getCurrentStage(): PlantLifeStage {
    return this.currentStage;
  }

  public getStageProgress(): number {
    return this.stageProgress;
  }

  public reset(): void {
    this.currentStage = PlantLifeStage.Dormant;
    this.stageProgress = 0.0;
    this.persistenceTimeSec = 0.0;
  }
}
