import { MovementModel } from './movement-model';
import { PlayerState, MovementModelId, Vector3State, MovementState, JumpState, GravityPhase, getMomentumQuality } from './movement-types';
import { MovementIntent, createEmptyIntent, sanitizeIntent } from './movement-intent';
import { GuidedFlowMovement } from './models/guided-flow-movement';
import { FreeFlowMovement } from './models/free-flow-movement';
import { BranchingFlowMovement } from './models/branching-flow-movement';
import { MovementConfig, DEFAULT_GUIDED_FLOW_CONFIG } from './movement-config';
import { MovementEventDispatcher } from './movement-events';
import { DebugTelemetry } from '../telemetry/debug-telemetry';

export class MovementController {
  private activeModel: MovementModel;
  private availableModels: Map<MovementModelId, MovementModel> = new Map();

  private playerState: PlayerState;
  private smoothedIntent: MovementIntent = createEmptyIntent();
  private smoothingFactor: number;

  private readonly maxDeltaTimeSeconds: number = 0.1; // Max 100ms delta clamp for safety

  constructor(
    initialModelId: MovementModelId = 'guided-flow',
    config: MovementConfig = DEFAULT_GUIDED_FLOW_CONFIG
  ) {
    this.smoothingFactor = config.inputSmoothingFactor;

    // Instantiate models
    const guided = new GuidedFlowMovement(config);
    const free = new FreeFlowMovement(config);
    const branching = new BranchingFlowMovement(config);

    this.availableModels.set('guided-flow', guided);
    this.availableModels.set('free-flow', free);
    this.availableModels.set('branching-flow', branching);

    this.activeModel = this.availableModels.get(initialModelId) || guided;

    this.playerState = this.createInitialPlayerState();
    this.activeModel.initialize(this.playerState);

    // Register active telemetry provider with DebugTelemetry singleton
    DebugTelemetry.register('movement', () => this.getMovementState());
  }

  private createInitialPlayerState(): PlayerState {
    return {
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      forward: { x: 0, y: 0, z: 1 },
      speed: 0,
      airborneHeight: 0,
      verticalVelocity: 0,
      isGrounded: true,
      impactVelocity: 0,
      justLanded: false,
      jumpsUsed: 0,
      maxJumps: 2,
      jumpEventCounter: 0,
      lastJumpIndex: 0,
    };
  }

  public update(rawIntent: Partial<MovementIntent>, deltaTimeSeconds: number): PlayerState {
    // 1. Clamp abnormally large deltas (prevents physics explosions after tab switch/pause)
    const clampedDelta = Math.min(this.maxDeltaTimeSeconds, Math.max(0, deltaTimeSeconds));
    if (clampedDelta <= 0) {
      return this.playerState;
    }

    // 2. Sanitize and smooth input intent
    const sanitized = sanitizeIntent(rawIntent);
    const alpha = Math.min(1.0, this.smoothingFactor * clampedDelta);

    const prevH = this.smoothedIntent.horizontal ?? 0;
    const prevV = this.smoothedIntent.vertical ?? 0;
    const sanH = sanitized.horizontal ?? 0;
    const sanV = sanitized.vertical ?? 0;

    const nextH = prevH + (sanH - prevH) * alpha;
    const nextV = prevV + (sanV - prevV) * alpha;

    this.smoothedIntent = sanitizeIntent({
      horizontal: nextH,
      vertical: nextV,
      desiredDirection: sanitized.desiredDirection,
      desiredSpeed: sanitized.desiredSpeed,
      jumpPressed: sanitized.jumpPressed,
      jumpHeld: sanitized.jumpHeld,
      actionHeld: sanitized.actionHeld,
      action: sanitized.action,
    });

    // 3. Update authoritative movement state through active model
    this.playerState = this.activeModel.update(this.playerState, this.smoothedIntent, clampedDelta);

    // Expose active MovementState globally for dev telemetry compatibility
    if (typeof window !== 'undefined' && this.playerState.movementState) {
      (window as any).__FLOWSTATE_MOVEMENT_STATE__ = this.playerState.movementState;
    }

    return { ...this.playerState };
  }

  public switchModel(modelId: MovementModelId): void {
    const nextModel = this.availableModels.get(modelId);
    if (!nextModel) {
      console.warn(`[MovementController] Unknown movement model ID: ${modelId}`);
      return;
    }

    if (this.activeModel.id === modelId) {
      return;
    }

    this.activeModel = nextModel;
    this.reset();
  }

  public reset(): void {
    this.playerState = this.createInitialPlayerState();
    this.smoothedIntent = createEmptyIntent();
    this.activeModel.reset();
    this.activeModel.initialize(this.playerState);
  }

  public getPlayerState(): PlayerState {
    return { ...this.playerState };
  }

  public getMovementState(): MovementState {
    if (this.playerState.movementState) {
      return { ...this.playerState.movementState };
    }

    const score = 100;
    return {
      isGrounded: this.playerState.isGrounded,
      isAirborne: !this.playerState.isGrounded,
      isCoyoteWindowActive: false,
      isJumpBuffered: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      currentJumpCount: this.playerState.jumpsUsed,
      jumpState: this.playerState.isGrounded ? JumpState.Grounded : JumpState.Ascending,
      jumpId: 0,
      landingImpact: Math.abs(this.playerState.impactVelocity),
      verticalVelocity: this.playerState.verticalVelocity,
      airborneHeight: this.playerState.airborneHeight,
      currentHorizontalVelocityVector: { x: this.playerState.velocity.x, z: this.playerState.velocity.z },
      momentumMagnitude: this.playerState.speed,
      momentumScore: score,
      momentumQuality: getMomentumQuality(score),
      flowEfficiency: 1.0,
      activeGravityPhase: this.playerState.isGrounded ? GravityPhase.Grounded : GravityPhase.Ascending,
      activeEnvironmentProfileId: 'terrestrial-ground',
      activeMovementProfileId: 'default-responsive',
      currentAirControl: 0.6,
      appliedGravity: -28.0,
      targetSpeed: 20.0,
      desiredVelocity: { x: 0, z: 0 },
      velocityError: 0,
      directionDelta: 0,
    };
  }

  public getEventDispatcher(): MovementEventDispatcher | null {
    if ('getControlEngine' in this.activeModel && typeof (this.activeModel as any).getControlEngine === 'function') {
      return (this.activeModel as any).getControlEngine().getEventDispatcher();
    }
    return null;
  }

  public getActiveModelId(): MovementModelId {
    return this.activeModel.id;
  }

  public getSmoothedIntent(): MovementIntent {
    return { ...this.smoothedIntent };
  }

  public setPlayerPosition(pos: Vector3State): void {
    this.playerState.position = { ...pos };
  }
}
