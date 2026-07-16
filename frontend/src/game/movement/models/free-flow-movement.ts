import { MovementModel } from '../movement-model';
import { PlayerState, MovementModelId } from '../movement-types';
import { MovementIntent, sanitizeIntent } from '../movement-intent';
import { MovementConfig, DEFAULT_FREE_FLOW_CONFIG } from '../movement-config';
import { FlowPath, MathFlowPath } from '../flow-path';
import { MovementControlEngine } from '../movement-control-engine';

export class FreeFlowMovement implements MovementModel {
  public readonly id: MovementModelId = 'free-flow';
  private config: MovementConfig;
  private path: FlowPath;
  private controlEngine: MovementControlEngine;

  private currentProgress: number = 0;
  private lateralOffset: number = 0;
  private jumpEventCounter: number = 0;
  private lastJumpIndex: number = 0;

  constructor(
    config: MovementConfig = DEFAULT_FREE_FLOW_CONFIG,
    path: FlowPath = new MathFlowPath()
  ) {
    this.config = config;
    this.path = path;
    this.controlEngine = new MovementControlEngine(this.config);
  }

  public initialize(initialState: PlayerState): void {
    this.reset();
    this.currentProgress = this.path.getClosestProgress(initialState.position);
    this.jumpEventCounter = initialState.jumpEventCounter ?? 0;
    this.lastJumpIndex = initialState.lastJumpIndex ?? 0;
  }

  public update(
    state: PlayerState,
    intent: Partial<MovementIntent>,
    deltaTime: number
  ): PlayerState {
    if (deltaTime <= 0) {
      return state;
    }

    const sanitized = sanitizeIntent(intent);

    // Advance longitudinal progress
    const distanceDelta = this.config.baseForwardSpeed * deltaTime;
    const progressDelta = distanceDelta / this.path.getTotalLength();
    this.currentProgress = Math.min(1.0, this.currentProgress + progressDelta);

    // Free steering lateral offset
    const targetLateralVelocity = (sanitized.horizontal ?? 0) * this.config.horizontalResponsiveness;
    this.lateralOffset += targetLateralVelocity * deltaTime;

    const maxLateral = this.config.maximumLateralOffset;
    this.lateralOffset = Math.max(-maxLateral, Math.min(maxLateral, this.lateralOffset));

    // Shared responsiveness control engine step
    const { kinematics, movementState } = this.controlEngine.update(
      sanitized,
      deltaTime,
      state.position,
      state.velocity
    );

    if (kinematics.jumpTriggeredThisFrame) {
      this.jumpEventCounter++;
      this.lastJumpIndex = movementState.currentJumpCount;
    }

    // Authoritative simulation position using TrackFrame
    const worldPos = this.path.trackToWorld(
      this.currentProgress,
      this.lateralOffset,
      this.config.playerRadius + kinematics.airborneHeight
    );

    const trackFrame = this.path.getTrackFrame(this.currentProgress);

    const velocityX = (worldPos.x - state.position.x) / deltaTime;
    const velocityY = (worldPos.y - state.position.y) / deltaTime;
    const velocityZ = (worldPos.z - state.position.z) / deltaTime;

    return {
      position: worldPos,
      velocity: { x: velocityX, y: velocityY, z: velocityZ },
      forward: trackFrame.forward,
      speed: Math.sqrt(velocityX * velocityX + velocityY * velocityY + velocityZ * velocityZ),
      airborneHeight: kinematics.airborneHeight,
      verticalVelocity: kinematics.verticalVelocity,
      isGrounded: kinematics.isGrounded,
      impactVelocity: kinematics.impactVelocity,
      justLanded: kinematics.justLanded,
      jumpsUsed: movementState.currentJumpCount,
      maxJumps: this.config.maxJumpCount,
      jumpEventCounter: this.jumpEventCounter,
      lastJumpIndex: this.lastJumpIndex,
      movementState,
    };
  }

  public reset(): void {
    this.currentProgress = 0;
    this.lateralOffset = 0;
    this.jumpEventCounter = 0;
    this.lastJumpIndex = 0;
    this.controlEngine.reset();
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public setPath(newPath: FlowPath): void {
    this.path = newPath;
  }

  public getControlEngine(): MovementControlEngine {
    return this.controlEngine;
  }
}
