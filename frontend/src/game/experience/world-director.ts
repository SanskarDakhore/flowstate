import {
  EmotionalMood,
  ExperienceSnapshot,
  ForestSuccessionStage,
  PresentationSnapshot,
  WorldStateEnum,
  WorldStateSnapshot,
} from '@flowstate/shared';
import { WorldMemoryEngine } from './world-memory-engine';
import { SolarArcSolver } from './solar-arc-solver';

export interface WorldConductorHarmonics {
  readonly emergentButterflyDensity: number;
  readonly emergentBirdsongVolume: number;
  readonly emergentPollenCount: number;
  readonly duskFireflyDensity: number;
  readonly breezeHoldActive: boolean;
  readonly sanctuaryWarmth: number;
  readonly canopyShadeFactor: number;
  readonly windDispersalDensity: number;
  readonly forestSuccessionStage: ForestSuccessionStage;
}

export class WorldDirector {
  private memoryEngine = new WorldMemoryEngine();
  private solarSolver = new SolarArcSolver();

  private breezeHoldTimerMs: number = 0;
  private isBreezeHeld: boolean = false;

  public conductWorldPerformance(
    worldSnapshot: Readonly<WorldStateSnapshot>,
    presentationSnapshot: Readonly<PresentationSnapshot>,
    dayProgress: number = 0.5,
    deltaTimeSec: number = 0.016
  ): { experience: ExperienceSnapshot; harmonics: WorldConductorHarmonics } {
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

    // Accumulate persistent session valley memory
    this.memoryEngine.updateMemory(worldSnapshot.vegetationState.health, worldSnapshot.vegetationState.growth);
    const solar = this.solarSolver.computeSolarArc(dayProgress, worldWarmth);

    // World Conductor Timing Alignment: Hold breeze for 3 seconds during flower bloom moments
    const bloomRatio = worldSnapshot.vegetationState.growth;
    if (bloomRatio > 0.7 && !this.isBreezeHeld) {
      this.isBreezeHeld = true;
      this.breezeHoldTimerMs = 3000;
    }

    if (this.isBreezeHeld) {
      this.breezeHoldTimerMs -= deltaTimeSec * 1000;
      if (this.breezeHoldTimerMs <= 0) {
        this.isBreezeHeld = false;
        this.breezeHoldTimerMs = 0;
      }
    }

    // Emergent Conditions
    const isSunlit = solar.sunElevationAngleDeg > 20.0;
    const isDusk = dayProgress > 0.75 && dayProgress < 0.95;
    const isCalmWind = worldSnapshot.weatherState.windSpeed < 0.5;

    const emergentButterflies = (bloomRatio > 0.4 && isSunlit && isCalmWind) ? (bloomRatio - 0.4) * 1.6 : 0.0;
    const emergentBirdsong = Math.min(1.0, worldSnapshot.wildlifeState.flockCohesion * worldWarmth);
    const emergentPollen = bloomRatio * 0.8 * solar.skyWarmthFactor;
    const duskFireflies = (isDusk && bloomRatio > 0.5) ? (bloomRatio - 0.5) * 2.0 : 0.0;

    const canopyShadeFactor = worldSnapshot.vegetationState.canopyCoverRatio ?? 0.1;
    const windDispersalDensity = worldSnapshot.vegetationState.windDispersalDensity ?? 0.1;
    const forestSuccessionStage = worldSnapshot.vegetationState.successionStage ?? ForestSuccessionStage.BareGround;

    const experience: ExperienceSnapshot = {
      mood,
      worldWarmth: (worldWarmth * 0.5) + (solar.skyWarmthFactor * 0.5),
      sanctuaryState: Math.min(1.0, this.memoryEngine.getPersistentBiomass() * 1.2),
      emotionalPrompt: prompt,
      timestamp: Date.now(),
    };

    const harmonics: WorldConductorHarmonics = {
      emergentButterflyDensity: emergentButterflies,
      emergentBirdsongVolume: emergentBirdsong,
      emergentPollenCount: emergentPollen,
      duskFireflyDensity: duskFireflies,
      breezeHoldActive: this.isBreezeHeld,
      sanctuaryWarmth: experience.worldWarmth,
      canopyShadeFactor,
      windDispersalDensity,
      forestSuccessionStage,
    };

    return { experience, harmonics };
  }

  public getMemoryEngine(): WorldMemoryEngine {
    return this.memoryEngine;
  }
}
