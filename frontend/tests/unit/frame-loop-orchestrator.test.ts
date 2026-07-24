import { FrameLoopOrchestrator } from '../../src/rendering/engine/frame-loop-orchestrator';

describe('Phase 15 — Frame Timing & Render Loop Orchestrator', () => {
  let orchestrator: FrameLoopOrchestrator;

  beforeEach(() => {
    orchestrator = new FrameLoopOrchestrator();
  });

  describe('Fixed Timestep Sub-Stepping & Accumulation', () => {
    it('should consume fixed 1/60s delta and return subStepCount=1 with alpha=0.0', () => {
      const state = orchestrator.advanceFrame(0.016667);
      expect(state.subStepCount).toBe(1);
      expect(state.alphaInterpolation).toBeCloseTo(0.0, 2);
    });

    it('should calculate fractional alpha interpolation when delta is not a multiple of 1/60s', () => {
      const state = orchestrator.advanceFrame(0.025); // 1.5 steps
      expect(state.subStepCount).toBe(1);
      expect(state.alphaInterpolation).toBeGreaterThan(0.0);
    });
  });

  describe('Frame-Time Spike Clamping', () => {
    it('should clamp massive frame-time spikes (>33.3ms) to maxAccumulatedSeconds', () => {
      const state = orchestrator.advanceFrame(0.2); // 200ms lag spike
      expect(state.isSpikeClamped).toBe(true);
      expect(state.subStepCount).toBeLessThanOrEqual(2);
    });
  });
});
