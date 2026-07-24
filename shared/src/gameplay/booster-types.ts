import { Vector3D } from '../track/track-types';

export interface EnergyRingPrimitive {
  readonly id: string;
  readonly center: Vector3D;
  readonly normal: Vector3D;       // Aperture direction normal
  readonly radius: number;         // Aperture radius (e.g. 3.0m)
  readonly magneticRadius: number; // Magnetism pull influence radius (e.g. 12.0m)
  readonly magneticStrength: number; // Field scalar k_mag
  readonly boostVelocityMagnitude: number; // Impulse speed gain (e.g. 10.0 m/s)
  readonly isCollected?: boolean;
}

export interface MomentumBoosterPad {
  readonly id: string;
  readonly center: Vector3D;
  readonly forwardDirection: Vector3D; // Track tangent forward direction
  readonly width: number;
  readonly length: number;
  readonly boostSpeedBonus: number; // Speed addition (+15 m/s)
  readonly cooldownMs: number;
}

export interface MagnetismFieldState {
  readonly isInMagneticField: boolean;
  readonly magneticForce: Vector3D; // Inverse-square attraction force vector
  readonly distanceToRing: number;
  readonly targetRingId?: string;
}

export interface BoosterImpulseResult {
  readonly hasTriggeredBoost: boolean;
  readonly impulseVelocity: Vector3D;
  readonly resonanceGain: number;
  readonly activeBoosterId?: string;
}
