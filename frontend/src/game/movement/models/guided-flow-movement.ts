import { MovementModel } from '../movement-model';
import { PlayerState, MovementModelId } from '../movement-types';
import { MovementIntent } from '../movement-intent';
import { MovementConfig, DEFAULT_GUIDED_FLOW_CONFIG } from '../movement-config';
import { FlowPath, MathFlowPath } from '../flow-path';
import { VerticalPhysics } from '../vertical-physics';

export class GuidedFlowMovement implements MovementModel {
  public readonly id: MovementModelId = 'guided-flow';
  private config: MovementConfig;
  private path: FlowPath;
  private verticalPhysics: VerticalPhysics;

  private currentProgress: number = 0;
  private lateralOffset: number = 0;
  private jumpEventCounter: number = 0;
  private lastJumpIndex: number = 0;

  constructor(
    config: MovementConfig = DEFAULT_GUIDED_FLOW_CONFIG,
    path: FlowPath = new MathFlowPath()
  ) {
    this.config = config;
    this.path = path;
    this.verticalPhysics = new VerticalPhysics(this.config);
  }

  public initialize(initialState: PlayerState): void {
    this.reset();
    this.currentProgress = this.path.getClosestProgress(initialState.position);
    this.jumpEventCounter = initialState.jumpEventCounter ?? 0;
    this.lastJumpIndex = initialState.lastJumpIndex ?? 0;
  }

  public update(
    state: PlayerState,
    intent: MovementIntent,
    deltaTime: number
  ): PlayerState {
    if (deltaTime <= 0) {
      return state;
    }

    // 1. Advance longitudinal progress along path
    const distanceDelta = this.config.baseForwardSpeed * deltaTime;
    const progressDelta = distanceDelta / this.path.getTotalLength();
    this.currentProgress = Math.min(1.0, this.currentProgress + progressDelta);

    // 2. Adjust lateral steering offset
    const targetLateralVelocity = intent.horizontal * this.config.horizontalResponsiveness;
    this.lateralOffset += targetLateralVelocity * deltaTime;

    const maxLateral = this.config.maximumLateralOffset;
    this.lateralOffset = Math.max(-maxLateral, Math.min(maxLateral, this.lateralOffset));

    if (Math.abs(intent.horizontal) < 0.05) {
      this.lateralOffset *= Math.exp(-this.config.drag * deltaTime);
    }

    // 3. Shared vertical physics evaluation
    const vResult = this.verticalPhysics.update(intent.jumpPressed, deltaTime);

    if (vResult.jumpTriggered) {
      this.jumpEventCounter++;
      this.lastJumpIndex = vResult.jumpIndex;
    }

    // 4. Derive authoritative simulation position using TrackFrame
    const worldPos = this.path.trackToWorld(
      this.currentProgress,
      this.lateralOffset,
      this.config.playerRadius + vResult.airborneHeight
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
      airborneHeight: vResult.airborneHeight,
      verticalVelocity: vResult.verticalVelocity,
      isGrounded: vResult.isGrounded,
      impactVelocity: vResult.impactVelocity,
      justLanded: vResult.justLanded,
      jumpsUsed: vResult.jumpsUsed,
      maxJumps: this.config.maxJumps,
      jumpEventCounter: this.jumpEventCounter,
      lastJumpIndex: this.lastJumpIndex,
    };
  }

  public reset(): void {
    this.currentProgress = 0;
    this.lateralOffset = 0;
    this.jumpEventCounter = 0;
    this.lastJumpIndex = 0;
    this.verticalPhysics.reset();
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public setPath(newPath: FlowPath): void {
    this.path = newPath;
  }
}
