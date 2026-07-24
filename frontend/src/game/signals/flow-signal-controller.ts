import { GameplaySignalSnapshot } from '@flowstate/shared';
import { GameplaySignalCollector, RawGameplayFacts } from './gameplay-signal-collector';
import { ResonanceCalculator } from './resonance-calculator';
import { GameplaySignalEmitter, SignalListener } from './gameplay-signal-emitter';

export class FlowSignalController {
  private collector = new GameplaySignalCollector();
  private calculator = new ResonanceCalculator();
  private emitter = new GameplaySignalEmitter();

  public update(
    speed: number,
    maxSpeed: number,
    pathDeviation: number,
    comboCount: number,
    isGrounded: boolean,
    deltaTime: number
  ): Readonly<GameplaySignalSnapshot> {
    const rawFacts = this.collector.collectFacts(
      speed,
      maxSpeed,
      pathDeviation,
      comboCount,
      isGrounded,
      deltaTime
    );

    const snapshot = this.calculator.calculate(rawFacts);
    this.emitter.emit(snapshot);
    return snapshot;
  }

  public subscribe(listener: SignalListener): () => void {
    return this.emitter.subscribe(listener);
  }

  public getLastSnapshot(): Readonly<GameplaySignalSnapshot> | null {
    return this.emitter.getLastSnapshot();
  }

  public reset(): void {
    this.calculator.reset();
    this.emitter.clear();
  }
}
