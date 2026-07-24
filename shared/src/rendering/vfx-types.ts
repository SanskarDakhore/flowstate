import { Vector3D } from '../track/track-types';

export interface KineticSplashConfig {
  readonly maxParticles: number;     // Default 1,000
  readonly baseParticleLifeMs: number;// Default 500ms
  readonly sparkSpeedScalar: number; // Default 1.5
  readonly wallImpactThreshold: number; // Default 5.0 Ns
}

export interface ParticleEmitterState {
  readonly activeParticleCount: number;
  readonly poolCapacity: number;
  readonly isEmittingTrail: boolean;
  readonly totalBurstsTriggered: number;
}

export interface KineticSparksState {
  readonly position: Vector3D;
  readonly velocity: Vector3D;
  readonly remainingLifeMs: number;
  readonly initialLifeMs: number;
  readonly colorRgb: [number, number, number];
  readonly size: number;
}

export interface VFXBurstResult {
  readonly burstType: 'GROUND_TRAIL' | 'WALL_SPLASH' | 'RING_ERUPTION';
  readonly spawnedParticleCount: number;
  readonly impactIntensity: number;
}
