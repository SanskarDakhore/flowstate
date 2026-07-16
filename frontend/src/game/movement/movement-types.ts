export type { Vector2 } from './movement-intent';

export interface Vector3State {
  x: number;
  y: number;
  z: number;
}

export interface PureVerticalKinematicsResult {
  airborneHeight: number;
  verticalVelocity: number;
  isGrounded: boolean;
  impactVelocity: number;
  justLanded: boolean;
  jumpTriggeredThisFrame: boolean;
  jumpsUsed?: number;
  jumpTriggered?: boolean;
  jumpIndex?: number;
  activeGravityPhase?: GravityPhase;
  appliedGravity?: number;
}

export const enum JumpState {
  Grounded = 0,
  JumpStarting = 1,
  Ascending = 2,
  Apex = 3,
  Descending = 4,
  Landing = 5,
}

export function getJumpStateName(state: JumpState): string {
  switch (state) {
    case JumpState.Grounded:
      return 'Grounded';
    case JumpState.JumpStarting:
      return 'JumpStarting';
    case JumpState.Ascending:
      return 'Ascending';
    case JumpState.Apex:
      return 'Apex';
    case JumpState.Descending:
      return 'Descending';
    case JumpState.Landing:
      return 'Landing';
    default:
      return 'Unknown';
  }
}

export enum GravityPhase {
  Grounded = 0,
  Ascending = 1,
  Apex = 2,
  Descending = 3,
  FastFall = 4,
}

export function getGravityPhaseName(phase: GravityPhase): string {
  switch (phase) {
    case GravityPhase.Grounded:
      return 'Grounded';
    case GravityPhase.Ascending:
      return 'ASCENDING';
    case GravityPhase.Apex:
      return 'APEX';
    case GravityPhase.Descending:
      return 'DESCENDING';
    case GravityPhase.FastFall:
      return 'FAST_FALL';
    default:
      return 'NONE';
  }
}

export type MomentumQuality = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';

export function getMomentumQuality(score: number): MomentumQuality {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 40) return 'AVERAGE';
  return 'POOR';
}

export type SurfaceType = 'Grass' | 'Rock' | 'Crystal' | 'Water' | 'Wood' | 'Default';

export interface LandingResult {
  impactVelocity: number;
  impactStrength: number;
  surfaceType: SurfaceType;
  jumpId: number;
}

export interface MomentumStateExtensions {
  readonly currentHorizontalVelocityVector: { x: number; z: number };
  readonly momentumMagnitude: number;
  readonly momentumScore: number;           // Continuous score 0.0 - 100.0 (PURELY DIAGNOSTIC)
  readonly momentumQuality: MomentumQuality;  // Derived via getMomentumQuality helper
  readonly flowEfficiency: number;           // 0.0 - 1.0 (desired velocity vs actual velocity)
  readonly activeGravityPhase: GravityPhase;
  readonly activeEnvironmentProfileId: string;
  readonly activeMovementProfileId: string;
  readonly currentAirControl: number;
  readonly appliedGravity: number;
  readonly targetSpeed: number;
  readonly desiredVelocity: { x: number; z: number };
  readonly velocityError: number;
  readonly directionDelta: number;
}

export interface MovementState extends MomentumStateExtensions {
  isGrounded: boolean;
  isAirborne: boolean;
  isCoyoteWindowActive: boolean;
  isJumpBuffered: boolean;
  coyoteTimer: number;
  jumpBufferTimer: number;
  currentJumpCount: number;
  jumpState: JumpState;
  jumpId: number;
  landingImpact: number;
  verticalVelocity: number;
  airborneHeight: number;
}

export interface PlayerState {
  position: Vector3State;
  velocity: Vector3State;
  forward: Vector3State;
  speed: number;
  airborneHeight: number;
  verticalVelocity: number;
  isGrounded: boolean;
  impactVelocity: number;
  justLanded: boolean;
  jumpsUsed: number;
  maxJumps: number;
  jumpEventCounter: number;
  lastJumpIndex: number;
  movementState?: MovementState;
  landingResult?: LandingResult;
}

export type MovementModelId = 'guided-flow' | 'free-flow' | 'branching-flow';
