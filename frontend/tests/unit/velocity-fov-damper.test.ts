import { VelocityFOVDamper } from '../../src/rendering/camera/velocity-fov-damper';

describe('Phase 16 — Dynamic Velocity FOV Damping', () => {
  let damper: VelocityFOVDamper;

  beforeEach(() => {
    damper = new VelocityFOVDamper();
  });

  describe('Target FOV Calculation & Spring Damping', () => {
    it('should calculate target FOV proportional to rolling speed (70 deg -> 95 deg)', () => {
      const state0 = damper.updateFOV(0.0, 0.016);
      expect(state0.targetFOV).toBe(70.0);

      damper.resetFOV(70.0);
      const stateMax = damper.updateFOV(50.0, 0.016);
      expect(stateMax.targetFOV).toBe(95.0);
    });

    it('should smoothly interpolate current FOV towards target FOV without harsh pops', () => {
      for (let i = 0; i < 60; i++) {
        damper.updateFOV(50.0, 0.016);
      }
      const state = damper.updateFOV(50.0, 0.016);
      expect(state.currentFOV).toBeCloseTo(95.0, 1);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 FOV updates without memory exceptions or NaNs', () => {
      for (let i = 0; i < 1000; i++) {
        const state = damper.updateFOV((i % 50) * 1.0, 0.016);
        expect(Number.isNaN(state.currentFOV)).toBe(false);
      }
    });
  });
});
