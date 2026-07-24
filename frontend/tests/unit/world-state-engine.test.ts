import { ResonanceInterpreter } from '../../src/game/simulation/resonance-interpreter';
import { WorldStateEngine } from '../../src/game/simulation/world-state-engine';
import { WorldStateEnum, createDefaultSignalSnapshot } from '@flowstate/shared';

describe('Resonance Interpreter & World State Engine', () => {
  let interpreter: ResonanceInterpreter;
  let engine: WorldStateEngine;

  beforeEach(() => {
    interpreter = new ResonanceInterpreter();
    engine = new WorldStateEngine();
  });

  it('should translate gameplay concepts to simulation input without gameplay leaking', () => {
    const gameplay = {
      ...createDefaultSignalSnapshot(),
      flowRatio: 0.8,
      speedRetention: 0.9,
      kineticEnergy: 400,
      resonance: 2.5,
      stability: 0.95,
      trajectoryAccuracy: 0.95,
    };

    const input = interpreter.interpret(gameplay);
    expect(input.growthPotential).toBeGreaterThan(0.5);
    expect(input.environmentEnergy).toBeGreaterThan(0);
    expect(input.harmony).toBeGreaterThan(0.8);
  });

  it('should accumulate energy buffer and trigger state transition cleanly', () => {
    const input = {
      growthPotential: 0.9,
      environmentEnergy: 50,
      harmony: 1.0,
      stability: 1.0,
      recovery: 1.0,
      timestamp: Date.now(),
    };

    // Update simulation tick
    engine.update(input, 1.0);
    const snapshot = engine.getCurrentSnapshot();

    expect(snapshot.energyBuffer).toBeGreaterThan(0);
    expect(snapshot.currentState).toBeGreaterThan(WorldStateEnum.IDLE);
    expect(snapshot.vegetationWeight).toBeGreaterThan(0);
  });

  it('should maintain hysteresis buffer preventing rapid state flicker on energy edge values', () => {
    const inputHigh = {
      growthPotential: 1.0,
      environmentEnergy: 20,
      harmony: 1.0,
      stability: 1.0,
      recovery: 1.0,
      timestamp: Date.now(),
    };

    engine.update(inputHigh, 1.0); // Reaches AWAKENING
    expect(engine.getCurrentSnapshot().currentState).toBe(WorldStateEnum.AWAKENING);

    // Minor energy dip should maintain AWAKENING due to hysteresis
    const inputDip = {
      ...inputHigh,
      environmentEnergy: 0,
    };
    engine.update(inputDip, 0.1);
    expect(engine.getCurrentSnapshot().currentState).toBe(WorldStateEnum.AWAKENING);
  });
});
