import { Vector3State } from '../movement/movement-types';
import { FlowPath } from '../movement/flow-path';
import { DEFAULT_PHYSICS_CONFIG } from '../movement/movement-config';

export type TargetType = 'RING' | 'GATE' | 'BLOCKER';
export type TargetHeightCategory = 'GROUND' | 'SINGLE_JUMP' | 'DOUBLE_JUMP';

export interface PrototypeTargetDefinition {
  id: string;
  type: TargetType;
  position: Vector3State;
  radius: number;
  progressOnPath: number;
  heightCategory: TargetHeightCategory;
  lateralOffset: number;
  elevation: number;
}

export interface ResolvedTargetTransform {
  surfaceAnchor: Vector3State;
  position: Vector3State;
  forward: Vector3State;
  right: Vector3State;
  up: Vector3State;
}

export interface PrototypeTargetState {
  passed: boolean;
  hit: boolean;
  missed: boolean;
}

export function createInitialTargetState(): PrototypeTargetState {
  return {
    passed: false,
    hit: false,
    missed: false,
  };
}

/**
 * Single Authoritative Target Transform Resolver.
 * Consumed identically by gameplay collision evaluation, Babylon 3D rendering, and F2 debug view.
 */
export function resolveTargetTransform(
  target: PrototypeTargetDefinition,
  path: FlowPath
): ResolvedTargetTransform {
  const frame = path.getTrackFrame(target.progressOnPath);

  const surfaceAnchor: Vector3State = {
    x: frame.center.x + frame.right.x * target.lateralOffset,
    y: frame.center.y + frame.right.y * target.lateralOffset,
    z: frame.center.z + frame.right.z * target.lateralOffset,
  };

  const position: Vector3State = {
    x: surfaceAnchor.x + frame.up.x * target.elevation,
    y: surfaceAnchor.y + frame.up.y * target.elevation,
    z: surfaceAnchor.z + frame.up.z * target.elevation,
  };

  return {
    surfaceAnchor,
    position,
    forward: frame.forward,
    right: frame.right,
    up: frame.up,
  };
}

/**
 * Validates target center lateral offset within playable track width minus safety margin.
 */
export function isTargetPlacementValid(
  lateralOffset: number,
  trackHalfWidth: number = 3.0,
  playerRadius: number = DEFAULT_PHYSICS_CONFIG.playerRadius,
  safetyMargin: number = DEFAULT_PHYSICS_CONFIG.boundarySafetyMargin
): boolean {
  const maxAllowedOffset = trackHalfWidth - playerRadius - safetyMargin;
  return Math.abs(lateralOffset) <= maxAllowedOffset;
}

/**
 * Validates full geometry lateral footprint (critical for blockers to ensure they do not hang off the track).
 */
export function isBlockerPlacementValid(
  lateralOffset: number,
  blockerRadius: number,
  trackHalfWidth: number = 3.0
): boolean {
  return Math.abs(lateralOffset) + blockerRadius <= trackHalfWidth;
}

/**
 * Generates a validated deterministic course layout of test targets
 * with Ground, Single-Jump, and Double-Jump test categories.
 */
export function generateCourseTargets(
  path: FlowPath,
  targetCount: number = 30,
  trackHalfWidth: number = 3.0
): PrototypeTargetDefinition[] {
  const targets: PrototypeTargetDefinition[] = [];
  const maxAllowedLateral = trackHalfWidth - DEFAULT_PHYSICS_CONFIG.playerRadius - DEFAULT_PHYSICS_CONFIG.boundarySafetyMargin;

  for (let i = 1; i <= targetCount; i++) {
    const progress = i / (targetCount + 1);

    let type: TargetType = 'RING';
    let heightCategory: TargetHeightCategory = 'GROUND';
    let radius = 2.0;
    let rawLateralOffset = 0;
    let targetElevation = 1.0; // Center-anchored at player eye level

    if (i % 6 === 0) {
      // Blocker seated directly ON top of ribbon surface
      type = 'BLOCKER';
      radius = 1.2;
      rawLateralOffset = (i % 2 === 0 ? 1 : -1) * 1.5;
      targetElevation = radius; // Base-anchored: center elevation = radius above surface
      heightCategory = 'GROUND';

      // Enforce full geometry constraint
      if (!isBlockerPlacementValid(rawLateralOffset, radius, trackHalfWidth)) {
        rawLateralOffset = Math.sign(rawLateralOffset) * (trackHalfWidth - radius);
      }
    } else if (i % 4 === 0) {
      // Gate arch spanning route
      type = 'GATE';
      radius = 2.2;
      rawLateralOffset = (i % 2 === 0 ? -1 : 1) * 1.0;
      targetElevation = 1.4;
      heightCategory = 'GROUND';
    } else if (i === 15 || i === 23) {
      // Experimental Double-Jump Test Target (2.6u elevation)
      type = 'RING';
      radius = 2.2;
      heightCategory = 'DOUBLE_JUMP';
      targetElevation = 2.6; // Experimental height requiring second jump
      rawLateralOffset = 0;
    } else if (i % 3 === 0) {
      // Single-Jump Ring Target (1.5u elevation)
      type = 'RING';
      radius = 2.0;
      heightCategory = 'SINGLE_JUMP';
      targetElevation = 1.5; // Easily reachable with first jump
      rawLateralOffset = (i % 2 === 0 ? 1 : -1) * 0.8;
    } else {
      // Standard Ground Ring Target (1.0u elevation)
      type = 'RING';
      radius = 2.0;
      heightCategory = 'GROUND';
      targetElevation = 1.0;
      rawLateralOffset = (i % 2 === 0 ? 1 : -1) * 1.2;
    }

    const clampedLateral = Math.max(-maxAllowedLateral, Math.min(maxAllowedLateral, rawLateralOffset));

    // Construct target definition
    const dummyDef: PrototypeTargetDefinition = {
      id: `target_${i}_${type}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      radius,
      progressOnPath: progress,
      heightCategory,
      lateralOffset: clampedLateral,
      elevation: targetElevation,
    };

    // Use single authoritative resolver
    const resolved = resolveTargetTransform(dummyDef, path);
    dummyDef.position = resolved.position;

    targets.push(dummyDef);
  }

  return targets;
}
