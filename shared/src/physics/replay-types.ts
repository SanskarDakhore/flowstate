import { Vector3D } from '../track/track-types';

export interface ReplayMovementIntent {
  readonly horizontal?: number;
  readonly vertical?: number;
  readonly action?: boolean;
  readonly jumpPressed?: boolean;
  readonly actionHeld?: boolean;
}

export interface ReplayFrameInput {
  readonly frameIndex: number;
  readonly deltaTime: number;
  readonly intent: ReplayMovementIntent;
}

export interface SimulationChecksum {
  readonly frameIndex: number;
  readonly positionHash: number;
  readonly position: Vector3D;
  readonly velocity: Vector3D;
}

export interface ReplayValidationResult {
  readonly isDeterministic: boolean;
  readonly totalRecordedFrames: number;
  readonly divergentFrameIndex?: number;
  readonly checksumsMatch: boolean;
}
