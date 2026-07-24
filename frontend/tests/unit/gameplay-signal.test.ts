import { GameplaySignalCollector } from '../../src/game/signals/gameplay-signal-collector';
import { ResonanceCalculator } from '../../src/game/signals/resonance-calculator';
import { FlowSignalController } from '../../src/game/signals/flow-signal-controller';


describe('Gameplay Signal & Resonance Pipeline', () => {
  let collector: GameplaySignalCollector;
  let calculator: ResonanceCalculator;
  let controller: FlowSignalController;

  beforeEach(() => {
    collector = new GameplaySignalCollector();
    calculator = new ResonanceCalculator();
    controller = new FlowSignalController();
  });

  it('should collect raw facts correctly without calculations', () => {
    const facts = collector.collectFacts(15, 30, 0.2, 5, true, 0.016);
    expect(facts.speed).toBe(15);
    expect(facts.maxSpeed).toBe(30);
    expect(facts.pathDeviation).toBe(0.2);
    expect(facts.comboCount).toBe(5);
    expect(facts.isGrounded).toBe(true);
  });

  it('should calculate flowRatio deterministically within [0, 1] range', () => {
    const facts = collector.collectFacts(30, 30, 0.0, 0, true, 0.5);
    const snapshot = calculator.calculate(facts);

    expect(snapshot.flowRatio).toBeGreaterThan(0);
    expect(snapshot.flowRatio).toBeLessThanOrEqual(1.0);
    expect(snapshot.resonance).toBeGreaterThanOrEqual(1.0);
    expect(snapshot.stability).toBe(1.0);
    expect(snapshot.trajectoryAccuracy).toBe(1.0);
  });

  it('should dispatch immutable snapshots via FlowSignalController', () => {
    let receivedRatio = -1;
    controller.subscribe((snapshot) => {
      receivedRatio = snapshot.flowRatio;
    });

    controller.update(15, 30, 0, 0, true, 0.1);
    expect(receivedRatio).toBeGreaterThan(0);
  });
});
