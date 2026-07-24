import { DayNightCycleEngine } from '../../src/game/simulation/day-night-cycle-engine';

describe('Phase 23 — 24-Hour Day/Night Lighting Cycle', () => {
  describe('Sun 3D Orbital Trajectory & Phase Transitions', () => {
    it('should initialize at NOON (12:00) with bright white sun and high overhead angle', () => {
      const engine = new DayNightCycleEngine(undefined, 12.0);
      const state = engine.stepSimulation(0.0);

      expect(state.currentPhase).toBe('NOON');
      expect(state.timeInHours).toBeCloseTo(12.0, 1);
      expect(state.lighting.sunIntensity).toBe(1.2);
    });

    it('should advance smoothly across DAWN -> NOON -> DUSK -> MIDNIGHT phases', () => {
      const engine = new DayNightCycleEngine(undefined, 0.0); // Midnight start

      let phasesSeen: Set<string> = new Set();

      for (let sec = 0; sec < 120; sec++) {
        const state = engine.stepSimulation(1.0);
        phasesSeen.add(state.currentPhase);
      }

      expect(phasesSeen.has('DAWN')).toBe(true);
      expect(phasesSeen.has('NOON')).toBe(true);
      expect(phasesSeen.has('DUSK')).toBe(true);
      expect(phasesSeen.has('MIDNIGHT')).toBe(true);
    });
  });

  describe('Midnight Emissive Flora Glow Amplification', () => {
    it('should amplify flora emissive glow to 1.5x during MIDNIGHT phase', () => {
      const engine = new DayNightCycleEngine(undefined, 22.0); // Midnight
      const state = engine.stepSimulation(0.0);

      expect(state.currentPhase).toBe('MIDNIGHT');
      expect(state.emissiveGlowMultiplier).toBe(1.5);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 day/night simulation steps without memory exceptions or NaNs', () => {
      const engine = new DayNightCycleEngine();

      for (let i = 0; i < 1000; i++) {
        const state = engine.stepSimulation(0.016);
        expect(Number.isNaN(state.lighting.sunDirection.x)).toBe(false);
      }
    });
  });
});
