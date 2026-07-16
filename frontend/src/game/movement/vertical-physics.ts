import { PhysicsConfig, DEFAULT_PHYSICS_CONFIG, JumpProfile, DEFAULT_JUMP_PROFILE } from '../config/movement-config';
import {
  EnvironmentPhysicsProfile,
  DEFAULT_ENVIRONMENT_PROFILE,
  MovementProfile,
  DEFAULT_MOVEMENT_PROFILE,
} from '../config/physics-profile';
import { PureVerticalKinematicsResult, GravityPhase } from './movement-types';

export type { PureVerticalKinematicsResult };

export function computeActiveGravity(
  vy: number,
  isGrounded: boolean,
  envProfile: EnvironmentPhysicsProfile,
  movProfile: MovementProfile
): { activeGravity: number; phase: GravityPhase } {
  if (isGrounded) {
    return { activeGravity: 0, phase: GravityPhase.Grounded };
  }

  const baseGravity = envProfile.gravity;

  if (Math.abs(vy) <= movProfile.apexVelocityThreshold) {
    return {
      activeGravity: baseGravity * movProfile.gravityPhaseScalars.apex,
      phase: GravityPhase.Apex,
    };
  }

  if (vy > 0) {
    return {
      activeGravity: baseGravity * movProfile.gravityPhaseScalars.ascending,
      phase: GravityPhase.Ascending,
    };
  }

  return {
    activeGravity: baseGravity * movProfile.gravityPhaseScalars.descending,
    phase: GravityPhase.Descending,
  };
}

export class VerticalPhysics {
  private physicsConfig: PhysicsConfig;
  private jumpProfile: JumpProfile;
  private variableJumpCutoffFactor: number;

  private envProfile: EnvironmentPhysicsProfile;
  private movProfile: MovementProfile;

  private airborneHeight: number = 0;
  private verticalVelocity: number = 0;
  private isGrounded: boolean = true;
  private impactVelocity: number = 0;
  private justLanded: boolean = false;
  private jumpsUsed: number = 0;
  private activeGravityPhase: GravityPhase = GravityPhase.Grounded;
  private lastAppliedGravity: number = 0;

  constructor(
    physicsConfig: PhysicsConfig = DEFAULT_PHYSICS_CONFIG,
    jumpProfile: JumpProfile = DEFAULT_JUMP_PROFILE,
    variableJumpCutoffFactor: number = 0.5,
    envProfile: EnvironmentPhysicsProfile = DEFAULT_ENVIRONMENT_PROFILE,
    movProfile: MovementProfile = DEFAULT_MOVEMENT_PROFILE
  ) {
    this.physicsConfig = physicsConfig;
    this.jumpProfile = jumpProfile;
    this.variableJumpCutoffFactor = variableJumpCutoffFactor;
    this.envProfile = envProfile;
    this.movProfile = movProfile;
  }

  public setEnvironmentProfile(profile: EnvironmentPhysicsProfile): void {
    this.envProfile = profile;
  }

  public setMovementProfile(profile: MovementProfile): void {
    this.movProfile = profile;
  }

  public update(
    triggerJump: boolean,
    jumpHeldOrDeltaTime: boolean | number,
    deltaTimeSeconds?: number
  ): PureVerticalKinematicsResult {
    this.justLanded = false;
    let jumpTriggeredThisFrame = false;

    let jumpHeld = true;
    let deltaTime = 0;

    if (typeof jumpHeldOrDeltaTime === 'number') {
      deltaTime = jumpHeldOrDeltaTime;
      jumpHeld = true;
    } else {
      jumpHeld = jumpHeldOrDeltaTime;
      deltaTime = deltaTimeSeconds ?? 0;
    }

    if (deltaTime <= 0) {
      return this.getResult(jumpTriggeredThisFrame);
    }

    // Discrete jump impulse trigger
    const maxJumps = this.physicsConfig.maxJumps ?? 2;
    if (triggerJump && this.jumpsUsed < maxJumps) {
      if (this.isGrounded || this.jumpsUsed === 0) {
        this.jumpsUsed = 1;
        this.verticalVelocity = this.jumpProfile.initialImpulse;
        this.isGrounded = false;
        jumpTriggeredThisFrame = true;
      } else if (this.jumpsUsed === 1) {
        this.jumpsUsed = 2;
        this.verticalVelocity = this.physicsConfig.secondaryJumpImpulse ?? 9.0;
        this.isGrounded = false;
        jumpTriggeredThisFrame = true;
      }
    }

    // Continuous physics integration while airborne
    if (!this.isGrounded) {
      // Ascending variable jump cutoff handling
      if (this.verticalVelocity > 0 && !jumpHeld) {
        const curveFactor = this.jumpProfile.releaseCurve(this.variableJumpCutoffFactor);
        this.verticalVelocity *= Math.pow(curveFactor, deltaTime * 12.0);
      }

      // Compute multi-phase gravity evaluation
      const { activeGravity, phase } = computeActiveGravity(
        this.verticalVelocity,
        this.isGrounded,
        this.envProfile,
        this.movProfile
      );

      this.activeGravityPhase = phase;
      this.lastAppliedGravity = activeGravity;

      this.verticalVelocity += activeGravity * deltaTime;

      // Terminal velocity ceiling
      const maxFallSpeed = Math.min(
        this.movProfile.terminalVerticalVelocity,
        this.physicsConfig.terminalVerticalVelocity,
        this.jumpProfile.terminalVelocity
      );
      if (this.verticalVelocity < maxFallSpeed) {
        this.verticalVelocity = maxFallSpeed;
      }

      this.airborneHeight += this.verticalVelocity * deltaTime;

      // Landing resolution
      if (this.airborneHeight <= 0) {
        this.airborneHeight = 0;
        this.isGrounded = true;
        this.impactVelocity = this.verticalVelocity;
        this.verticalVelocity = 0;
        this.justLanded = true;
        this.jumpsUsed = 0;
        this.activeGravityPhase = GravityPhase.Grounded;
        this.lastAppliedGravity = 0;
      }
    } else {
      this.activeGravityPhase = GravityPhase.Grounded;
      this.lastAppliedGravity = 0;
    }

    return this.getResult(jumpTriggeredThisFrame);
  }

  public setConfig(
    physicsConfig: PhysicsConfig,
    jumpProfile: JumpProfile,
    variableJumpCutoffFactor: number = 0.5
  ): void {
    this.physicsConfig = physicsConfig;
    this.jumpProfile = jumpProfile;
    this.variableJumpCutoffFactor = variableJumpCutoffFactor;
  }

  public reset(): void {
    this.airborneHeight = 0;
    this.verticalVelocity = 0;
    this.isGrounded = true;
    this.impactVelocity = 0;
    this.justLanded = false;
    this.jumpsUsed = 0;
    this.activeGravityPhase = GravityPhase.Grounded;
    this.lastAppliedGravity = 0;
  }

  public getResult(jumpTriggeredThisFrame: boolean = false): PureVerticalKinematicsResult {
    return {
      airborneHeight: this.airborneHeight,
      verticalVelocity: this.verticalVelocity,
      isGrounded: this.isGrounded,
      impactVelocity: this.impactVelocity,
      justLanded: this.justLanded,
      jumpTriggeredThisFrame,
      jumpsUsed: this.jumpsUsed,
      jumpTriggered: jumpTriggeredThisFrame,
      jumpIndex: jumpTriggeredThisFrame ? this.jumpsUsed : 0,
      activeGravityPhase: this.activeGravityPhase,
      appliedGravity: this.lastAppliedGravity,
    };
  }

  public getState(): PureVerticalKinematicsResult {
    return this.getResult();
  }
}
