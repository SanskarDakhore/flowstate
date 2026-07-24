export interface MusicState {
  readonly volume: number;
  readonly crossfade: number;
  readonly eqFrequency: number;
  readonly reverbLevel: number;
  readonly intensity: number;
  readonly filterCutoff: number;
}

export interface AmbientState {
  readonly windVolume: number;
  readonly birdsVolume: number;
  readonly leavesVolume: number;
  readonly waterVolume: number;
  readonly insectsVolume: number;
  readonly distantAmbienceVolume: number;
}

export interface SFXState {
  readonly sfxVolume: number;
  readonly spatialBlend: number;
}

export interface HapticState {
  readonly intensity: number;
  readonly durationMs: number;
  readonly frequencyHz: number;
  readonly style: 'light' | 'medium' | 'heavy' | 'pulse';
}

export interface AudioState {
  readonly music: MusicState;
  readonly ambient: AmbientState;
  readonly sfx: SFXState;
  readonly haptics: HapticState;
}

export function createDefaultAudioState(): AudioState {
  return {
    music: {
      volume: 0.8,
      crossfade: 0,
      eqFrequency: 1000,
      reverbLevel: 0.2,
      intensity: 0.1,
      filterCutoff: 20000,
    },
    ambient: {
      windVolume: 0.3,
      birdsVolume: 0.0,
      leavesVolume: 0.1,
      waterVolume: 0.2,
      insectsVolume: 0.0,
      distantAmbienceVolume: 0.4,
    },
    sfx: {
      sfxVolume: 1.0,
      spatialBlend: 0.8,
    },
    haptics: {
      intensity: 0.0,
      durationMs: 0,
      frequencyHz: 60,
      style: 'light',
    },
  };
}
