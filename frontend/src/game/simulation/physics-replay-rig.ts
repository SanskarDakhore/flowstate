import {
  ReplayFrameInput,
  ReplayMovementIntent,
  ReplayValidationResult,
  SimulationChecksum,
  Vector3D,
} from '@flowstate/shared';

export class PhysicsReplayRig {
  private recordedInputs: ReplayFrameInput[] = [];
  private recordedChecksums: SimulationChecksum[] = [];

  public recordFrame(frameIndex: number, deltaTime: number, intent: ReplayMovementIntent): void {
    this.recordedInputs.push({ frameIndex, deltaTime, intent: { ...intent } });
  }

  public recordChecksum(frameIndex: number, position: Vector3D, velocity: Vector3D): SimulationChecksum {
    // Hash = round(x*1000) + round(y*1000)*10000 + round(z*1000)*100000000
    const hash =
      Math.round(position.x * 1000) +
      Math.round(position.y * 1000) * 10000 +
      Math.round(position.z * 1000) * 100000000;

    const checksum: SimulationChecksum = {
      frameIndex,
      positionHash: hash,
      position: { ...position },
      velocity: { ...velocity },
    };

    this.recordedChecksums.push(checksum);
    return checksum;
  }

  public compareReplayRun(secondaryChecksums: SimulationChecksum[]): ReplayValidationResult {
    if (this.recordedChecksums.length !== secondaryChecksums.length) {
      return {
        isDeterministic: false,
        totalRecordedFrames: this.recordedChecksums.length,
        divergentFrameIndex: Math.min(this.recordedChecksums.length, secondaryChecksums.length),
        checksumsMatch: false,
      };
    }

    for (let i = 0; i < this.recordedChecksums.length; i++) {
      const a = this.recordedChecksums[i];
      const b = secondaryChecksums[i];

      if (a.positionHash !== b.positionHash) {
        return {
          isDeterministic: false,
          totalRecordedFrames: this.recordedChecksums.length,
          divergentFrameIndex: i,
          checksumsMatch: false,
        };
      }
    }

    return {
      isDeterministic: true,
      totalRecordedFrames: this.recordedChecksums.length,
      checksumsMatch: true,
    };
  }

  public getRecordedInputs(): ReadonlyArray<ReplayFrameInput> {
    return this.recordedInputs;
  }

  public getRecordedChecksums(): ReadonlyArray<SimulationChecksum> {
    return this.recordedChecksums;
  }
}
