import { BiomeEvolutionEngine } from '../../src/game/simulation/biome-evolution-engine';

describe('Phase 25 — Biome Evolution Engine (Valley to Forest)', () => {
  let engine: BiomeEvolutionEngine;

  beforeEach(() => {
    engine = new BiomeEvolutionEngine();
  });

  describe('Distance-Based Biome Transition Boundaries', () => {
    it('should identify DESERT_CANYON at start (0m - 400m)', () => {
      const { state } = engine.evaluateBiomeState(200.0);
      expect(state.currentPrimaryBiome).toBe('DESERT_CANYON');
      expect(state.splatWeightsRgba[0]).toBe(1.0);
    });

    it('should transition to VERDANT_VALLEY between 500m and 1400m', () => {
      const { state } = engine.evaluateBiomeState(800.0);
      expect(state.currentPrimaryBiome).toBe('VERDANT_VALLEY');
      expect(state.splatWeightsRgba[1]).toBe(1.0);
    });

    it('should transition to ANCIENT_FOREST between 1500m and 2900m', () => {
      const { state } = engine.evaluateBiomeState(2000.0);
      expect(state.currentPrimaryBiome).toBe('ANCIENT_FOREST');
      expect(state.splatWeightsRgba[2]).toBe(1.0);
    });
  });

  describe('Splat Map Weight Normalization & Blending', () => {
    it('should normalize splat map weights to sum to exactly 1.0 in transition blend zones', () => {
      const { state } = engine.evaluateBiomeState(450.0); // Inside 100m blend window
      expect(state.isBlending).toBe(true);

      const sum = state.splatWeightsRgba.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 biome evaluations without memory exceptions or NaNs', () => {
      for (let i = 0; i < 1000; i++) {
        const { state } = engine.evaluateBiomeState(i * 4.0);
        expect(Number.isNaN(state.targetFloraDensityCap)).toBe(false);
      }
    });
  });
});
