import { Vector3D } from '../track/track-types';

export type DayNightPhase = 'DAWN' | 'NOON' | 'DUSK' | 'MIDNIGHT';

export interface DayNightConfig {
  readonly dayCycleDurationSeconds: number; // e.g. 120s realtime = 24h game time
  readonly dawnStartHour: number; // 05:00
  readonly noonStartHour: number; // 08:00
  readonly duskStartHour: number; // 17:00
  readonly midnightStartHour: number; // 20:00
}

export interface SunLightVectors {
  readonly sunDirection: Vector3D;
  readonly sunColorRgb: [number, number, number];
  readonly sunIntensity: number;
  readonly ambientColorRgb: [number, number, number];
  readonly ambientIntensity: number;
}

export interface DayNightState {
  readonly currentPhase: DayNightPhase;
  readonly normalizedTimeOfDay: number; // [0.0, 1.0] (0 = Midnight, 0.25 = Dawn, 0.5 = Noon, 0.75 = Dusk)
  readonly timeInHours: number;         // [0.0, 24.0]
  readonly lighting: SunLightVectors;
  readonly emissiveGlowMultiplier: number; // 1.0x day -> 1.5x night
}
