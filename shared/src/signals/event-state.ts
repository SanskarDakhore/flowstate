export enum WorldEventEnum {
  None = 0,
  BloomBurst = 1,
  RadiantShift = 2,
  HarmonyWave = 3,
  TranscendentCascade = 4,
}

export interface WorldEventState {
  readonly activeEvent: WorldEventEnum;
  readonly intensity: number;
  readonly durationMs: number;
  readonly timeRemainingMs: number;
  readonly timestamp: number;
}

export interface PresentationEventState {
  readonly activeEvent: WorldEventEnum;
  readonly pulseIntensity: number;
  readonly screenGlowHex: string;
}

export function createDefaultWorldEventState(): WorldEventState {
  return {
    activeEvent: WorldEventEnum.None,
    intensity: 0.0,
    durationMs: 0,
    timeRemainingMs: 0,
    timestamp: Date.now(),
  };
}

export function createDefaultPresentationEventState(): PresentationEventState {
  return {
    activeEvent: WorldEventEnum.None,
    pulseIntensity: 0.0,
    screenGlowHex: '#000000',
  };
}
