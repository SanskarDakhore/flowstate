export interface FrameTimingConfig {
  readonly fixedDeltaTimeSeconds: number; // Default 1 / 60 = 0.016667
  readonly maxAccumulatedSeconds: number; // Default 0.033333 (spike protection cap)
}

export interface FrameAccumulatorState {
  readonly accumulatorSeconds: number;
  readonly alphaInterpolation: number; // [0.0, 1.0] for render frame interpolation
  readonly subStepCount: number;
  readonly isSpikeClamped: boolean;
}

export interface PhysicsInterpolationState {
  readonly previousPosition: { x: number; y: number; z: number };
  readonly currentPosition: { x: number; y: number; z: number };
  readonly interpolatedPosition: { x: number; y: number; z: number };
}
