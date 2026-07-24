import { EmotionalMood, ExperienceSnapshot, PresentationSnapshot, WorldStateEnum, WorldStateSnapshot } from '@flowstate/shared';
import { WorldMemoryEngine } from './world-memory-engine';
import { SolarArcSolver } from './solar-arc-solver';

export interface EcologicalHarmonicState {
  readonly emergentButterflyDensity: number;
  readonly emergentBirdsongVolume: number;
  readonly emergentPollenCount: number;
  readonly sanctuaryWarmth: number;
}

export class ExperienceDirector {
  private memoryEngine = new WorldMemoryEngine();
  private solarSolver = new SolarArcSolver();

  public orchestrateExperience(
    worldSnapshot: Readonly<WorldStateSnapshot>,
    presentationSnapshot: Readonly<PresentationSnapshot>,
    dayProgress: number = 0.5
  ): { experience: ExperienceSnapshot; harmonics: EcologicalHarmonicState } {
    let mood: EmotionalMood = 'quiet';
    let worldWarmth = 0.3;
    let prompt = 'The valley rests in quiet solitude.';

    switch (worldSnapshot.currentState) {
      case WorldStateEnum.IDLE:
        mood = 'quiet';
        worldWarmth = 0.3;
        prompt = 'The valley rests peacefully.';
        break;
      case WorldStateEnum.AWAKENING:
        mood = 'hopeful';
        worldWarmth = 0.5;
        prompt = 'Soft sunlight touches the awakening meadow.';
        break;
      case WorldStateEnum.GROWING:
        mood = 'alive';
        worldWarmth = 0.7;
        prompt = 'Life surges gently through soil and stream.';
        break;
      case WorldStateEnum.BLOOMING:
        mood = 'joyful';
        worldWarmth = 0.85;
        prompt = 'Wildflowers bloom in golden synchrony.';
        break;
      case WorldStateEnum.THRIVING:
      case WorldStateEnum.TRANSCENDENT:
        mood = 'sacred';
        worldWarmth = 1.0;
        prompt = 'The sanctuary reaches pure transcendent flow.';
        break;
    }

    // Update session persistent memory (world remembers healing!)
    this.memoryEngine.updateMemory(worldSnapshot.vegetationState.health, worldSnapshot.vegetationState.growth);
    const solar = this.solarSolver.computeSolarArc(dayProgress, worldWarmth);

    // Ecological Emergence Math (Conditions become favorable -> life emerges)
    const bloomRatio = worldSnapshot.vegetationState.growth;
    const isSunlit = solar.sunElevationAngleDeg > 20.0;
    const isCalmWind = worldSnapshot.weatherState.windSpeed < 0.5;

    const emergentButterflies = (bloomRatio > 0.4 && isSunlit && isCalmWind) ? (bloomRatio - 0.4) * 1.6 : 0.0;
    const emergentBirdsong = Math.min(1.0, worldSnapshot.wildlifeState.flockCohesion * worldWarmth);
    const emergentPollen = bloomRatio * 0.8 * solar.skyWarmthFactor;

    const experience: ExperienceSnapshot = {
      mood,
      worldWarmth: (worldWarmth * 0.5) + (solar.skyWarmthFactor * 0.5),
      sanctuaryState: Math.min(1.0, this.memoryEngine.getPersistentBiomass() * 1.2),
      emotionalPrompt: prompt,
      timestamp: Date.now(),
    };

    const harmonics: EcologicalHarmonicState = {
      emergentButterflyDensity: emergentButterflies,
      emergentBirdsongVolume: emergentBirdsong,
      emergentPollenCount: emergentPollen,
      sanctuaryWarmth: experience.worldWarmth,
    };

    return { experience, harmonics };
  }

  public getMemoryEngine(): WorldMemoryEngine {
    return this.memoryEngine;
  }
}
