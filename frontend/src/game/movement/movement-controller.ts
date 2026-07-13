import { MovementModel } from './movement-model';
import { PlayerState, MovementModelId, Vector3State } from './movement-types';
import { MovementIntent, createEmptyIntent, sanitizeIntent } from './movement-intent';
import { GuidedFlowMovement } from './models/guided-flow-movement';
import { FreeFlowMovement } from './models/free-flow-movement';
import { BranchingFlowMovement } from './models/branching-flow-movement';
import { MovementConfig, DEFAULT_GUIDED_FLOW_CONFIG } from './movement-config';

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
    const guided = new GuidedFlowMovement();
    const free = new FreeFlowMovement();
    const branching = new BranchingFlowMovement();

    this.availableModels.set('guided-flow', guided);
    this.availableModels.set('free-flow', free);
    this.availableModels.set('branching-flow', branching);

    this.activeModel = this.availableModels.get(initialModelId) || guided;

    this.playerState = this.createInitialPlayerState();
    this.activeModel.initialize(this.playerState);
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

    this.smoothedIntent = {
      horizontal: this.smoothedIntent.horizontal + (sanitized.horizontal - this.smoothedIntent.horizontal) * alpha,
      vertical: this.smoothedIntent.vertical + (sanitized.vertical - this.smoothedIntent.vertical) * alpha,
      actionHeld: sanitized.actionHeld,
      jumpPressed: sanitized.jumpPressed,
      action: sanitized.action,
    };

    // 3. Update authoritative movement state through active model
    this.playerState = this.activeModel.update(this.playerState, this.smoothedIntent, clampedDelta);
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
