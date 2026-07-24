import { Vector3D } from '../track/track-types';

export interface SpherePrimitive {
  readonly center: Vector3D;
  readonly radius: number;
}

export interface TrackBoundaryWall {
  readonly id: string;
  readonly planeNormal: Vector3D; // Normalized outward normal pointing inward to track
  readonly pointOnPlane: Vector3D;
  readonly restitution: number;  // Bounce coefficient [0.0 - 1.0]
  readonly friction: number;     // Wall friction coefficient
}

export interface TrackWorldClearanceZone {
  readonly trackCenter: Vector3D;
  readonly trackTangent: Vector3D;
  readonly trackWidth: number;
  readonly requiredClearanceRadius: number; // e.g. trackWidth/2 + 2.0m buffer
  readonly maxAllowedTerrainHeight: number;
}

export interface CollisionContact {
  readonly hasContact: boolean;
  readonly contactPoint: Vector3D;
  readonly normal: Vector3D;
  readonly penetrationDepth: number;
  readonly normalImpulseMagnitude: number;
  readonly isWallBounce: boolean;
}

export interface TrackRespawnCheckpoint {
  readonly safePosition: Vector3D;
  readonly safeVelocity: Vector3D;
  readonly trackProgressRatio: number; // [0.0 - 1.0]
  readonly isOutOfBounds: boolean;
}
