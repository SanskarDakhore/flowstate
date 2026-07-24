import { DynamicWeatherStateMachine } from '../../src/game/simulation/dynamic-weather-state-machine';

describe('Phase 22 — Dynamic Weather State Machine', () => {
  let weatherEngine: DynamicWeatherStateMachine;

  beforeEach(() => {
    weatherEngine = new DynamicWeatherStateMachine();
  });

  describe('Weather State Transitions & Cross-Fading', () => {
    it('should initiate transition from CLEAR_SUNNY -> MISTY_RAIN and cross-fade parameters', () => {
      const event = weatherEngine.transitionTo('MISTY_RAIN');
      expect(event).not.toBeNull();
      expect(event?.previousWeather).toBe('CLEAR_SUNNY');
      expect(event?.newWeather).toBe('MISTY_RAIN');

      // Step simulation halfway (2.5 seconds out of 5.0 seconds transition)
      for (let i = 0; i < 150; i++) {
        weatherEngine.stepSimulation(0.016, 50.0);
      }

      const state = weatherEngine.stepSimulation(0.016, 50.0);
      expect(state.isTransitioning).toBe(true);
      expect(state.transitionProgress).toBeGreaterThan(0.4);
      expect(state.tractionMultiplier).toBeLessThan(1.0); // Reduced traction in rain
    });

    it('should complete transition to target weather state when duration elapses', () => {
      weatherEngine.transitionTo('ELECTRICAL_STORM');

      for (let i = 0; i < 350; i++) {
        weatherEngine.stepSimulation(0.016, 50.0);
      }

      const state = weatherEngine.stepSimulation(0.016, 50.0);
      expect(state.isTransitioning).toBe(false);
      expect(state.currentWeather).toBe('ELECTRICAL_STORM');
      expect(state.energyChargeRate).toBe(1.5); // High energy charge rate in storm
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 weather simulation steps without memory exceptions or NaNs', () => {
      weatherEngine.transitionTo('SOLAR_AURORA');

      for (let i = 0; i < 1000; i++) {
        const state = weatherEngine.stepSimulation(0.016, 80.0);
        expect(Number.isNaN(state.tractionMultiplier)).toBe(false);
      }
    });
  });
});
