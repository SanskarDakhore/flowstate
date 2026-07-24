import { PlayerExpressionProfile, DEFAULT_PLAYER_EXPRESSION_PROFILE } from '../player/player-expression-profile';
import { EnvironmentProfile, LIVING_VALLEY_PROFILE, CRYSTAL_CAVERNS_PROFILE } from './environment-profile';

export enum PresentationPhase {
  BOOT = 'BOOT',
  LOADING = 'LOADING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  TRANSITION = 'TRANSITION',
  SHUTDOWN = 'SHUTDOWN',
}

export type PresentationMood = 'CALM' | 'LUSH' | 'MYSTICAL' | 'CRYSTALLINE' | 'SILENT';

export interface CameraBehaviorProfile {
  readonly follow: {
    readonly followStiffness: number;       // Exponential decay lambda rate
  };
  readonly lookAhead: {
    readonly lookAheadFactor: number;       // Velocity multiplier for look-ahead target
    readonly maxDistance: number;          // Absolute boundary radius
  };
  readonly jump: {
    readonly verticalFramingBias: number;    // Upward Y-axis framing bias during ascent
  };
  readonly landing: {
    readonly landingCushionAbsorption: number;// Percentage [0.0 - 1.0] of impact momentum absorbed
    readonly cushionRecoveryMs: number;     // Duration (ms) for soft weight recovery
  };
  readonly fov: {
    readonly baseFov: number;               // Baseline Field of View
    readonly maxFovSpeedExpansion: number;  // Conservative speed expansion cap
  };
}

export interface PresentationProfile {
  readonly id: string;
  readonly name: string;
  readonly camera: CameraBehaviorProfile;
}

export interface UnifiedPresentationProfile {
  readonly id: string;
  readonly name: string;
  readonly mood: PresentationMood;
  readonly player: PlayerExpressionProfile;
  readonly camera: CameraBehaviorProfile;
  readonly environment: EnvironmentProfile;
  readonly global: {
    readonly presentationIntensity: number;     // Absolute response scalar [0.0 - 2.0]
    readonly transitionDurationMs: number;      // Cross-profile blend timing window
    readonly environmentalResonanceScale: number;// Vector amplification for reactive feedback
    readonly colorTemperature: number;           // Target Kelvin value overlay for post-processing
  };
}

export type CameraMode =
  | 'Playing'
  | 'LowAngleChase'
  | 'DynamicOrbit'
  | 'CloseAction'
  | 'BirdsEye'
  | 'Idle'
  | 'Landing'
  | 'Airborne'
  | 'Transition';

export interface CameraIntent {
  readonly targetPosition: { x: number; y: number; z: number };
  readonly velocity: { x: number; y: number; z: number };
  readonly desiredFacingDirection: { x: number; y: number; z: number };
  readonly speed: number;
  readonly isGrounded: boolean;
  readonly verticalVelocity: number;
  readonly landingImpact: number;
}

export interface CameraPresentationState {
  readonly position: { x: number; y: number; z: number };
  readonly lookTarget: { x: number; y: number; z: number };
  readonly fov: number;
  readonly rollAngle: number;
  readonly framingBias: number;
  readonly landingOffset: number;
  readonly activeMode: CameraMode;
  readonly cameraError: number;
  readonly currentFollowSpeed: number;
}

export interface PresentationState {
  readonly camera: CameraPresentationState;
  readonly activeProfileId: string;
  readonly presentationEventCount: number;
  readonly lastStepDurationMs: number;
}

export const DEFAULT_CAMERA_PROFILE: CameraBehaviorProfile = {
  follow: {
    followStiffness: 10.0,
  },
  lookAhead: {
    lookAheadFactor: 0.25,
    maxDistance: 6.0,
  },
  jump: {
    verticalFramingBias: 1.2,
  },
  landing: {
    landingCushionAbsorption: 0.18,
    cushionRecoveryMs: 250,
  },
  fov: {
    baseFov: 0.8,
    maxFovSpeedExpansion: 0.08,
  },
};

export const DEFAULT_PRESENTATION_PROFILE: PresentationProfile = {
  id: 'default-valley-camera',
  name: 'Default Valley Camera Profile',
  camera: DEFAULT_CAMERA_PROFILE,
};

export const UNIFIED_LIVING_VALLEY_PROFILE: UnifiedPresentationProfile = {
  id: 'UNIFIED_LIVING_VALLEY',
  name: 'Unified Living Valley',
  mood: 'LUSH',
  player: DEFAULT_PLAYER_EXPRESSION_PROFILE,
  camera: DEFAULT_CAMERA_PROFILE,
  environment: LIVING_VALLEY_PROFILE,
  global: {
    presentationIntensity: 1.0,
    transitionDurationMs: 800,
    environmentalResonanceScale: 1.0,
    colorTemperature: 6500,
  },
};

export const UNIFIED_CRYSTAL_CAVERNS_PROFILE: UnifiedPresentationProfile = {
  id: 'UNIFIED_CRYSTAL_CAVERNS',
  name: 'Unified Crystal Caverns',
  mood: 'CRYSTALLINE',
  player: {
    ...DEFAULT_PLAYER_EXPRESSION_PROFILE,
    id: 'crystal-droplet',
    baseEmissiveIntensity: 0.9,
    fresnelGlowPower: 4.0,
  },
  camera: {
    ...DEFAULT_CAMERA_PROFILE,
    follow: { followStiffness: 14.0 },
  },
  environment: CRYSTAL_CAVERNS_PROFILE,
  global: {
    presentationIntensity: 1.2,
    transitionDurationMs: 1200,
    environmentalResonanceScale: 1.4,
    colorTemperature: 9000,
  },
};

export const DEFAULT_UNIFIED_PRESENTATION_PROFILE = UNIFIED_LIVING_VALLEY_PROFILE;
