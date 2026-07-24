import { WildlifeState, WorldInputSnapshot } from '@flowstate/shared';

export class WildlifeController {
  private populationDensity: number = 0.0;
  private flockCohesion: number = 0.5;
  private activityLevel: number = 0.0;

  public update(worldInput: Readonly<WorldInputSnapshot>, deltaTime: number): Readonly<WildlifeState> {
    if (deltaTime <= 0) return this.getCurrentSnapshot();

    const energyNorm = Math.min(1.0, Math.max(0.0, worldInput.environmentEnergy / 100.0));

    // Population growth differential equation
    const targetPopulation = energyNorm * worldInput.growthPotential;
    this.populationDensity += (targetPopulation - this.populationDensity) * Math.min(1.0, deltaTime * 0.3);

    // Flock cohesion derived from harmony
    this.flockCohesion = Math.min(1.0, Math.max(0.0, worldInput.harmony * 0.9));

    // Activity level scaling
    this.activityLevel = Math.min(1.0, this.populationDensity * worldInput.harmony);

    return this.getCurrentSnapshot();
  }

  public getCurrentSnapshot(): WildlifeState {
    const activeSpeciesCount = Math.floor(this.populationDensity * 4.0);

    return {
      populationDensity: this.populationDensity,
      flockCohesion: this.flockCohesion,
      activityLevel: this.activityLevel,
      activeSpeciesCount,
      timestamp: Date.now(),
    };
  }

  public reset(): void {
    this.populationDensity = 0.0;
    this.flockCohesion = 0.5;
    this.activityLevel = 0.0;
  }
}
