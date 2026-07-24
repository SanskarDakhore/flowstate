import {
  DayNightConfig,
  DayNightPhase,
  DayNightState,
  SunLightVectors,
  Vector3D,
} from '@flowstate/shared';

export const DEFAULT_DAY_NIGHT_CONFIG: DayNightConfig = {
  dayCycleDurationSeconds: 120.0,
  dawnStartHour: 5.0,
  noonStartHour: 8.0,
  duskStartHour: 17.0,
  midnightStartHour: 20.0,
};

interface PhaseLightingPreset {
  readonly sunColor: [number, number, number];
  readonly sunIntensity: number;
  readonly ambientColor: [number, number, number];
  readonly ambientIntensity: number;
  readonly emissiveGlow: number;
}

const LIGHTING_PRESETS: Record<DayNightPhase, PhaseLightingPreset> = {
  DAWN: {
    sunColor: [1.0, 0.7, 0.4],
    sunIntensity: 0.8,
    ambientColor: [0.2, 0.1, 0.3],
    ambientIntensity: 0.4,
    emissiveGlow: 1.1,
  },
  NOON: {
    sunColor: [1.0, 0.98, 0.95],
    sunIntensity: 1.2,
    ambientColor: [0.4, 0.6, 0.8],
    ambientIntensity: 0.6,
    emissiveGlow: 1.0,
  },
  DUSK: {
    sunColor: [1.0, 0.4, 0.2],
    sunIntensity: 0.7,
    ambientColor: [0.15, 0.05, 0.25],
    ambientIntensity: 0.35,
    emissiveGlow: 1.2,
  },
  MIDNIGHT: {
    sunColor: [0.4, 0.5, 0.7],
    sunIntensity: 0.3,
    ambientColor: [0.05, 0.1, 0.15],
    ambientIntensity: 0.2,
    emissiveGlow: 1.5,
  },
};

export class DayNightCycleEngine {
  private config: DayNightConfig;
  private elapsedSeconds: number = 0.0;

  constructor(config: DayNightConfig = DEFAULT_DAY_NIGHT_CONFIG, initialHour: number = 12.0) {
    this.config = config;
    this.elapsedSeconds = (initialHour / 24.0) * config.dayCycleDurationSeconds;
  }

  public stepSimulation(deltaTimeSeconds: number = 0.016): DayNightState {
    this.elapsedSeconds = (this.elapsedSeconds + deltaTimeSeconds) % this.config.dayCycleDurationSeconds;

    const normalizedTime = this.elapsedSeconds / this.config.dayCycleDurationSeconds;
    const timeInHours = normalizedTime * 24.0;

    const phase = this.resolvePhase(timeInHours);
    const lighting = this.calculateSunLighting(normalizedTime, phase);

    return {
      currentPhase: phase,
      normalizedTimeOfDay: normalizedTime,
      timeInHours,
      lighting,
      emissiveGlowMultiplier: LIGHTING_PRESETS[phase].emissiveGlow,
    };
  }

  private resolvePhase(hour: number): DayNightPhase {
    if (hour >= this.config.dawnStartHour && hour < this.config.noonStartHour) {
      return 'DAWN';
    } else if (hour >= this.config.noonStartHour && hour < this.config.duskStartHour) {
      return 'NOON';
    } else if (hour >= this.config.duskStartHour && hour < this.config.midnightStartHour) {
      return 'DUSK';
    } else {
      return 'MIDNIGHT';
    }
  }

  private calculateSunLighting(normalizedTime: number, phase: DayNightPhase): SunLightVectors {
    // 3D Sun orbit arc along XY plane with Z offset
    const theta = normalizedTime * Math.PI * 2;
    const rawSunPos: Vector3D = {
      x: Math.cos(theta),
      y: Math.sin(theta),
      z: 0.5,
    };

    const len = Math.sqrt(rawSunPos.x * rawSunPos.x + rawSunPos.y * rawSunPos.y + rawSunPos.z * rawSunPos.z);
    const sunDirection: Vector3D = {
      x: rawSunPos.x / len,
      y: rawSunPos.y / len,
      z: rawSunPos.z / len,
    };

    const preset = LIGHTING_PRESETS[phase];

    return {
      sunDirection,
      sunColorRgb: preset.sunColor,
      sunIntensity: preset.sunIntensity,
      ambientColorRgb: preset.ambientColor,
      ambientIntensity: preset.ambientIntensity,
    };
  }
}
