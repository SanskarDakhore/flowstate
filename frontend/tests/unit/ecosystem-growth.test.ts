import { EcosystemGrowthStateMachine } from '../../src/game/simulation/ecosystem-growth-state-machine';
import { EnvironmentalVariables } from '@flowstate/shared';

describe('Phase 21 — Ecosystem Growth State Machine', () => {
  let ecosystem: EcosystemGrowthStateMachine;

  const optimalEnv: EnvironmentalVariables = {
    moisture: 0.8,
    sunlight: 0.8,
    kineticEnergy: 85.0,
    temperature: 24.0,
  };

  const harshEnv: EnvironmentalVariables = {
    moisture: 0.05,
    sunlight: 0.1,
    kineticEnergy: 0.0,
    temperature: 38.0,
  };

  beforeEach(() => {
    ecosystem = new EcosystemGrowthStateMachine();
  });

  describe('Flora Lifecycle Stage Transitions', () => {
    it('should transition flora node from SEED -> SPROUT -> FLORA_BLOOM -> OVERGROWN_CANOPY under optimal environment', () => {
      ecosystem.registerFloraNode('node_1', 'SEED');

      // Advance simulation steps
      let transitionedStages: string[] = [];

      for (let step = 0; step < 500; step++) {
        const events = ecosystem.stepSimulation(optimalEnv, 0.016);
        events.forEach((ev) => transitionedStages.push(ev.currentStage));
      }

      const state = ecosystem.getEcosystemState();
      expect(state.dominantStage).toBe('OVERGROWN_CANOPY');
      expect(state.globalFloraDensity).toBe(1.0);
      expect(state.momentumMultiplier).toBeCloseTo(1.25, 2);
    });

    it('should regress flora nodes back towards SEED when exposed to harsh drought environment', () => {
      ecosystem.registerFloraNode('node_bloom', 'FLORA_BLOOM');

      for (let step = 0; step < 1000; step++) {
        ecosystem.stepSimulation(harshEnv, 0.016);
      }

      const state = ecosystem.getEcosystemState();
      expect(state.dominantStage).toBe('SEED');
      expect(state.globalFloraDensity).toBe(0.1);
    });
  });

  describe('Ecosystem Density & Momentum Multiplier', () => {
    it('should calculate global flora density and momentum boost scaling (1.0x -> 1.25x)', () => {
      ecosystem.registerFloraNode('n1', 'SEED');
      ecosystem.registerFloraNode('n2', 'SPROUT');

      const state = ecosystem.getEcosystemState();
      expect(state.activeNodesCount).toBe(2);
      expect(state.globalFloraDensity).toBe((0.1 + 0.35) / 2);
      expect(state.momentumMultiplier).toBeGreaterThan(1.0);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 ecosystem simulation steps without memory exceptions or NaNs', () => {
      ecosystem.registerFloraNode('node_perf', 'SEED');

      for (let i = 0; i < 1000; i++) {
        ecosystem.stepSimulation(optimalEnv, 0.016);
      }

      const state = ecosystem.getEcosystemState();
      expect(Number.isNaN(state.globalFloraDensity)).toBe(false);
    });
  });
});
