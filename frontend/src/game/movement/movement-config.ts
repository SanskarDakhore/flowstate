import {
  MovementConfig as BaseMovementConfig,
  PhysicsConfig,
  DEFAULT_MOVEMENT_CONFIG,
  DEFAULT_PHYSICS_CONFIG,
  DEFAULT_JUMP_PROFILE,
  JumpProfile,
} from '../config/movement-config';

export * from '../config/movement-config';

export interface MovementPhysicsConfig extends PhysicsConfig {
  playerRadius: number;
  jumpImpulse: number;
  secondaryJumpImpulse: number;
  maxJumps: number;
  maxFallSpeed: number;
  boundarySafetyMargin: number;
  gravityScale?: number;
}

export const DEFAULT_PHYSICS_CONFIG_EXTENDED: MovementPhysicsConfig = {
  ...DEFAULT_PHYSICS_CONFIG,
  playerRadius: 0.45,
  jumpImpulse: DEFAULT_JUMP_PROFILE.initialImpulse,
  secondaryJumpImpulse: 9.0,
  maxJumps: DEFAULT_MOVEMENT_CONFIG.maxJumpCount,
  maxFallSpeed: DEFAULT_PHYSICS_CONFIG.terminalVerticalVelocity,
  boundarySafetyMargin: 0.5,
  gravityScale: 1.0,
};

export interface LegacyMovementConfig extends BaseMovementConfig, MovementPhysicsConfig {
  baseForwardSpeed: number;
  maximumSpeed: number;
  acceleration: number;
  deceleration: number;
  horizontalResponsiveness: number;
  verticalResponsiveness: number;
  steeringStrength: number;
  drag: number;
  turnSmoothing: number;
  boundaryStrength: number;
  maximumLateralOffset: number;
  maximumVerticalOffset: number;
  inputSmoothingFactor: number;
}

export type MovementConfig = LegacyMovementConfig;

export const DEFAULT_GUIDED_FLOW_CONFIG: MovementConfig = {
  ...DEFAULT_MOVEMENT_CONFIG,
  ...DEFAULT_PHYSICS_CONFIG_EXTENDED,
  baseForwardSpeed: 12.0,
  maximumSpeed: 20.0,
  acceleration: 15.0,
  deceleration: 10.0,
  horizontalResponsiveness: 18.0,
  verticalResponsiveness: 15.0,
  steeringStrength: 10.0,
  drag: 3.0,
  turnSmoothing: 12.0,
  boundaryStrength: 25.0,
  maximumLateralOffset: 2.5,
  maximumVerticalOffset: 3.0,
  inputSmoothingFactor: 12.0,
};

export const DEFAULT_FREE_FLOW_CONFIG: MovementConfig = {
  ...DEFAULT_MOVEMENT_CONFIG,
  ...DEFAULT_PHYSICS_CONFIG_EXTENDED,
  baseForwardSpeed: 10.0,
  maximumSpeed: 18.0,
  acceleration: 12.0,
  deceleration: 8.0,
  horizontalResponsiveness: 14.0,
  verticalResponsiveness: 12.0,
  steeringStrength: 2.5,
  drag: 2.0,
  turnSmoothing: 8.0,
  boundaryStrength: 30.0,
  maximumLateralOffset: 2.5,
  maximumVerticalOffset: 3.0,
  inputSmoothingFactor: 10.0,
};

export const DEFAULT_BRANCHING_FLOW_CONFIG: MovementConfig = {
  ...DEFAULT_MOVEMENT_CONFIG,
  ...DEFAULT_PHYSICS_CONFIG_EXTENDED,
  baseForwardSpeed: 11.0,
  maximumSpeed: 19.0,
  acceleration: 14.0,
  deceleration: 9.0,
  horizontalResponsiveness: 16.0,
  verticalResponsiveness: 14.0,
  steeringStrength: 8.0,
  drag: 2.5,
  turnSmoothing: 10.0,
  boundaryStrength: 25.0,
  maximumLateralOffset: 2.5,
  maximumVerticalOffset: 3.0,
  inputSmoothingFactor: 12.0,
};
