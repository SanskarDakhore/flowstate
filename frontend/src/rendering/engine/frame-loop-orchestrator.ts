import {
  FrameAccumulatorState,
  FrameTimingConfig,
  PhysicsInterpolationState,
} from '@flowstate/shared';

export const DEFAULT_FRAME_TIMING: FrameTimingConfig = {
  fixedDeltaTimeSeconds: 1 / 60,
  maxAccumulatedSeconds: 2 / 60,
};

export class FrameLoopOrchestrator {
  private config: FrameTimingConfig;
  private accumulator: number = 0;

  constructor(config: FrameTimingConfig = DEFAULT_FRAME_TIMING) {
    this.config = config;
  }

  public advanceFrame(rawDeltaTimeSeconds: number): FrameAccumulatorState {
    let clampedDelta = rawDeltaTimeSeconds;
    let isSpikeClamped = false;

    // Spike protection: clamp frame spikes to maxAccumulatedSeconds (33.3ms)
    if (clampedDelta > this.config.maxAccumulatedSeconds) {
      clampedDelta = this.config.maxAccumulatedSeconds;
      isSpikeClamped = true;
    }

    this.accumulator += clampedDelta;
    let subStepCount = 0;

    // Sub-step fixed physics iterations
    while (this.accumulator >= this.config.fixedDeltaTimeSeconds) {
      this.accumulator -= this.config.fixedDeltaTimeSeconds;
      subStepCount++;
    }

    // Alpha interpolation ratio for rendering frame blending
    const alphaInterpolation = this.accumulator / this.config.fixedDeltaTimeSeconds;

    return {
      accumulatorSeconds: this.accumulator,
      alphaInterpolation: Math.min(1.0, Math.max(0.0, alphaInterpolation)),
      subStepCount,
      isSpikeClamped,
    };
  }

  public computeInterpolatedPosition(
    previousPos: { x: number; y: number; z: number },
    currentPos: { x: number; y: number; z: number },
    alpha: number
  ): PhysicsInterpolationState {
    const interpolated = {
      x: previousPos.x + (currentPos.x - previousPos.x) * alpha,
      y: previousPos.y + (currentPos.y - previousPos.y) * alpha,
      z: previousPos.z + (currentPos.z - previousPos.z) * alpha,
    };

    return {
      previousPosition: previousPos,
      currentPosition: currentPos,
      interpolatedPosition: interpolated,
    };
  }
}
