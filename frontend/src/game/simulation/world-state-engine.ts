import { WorldInputSnapshot, WorldStateEnum, WorldStateSnapshot } from '@flowstate/shared';
import { ResonanceInterpreter } from './resonance-interpreter';
import { WeatherController } from '../weather/weather-controller';
import { GrowthController } from '../vegetation/growth-controller';
import { WildlifeController } from '../wildlife/wildlife-controller';
import { EventCascadeController } from '../events/event-cascade-controller';

export type WorldStateListener = (snapshot: Readonly<WorldStateSnapshot>) => void;

export class WorldStateEngine {
  private interpreter = new ResonanceInterpreter();
  private weatherController = new WeatherController();
  private growthController = new GrowthController();
  private wildlifeController = new WildlifeController();
  private eventCascadeController = new EventCascadeController();
  private energyBuffer: number = 0;
  private currentState: WorldStateEnum = WorldStateEnum.IDLE;
  private targetState: WorldStateEnum = WorldStateEnum.IDLE;
  private transitionProgress: number = 1.0;
  private listeners: WorldStateListener[] = [];

  private static readonly DECAY_RATE = 0.15; // Exponential decay rate per second

  public subscribe(listener: WorldStateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public update(worldInput: Readonly<WorldInputSnapshot>, deltaTime: number): Readonly<WorldStateSnapshot> {
    if (deltaTime <= 0) return this.getCurrentSnapshot();

    // 1. Accumulate Energy with Harmony Multiplier
    const addedEnergy = worldInput.environmentEnergy * worldInput.harmony * deltaTime;
    this.energyBuffer += addedEnergy;

    // 2. Exponential Energy Decay
    const decayFactor = Math.exp(-WorldStateEngine.DECAY_RATE * deltaTime);
    this.energyBuffer *= decayFactor;
    this.energyBuffer = Math.max(0, Math.min(100, this.energyBuffer));

    // 3. Hysteresis State Evaluation
    const calculatedState = this.evaluateStateWithHysteresis(this.energyBuffer, this.currentState);

    if (calculatedState !== this.currentState) {
      this.targetState = calculatedState;
      this.currentState = calculatedState;
      this.transitionProgress = 1.0;
    }

    // 4. Update Deterministic Weather, Vegetation, Wildlife & Event Cascade Simulation
    this.weatherController.update(worldInput, deltaTime);
    this.growthController.update(worldInput, deltaTime);
    this.wildlifeController.update(worldInput, deltaTime);
    this.eventCascadeController.update(worldInput, deltaTime);

    const snapshot = this.getCurrentSnapshot();
    this.notifyListeners(snapshot);
    return snapshot;
  }

  public updateFromGameplay(gameplaySnapshot: any, deltaTime: number): Readonly<WorldStateSnapshot> {
    const input = this.interpreter.interpret(gameplaySnapshot);
    return this.update(input, deltaTime);
  }

  private evaluateStateWithHysteresis(energy: number, current: WorldStateEnum): WorldStateEnum {
    // Thresholds with 5.0 energy unit hysteresis buffer to eliminate state flicker
    if (current === WorldStateEnum.IDLE) {
      if (energy >= 15.0) return WorldStateEnum.AWAKENING;
      return WorldStateEnum.IDLE;
    }
    if (current === WorldStateEnum.AWAKENING) {
      if (energy >= 35.0) return WorldStateEnum.GROWING;
      if (energy < 10.0) return WorldStateEnum.IDLE;
      return WorldStateEnum.AWAKENING;
    }
    if (current === WorldStateEnum.GROWING) {
      if (energy >= 55.0) return WorldStateEnum.BLOOMING;
      if (energy < 30.0) return WorldStateEnum.AWAKENING;
      return WorldStateEnum.GROWING;
    }
    if (current === WorldStateEnum.BLOOMING) {
      if (energy >= 75.0) return WorldStateEnum.THRIVING;
      if (energy < 50.0) return WorldStateEnum.GROWING;
      return WorldStateEnum.BLOOMING;
    }
    if (current === WorldStateEnum.THRIVING) {
      if (energy >= 90.0) return WorldStateEnum.TRANSCENDENT;
      if (energy < 70.0) return WorldStateEnum.BLOOMING;
      return WorldStateEnum.THRIVING;
    }
    if (current === WorldStateEnum.TRANSCENDENT) {
      if (energy < 85.0) return WorldStateEnum.THRIVING;
      return WorldStateEnum.TRANSCENDENT;
    }
    return WorldStateEnum.IDLE;
  }

  public getCurrentSnapshot(): WorldStateSnapshot {
    const normEnergy = this.energyBuffer / 100.0;
    return {
      currentState: this.currentState,
      targetState: this.targetState,
      transitionProgress: this.transitionProgress,
      energyBuffer: this.energyBuffer,
      growthWeight: normEnergy,
      vegetationWeight: Math.min(1.0, normEnergy * 1.2),
      weatherWeight: Math.min(1.0, normEnergy * 0.8),
      musicWeight: normEnergy,
      wildlifeWeight: Math.max(0.0, (normEnergy - 0.3) / 0.7),
      weatherState: this.weatherController.getCurrentSnapshot(),
      vegetationState: this.growthController.getCurrentSnapshot(),
      wildlifeState: this.wildlifeController.getCurrentSnapshot(),
      eventState: this.eventCascadeController.getCurrentSnapshot(),
      timestamp: Date.now(),
    };
  }

  private notifyListeners(snapshot: Readonly<WorldStateSnapshot>): void {
    const count = this.listeners.length;
    for (let i = 0; i < count; i++) {
      this.listeners[i](snapshot);
    }
  }

  public reset(): void {
    this.energyBuffer = 0;
    this.currentState = WorldStateEnum.IDLE;
    this.targetState = WorldStateEnum.IDLE;
    this.transitionProgress = 1.0;
    this.weatherController.reset();
    this.growthController.reset();
    this.wildlifeController.reset();
    this.eventCascadeController.reset();
  }
}
