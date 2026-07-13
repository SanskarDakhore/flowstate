import { Vector3State } from './movement-types';

export interface TrackFrame {
  center: Vector3State;
  forward: Vector3State;
  right: Vector3State;
  up: Vector3State;
}

export interface PathFrame {
  normal: Vector3State; // Legacy alias for right
  binormal: Vector3State; // Legacy alias for up
}

export interface FlowPath {
  getPosition(progress: number): Vector3State;
  getTangent(progress: number): Vector3State;
  getTrackFrame(progress: number): TrackFrame;
  getFrame(progress: number): PathFrame;
  trackToWorld(progress: number, lateralOffset: number, verticalOffset: number): Vector3State;
  getClosestProgress(position: Vector3State): number;
  getTotalLength(): number;
}

/**
 * Procedural mathematical test path implementing FlowPath.
 * Uses smooth sin/cos curves along forward Z axis.
 */
export class MathFlowPath implements FlowPath {
  private readonly totalLength: number;
  private readonly amplitudeX: number;
  private readonly frequencyX: number;
  private readonly amplitudeY: number;
  private readonly frequencyY: number;

  constructor(
    totalLength: number = 600,
    amplitudeX: number = 10,
    frequencyX: number = 2,
    amplitudeY: number = 4,
    frequencyY: number = 3
  ) {
    this.totalLength = totalLength;
    this.amplitudeX = amplitudeX;
    this.frequencyX = frequencyX;
    this.amplitudeY = amplitudeY;
    this.frequencyY = frequencyY;
  }

  public getTotalLength(): number {
    return this.totalLength;
  }

  public getPosition(progress: number): Vector3State {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const z = clampedProgress * this.totalLength;
    const angleX = clampedProgress * Math.PI * 2 * this.frequencyX;
    const angleY = clampedProgress * Math.PI * 2 * this.frequencyY;

    const x = Math.sin(angleX) * this.amplitudeX;
    const y = Math.cos(angleY) * this.amplitudeY;

    return { x, y, z };
  }

  public getTangent(progress: number): Vector3State {
    const delta = 0.001;
    const p1 = this.getPosition(Math.max(0, progress - delta));
    const p2 = this.getPosition(Math.min(1, progress + delta));

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1.0;

    return {
      x: dx / len,
      y: dy / len,
      z: dz / len,
    };
  }

  public getTrackFrame(progress: number): TrackFrame {
    const center = this.getPosition(progress);
    const forward = this.getTangent(progress);

    // Approximate world up (0, 1, 0)
    let worldUpX = 0;
    let worldUpY = 1;
    let worldUpZ = 0;

    // Avoid gimbal lock if forward vector points straight up/down
    if (Math.abs(forward.y) > 0.99) {
      worldUpY = 0;
      worldUpZ = 1;
    }

    // Right = Cross(WorldUp, Forward)
    let rx = worldUpY * forward.z - worldUpZ * forward.y;
    let ry = worldUpZ * forward.x - worldUpX * forward.z;
    let rz = worldUpX * forward.y - worldUpY * forward.x;
    const rLen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1.0;
    rx /= rLen;
    ry /= rLen;
    rz /= rLen;

    // Up = Cross(Forward, Right)
    let ux = forward.y * rz - forward.z * ry;
    let uy = forward.z * rx - forward.x * rz;
    let uz = forward.x * ry - forward.y * rx;
    const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1.0;
    ux /= uLen;
    uy /= uLen;
    uz /= uLen;

    return {
      center,
      forward,
      right: { x: rx, y: ry, z: rz },
      up: { x: ux, y: uy, z: uz },
    };
  }

  public getFrame(progress: number): PathFrame {
    const trackFrame = this.getTrackFrame(progress);
    return {
      normal: trackFrame.right,
      binormal: trackFrame.up,
    };
  }

  public trackToWorld(progress: number, lateralOffset: number, verticalOffset: number): Vector3State {
    const frame = this.getTrackFrame(progress);
    return {
      x: frame.center.x + frame.right.x * lateralOffset + frame.up.x * verticalOffset,
      y: frame.center.y + frame.right.y * lateralOffset + frame.up.y * verticalOffset,
      z: frame.center.z + frame.right.z * lateralOffset + frame.up.z * verticalOffset,
    };
  }

  /**
   * Prototype-grade sampling method to find closest path progress.
   * Uses 100 coarse samples followed by binary refinement.
   */
  public getClosestProgress(position: Vector3State): number {
    const samples = 100;
    let bestProgress = 0;
    let minDistanceSq = Infinity;

    for (let i = 0; i <= samples; i++) {
      const prog = i / samples;
      const p = this.getPosition(prog);
      const dx = position.x - p.x;
      const dy = position.y - p.y;
      const dz = position.z - p.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        bestProgress = prog;
      }
    }

    // Refinement step around best candidate
    const step = 1.0 / samples;
    const startP = Math.max(0, bestProgress - step);
    const endP = Math.min(1, bestProgress + step);
    const refinedSamples = 20;

    for (let i = 0; i <= refinedSamples; i++) {
      const prog = startP + (i / refinedSamples) * (endP - startP);
      const p = this.getPosition(prog);
      const dx = position.x - p.x;
      const dy = position.y - p.y;
      const dz = position.z - p.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        bestProgress = prog;
      }
    }

    return bestProgress;
  }
}
