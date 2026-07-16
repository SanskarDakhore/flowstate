export interface JumpProfile {
  readonly initialImpulse: number;
  readonly gravityScale: number;
  readonly releaseCurve: (progress: number) => number; // 0.0 to 1.0 curve input
  readonly apexGravity: number;
  readonly fallGravity: number;
  readonly terminalVelocity: number;
}

export const DEFAULT_JUMP_PROFILE: JumpProfile = {
  initialImpulse: 10.5,
  gravityScale: 1.0,
  releaseCurve: (progress: number) => Math.max(0.0, Math.min(1.0, progress)), // Default linear scaling
  apexGravity: 0.8, // Reduced gravity at apex for float feel
  fallGravity: 1.25, // Slightly heavier gravity when falling for crisp descent
  terminalVelocity: -40.0,
};

export interface MovementConfig {
  readonly version: number;
  readonly maxJumpCount: number;
  readonly coyoteTimeDuration: number;
  readonly jumpBufferDuration: number;
  readonly airControl: number;
  readonly landingVelocityThreshold: number;
  readonly variableJumpCutoffFactor: number;
  readonly jumpProfile: JumpProfile;
}

export const DEFAULT_MOVEMENT_CONFIG: MovementConfig = {
  version: 1,
  maxJumpCount: 2,
  coyoteTimeDuration: 0.15, // 150ms grace window after leaving ledge
  jumpBufferDuration: 0.15, // 150ms pre-landing jump cache window
  airControl: 0.6,
  landingVelocityThreshold: -5.0,
  variableJumpCutoffFactor: 0.5,
  jumpProfile: DEFAULT_JUMP_PROFILE,
};

export interface PhysicsConfig {
  readonly gravity: number;
  readonly groundAcceleration: number;
  readonly airAcceleration: number;
  readonly maxHorizontalSpeed: number;
  readonly terminalVerticalVelocity: number;
  readonly playerRadius: number;
  readonly boundarySafetyMargin: number;
  readonly jumpImpulse: number;
  readonly secondaryJumpImpulse: number;
  readonly maxJumps: number;
  readonly maxFallSpeed: number;
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: -28.0,
  groundAcceleration: 15.0,
  airAcceleration: 10.0,
  maxHorizontalSpeed: 20.0,
  terminalVerticalVelocity: -40.0,
  playerRadius: 0.45,
  boundarySafetyMargin: 0.5,
  jumpImpulse: 10.5,
  secondaryJumpImpulse: 9.0,
  maxJumps: 2,
  maxFallSpeed: -40.0,
};
