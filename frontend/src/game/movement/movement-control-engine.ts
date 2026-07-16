import { MovementConfig, DEFAULT_MOVEMENT_CONFIG, PhysicsConfig, DEFAULT_PHYSICS_CONFIG } from '../config/movement-config';
import { DEFAULT_GUIDED_FLOW_CONFIG } from './movement-config';
import {
  EnvironmentPhysicsProfile,
  DEFAULT_ENVIRONMENT_PROFILE,
  MovementProfile,
  DEFAULT_MOVEMENT_PROFILE,
} from '../config/physics-profile';
import { VerticalPhysics, PureVerticalKinematicsResult } from './vertical-physics';
import { MovementStateMachine } from './movement-state-machine';
import { MovementEventDispatcher, MovementEventPayload } from './movement-events';
import {
  MovementState,
  Vector3State,
  LandingResult,
  GravityPhase,
  getMomentumQuality,
  Vector2,
} from './movement-types';
import { MovementIntent, sanitizeIntent } from './movement-intent';

export class MovementControlEngine {
  private config: MovementConfig;
  private envProfile: EnvironmentPhysicsProfile;
  private movProfile: MovementProfile;
  private physics: VerticalPhysics;
  private stateMachine: MovementStateMachine;
  private dispatcher: MovementEventDispatcher;

  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  private currentJumpCount: number = 0;
  private jumpId: number = 0;
  private isGrounded: boolean = true;

  // Diagnostic observer metrics (strictly decoupled from physics simulation)
  private currentVelocityVector: Vector2 = { x: 0, z: 0 };
  private desiredVelocity: Vector2 = { x: 0, z: 0 };
  private velocityError: number = 0;
  private directionDeltaDegrees: number = 0;
  private momentumScore: number = 100.0;
  private flowEfficiency: number = 1.0;

  private latestState: MovementState;

  constructor(
    config: MovementConfig = DEFAULT_GUIDED_FLOW_CONFIG,
    dispatcher: MovementEventDispatcher = new MovementEventDispatcher(),
    envProfile: EnvironmentPhysicsProfile = DEFAULT_ENVIRONMENT_PROFILE,
    movProfile: MovementProfile = DEFAULT_MOVEMENT_PROFILE
  ) {
    this.config = config;
    this.dispatcher = dispatcher;
    this.envProfile = envProfile;
    this.movProfile = movProfile;

    const physConfig: PhysicsConfig =
      typeof (config as any).gravity === 'number'
        ? (config as unknown as PhysicsConfig)
        : { ...DEFAULT_PHYSICS_CONFIG, maxJumps: config.maxJumpCount };

    this.physics = new VerticalPhysics(
      physConfig,
      config.jumpProfile,
      config.variableJumpCutoffFactor,
      this.envProfile,
      this.movProfile
    );
    this.stateMachine = new MovementStateMachine();
    this.latestState = this.createInitialState();
  }

  public setEnvironmentProfile(profile: EnvironmentPhysicsProfile): boolean {
    if (!profile || typeof profile.gravity !== 'number' || typeof profile.airResistance !== 'number') {
      console.warn('[MovementControlEngine] Rejected invalid EnvironmentPhysicsProfile:', profile);
      return false;
    }
    this.envProfile = profile;
    this.physics.setEnvironmentProfile(profile);
    return true;
  }

  public setMovementProfile(profile: MovementProfile): boolean {
    if (
      !profile ||
      typeof profile.maxHorizontalSpeed !== 'number' ||
      typeof profile.groundAcceleration !== 'number' ||
      typeof profile.turnResistance !== 'number'
    ) {
      console.warn('[MovementControlEngine] Rejected invalid MovementProfile:', profile);
      return false;
    }
    this.movProfile = profile;
    this.physics.setMovementProfile(profile);
    return true;
  }

  private createInitialState(): MovementState {
    const score = 100.0;
    return {
      isGrounded: true,
      isAirborne: false,
      isCoyoteWindowActive: false,
      isJumpBuffered: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      currentJumpCount: 0,
      jumpState: this.stateMachine.getCurrentState(),
      jumpId: 0,
      landingImpact: 0,
      verticalVelocity: 0,
      airborneHeight: 0,
      currentHorizontalVelocityVector: { x: 0, z: 0 },
      momentumMagnitude: 0,
      momentumScore: score,
      momentumQuality: getMomentumQuality(score),
      flowEfficiency: 1.0,
      activeGravityPhase: GravityPhase.Grounded,
      activeEnvironmentProfileId: this.envProfile.id,
      activeMovementProfileId: this.movProfile.id,
      currentAirControl: this.movProfile.airControlAuthority,
      appliedGravity: 0,
      targetSpeed: this.movProfile.maxHorizontalSpeed,
      desiredVelocity: { x: 0, z: 0 },
      velocityError: 0,
      directionDelta: 0,
    };
  }

  public update(
    rawIntent: Partial<MovementIntent>,
    deltaTime: number,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    velocity: Vector3State = { x: 0, y: 0, z: 0 }
  ): { kinematics: PureVerticalKinematicsResult; movementState: MovementState } {
    if (deltaTime <= 0) {
      return {
        kinematics: this.physics.getResult(),
        movementState: this.latestState,
      };
    }

    const intent = sanitizeIntent(rawIntent);
    const timestamp = performance.now();
    const wasGroundedPrior = this.isGrounded;

    // 1. Edge input detection: jumpPressed populates input buffer
    if (intent.jumpPressed) {
      this.jumpBufferTimer = this.config.jumpBufferDuration;
      this.dispatcher.emit('JumpBuffered', {
        jumpId: this.jumpId,
        position,
        velocity,
        timestamp,
        jumpState: this.stateMachine.getCurrentState(),
      });
    }

    // 2. Decrement grace windows continuous by delta time
    if (this.coyoteTimer > 0) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - deltaTime);
    }

    // 3. Jump evaluation
    const isCoyoteActive = !this.isGrounded && this.coyoteTimer > 0;
    const canJump =
      this.isGrounded || isCoyoteActive || this.currentJumpCount < this.config.maxJumpCount;

    let triggerJump = false;

    if (this.jumpBufferTimer > 0 && canJump) {
      triggerJump = true;
      this.jumpId++;
      this.currentJumpCount++;

      const eventPayload: MovementEventPayload = {
        jumpId: this.jumpId,
        position,
        velocity,
        timestamp,
        jumpState: this.stateMachine.getCurrentState(),
      };

      this.dispatcher.emit('JumpConsumed', eventPayload);

      if (isCoyoteActive) {
        this.dispatcher.emit('CoyoteJump', eventPayload);
      }

      this.dispatcher.emit('JumpStarted', eventPayload);

      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    // 4. Update pure vertical kinematics integrator
    const jumpHeld = Boolean(intent.jumpHeld || intent.actionHeld || intent.action);
    const vKinematics = this.physics.update(triggerJump, jumpHeld, deltaTime);

    // 5. Detect ground left transition
    if (wasGroundedPrior && !vKinematics.isGrounded && !triggerJump) {
      this.coyoteTimer = this.config.coyoteTimeDuration;
      this.dispatcher.emit('GroundLeft', {
        jumpId: this.jumpId,
        position,
        velocity,
        timestamp,
        jumpState: this.stateMachine.getCurrentState(),
      });
    }

    // 6. State Machine update
    const newJumpState = this.stateMachine.update(vKinematics);
    this.isGrounded = vKinematics.isGrounded;

    if (this.isGrounded) {
      this.currentJumpCount = 0;
    }

    // 7. Landing event resolution
    let landingImpact = 0;
    if (vKinematics.justLanded) {
      landingImpact = Math.abs(vKinematics.impactVelocity);
      const landingResult: LandingResult = {
        impactVelocity: vKinematics.impactVelocity,
        impactStrength: landingImpact,
        surfaceType: 'Default',
        jumpId: this.jumpId,
      };

      const landingPayload: MovementEventPayload = {
        jumpId: this.jumpId,
        position,
        velocity,
        timestamp,
        jumpState: newJumpState,
        extraData: { landingResult },
      };

      this.dispatcher.emit('GroundEntered', landingPayload);
      this.dispatcher.emit('Landed', landingPayload);
    }

    // 8. Horizontal Kinematics Vector Evolution
    this.currentVelocityVector = { x: velocity.x, z: velocity.z };
    const curSpeed = Math.sqrt(
      velocity.x * velocity.x + velocity.z * velocity.z
    );

    const targetSpeed = intent.desiredSpeed > 0 ? intent.desiredSpeed * this.movProfile.maxHorizontalSpeed : intent.movementMagnitude * this.movProfile.maxHorizontalSpeed;
    const inputDirX = intent.desiredDirection.x;
    const inputDirZ = intent.desiredDirection.z;

    this.desiredVelocity = {
      x: inputDirX * targetSpeed,
      z: inputDirZ * targetSpeed,
    };

    // Calculate Direction Delta & Turn Resistance speed bleed
    let dot = 1.0;
    if (curSpeed > 1e-4 && intent.movementMagnitude > 1e-4) {
      const velDirX = velocity.x / curSpeed;
      const velDirZ = velocity.z / curSpeed;
      dot = velDirX * inputDirX + velDirZ * inputDirZ;
      dot = Math.max(-1.0, Math.min(1.0, dot));
      this.directionDeltaDegrees = (Math.acos(dot) * 180) / Math.PI;
    } else {
      this.directionDeltaDegrees = 0;
    }

    // 9. Frame-by-Frame Diagnostic Evaluator (Score 0-100 & Flow Efficiency)
    this.velocityError = Math.sqrt(
      (this.desiredVelocity.x - velocity.x) ** 2 +
        (this.desiredVelocity.z - velocity.z) ** 2
    );

    const maxErr = Math.max(1.0, this.movProfile.maxHorizontalSpeed);
    this.flowEfficiency = Math.max(0, Math.min(1.0, 1.0 - this.velocityError / maxErr));

    const speedPreservation = targetSpeed > 0 ? Math.min(1.0, curSpeed / targetSpeed) : 1.0;
    const directionStability = Math.max(0, 1.0 - this.directionDeltaDegrees / 180.0);
    const landingPenalty = vKinematics.justLanded ? Math.min(1.0, landingImpact / 20.0) : 0;

    const rawScore =
      40.0 * speedPreservation +
      35.0 * directionStability +
      25.0 * this.flowEfficiency -
      15.0 * landingPenalty;

    this.momentumScore = Math.max(0, Math.min(100.0, rawScore));
    const momentumQuality = getMomentumQuality(this.momentumScore);

    // 10. Produce latest MovementState snapshot with full extensions
    this.latestState = {
      isGrounded: vKinematics.isGrounded,
      isAirborne: !vKinematics.isGrounded,
      isCoyoteWindowActive: !vKinematics.isGrounded && this.coyoteTimer > 0,
      isJumpBuffered: this.jumpBufferTimer > 0,
      coyoteTimer: this.coyoteTimer,
      jumpBufferTimer: this.jumpBufferTimer,
      currentJumpCount: this.currentJumpCount,
      jumpState: newJumpState,
      jumpId: this.jumpId,
      landingImpact,
      verticalVelocity: vKinematics.verticalVelocity,
      airborneHeight: vKinematics.airborneHeight,
      currentHorizontalVelocityVector: this.currentVelocityVector,
      momentumMagnitude: curSpeed,
      momentumScore: this.momentumScore,
      momentumQuality,
      flowEfficiency: this.flowEfficiency,
      activeGravityPhase: vKinematics.activeGravityPhase ?? GravityPhase.Grounded,
      activeEnvironmentProfileId: this.envProfile.id,
      activeMovementProfileId: this.movProfile.id,
      currentAirControl: this.isGrounded
        ? 1.0
        : this.movProfile.airControlAuthority,
      appliedGravity: vKinematics.appliedGravity ?? 0,
      targetSpeed,
      desiredVelocity: this.desiredVelocity,
      velocityError: this.velocityError,
      directionDelta: this.directionDeltaDegrees,
    };

    return {
      kinematics: vKinematics,
      movementState: this.latestState,
    };
  }

  public reset(): void {
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.currentJumpCount = 0;
    this.jumpId = 0;
    this.isGrounded = true;
    this.currentVelocityVector = { x: 0, z: 0 };
    this.desiredVelocity = { x: 0, z: 0 };
    this.velocityError = 0;
    this.directionDeltaDegrees = 0;
    this.momentumScore = 100.0;
    this.flowEfficiency = 1.0;
    this.physics.reset();
    this.stateMachine.reset();
    this.latestState = this.createInitialState();
  }

  public setConfig(config: MovementConfig): void {
    this.config = config;
    const physConfig: PhysicsConfig =
      typeof (config as any).gravity === 'number'
        ? (config as unknown as PhysicsConfig)
        : DEFAULT_PHYSICS_CONFIG;
    this.physics.setConfig(physConfig, config.jumpProfile, config.variableJumpCutoffFactor);
  }

  public getMovementState(): MovementState {
    return { ...this.latestState };
  }

  public getEventDispatcher(): MovementEventDispatcher {
    return this.dispatcher;
  }

  public getEnvironmentProfile(): EnvironmentPhysicsProfile {
    return this.envProfile;
  }

  public getMovementProfile(): MovementProfile {
    return this.movProfile;
  }
}
