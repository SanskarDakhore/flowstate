import { WorldEventEnum, WorldEventState, WorldInputSnapshot } from '@flowstate/shared';

export class EventCascadeController {
  private activeEvent: WorldEventEnum = WorldEventEnum.None;
  private intensity: number = 0.0;
  private timeRemainingMs: number = 0;
  private durationMs: number = 0;

  public update(worldInput: Readonly<WorldInputSnapshot>, deltaTime: number): Readonly<WorldEventState> {
    if (deltaTime <= 0) return this.getCurrentSnapshot();

    const energyNorm = Math.min(1.0, Math.max(0.0, worldInput.environmentEnergy / 100.0));

    // Event decay tick
    if (this.timeRemainingMs > 0) {
      this.timeRemainingMs = Math.max(0, this.timeRemainingMs - Math.floor(deltaTime * 1000));
      if (this.timeRemainingMs === 0) {
        this.activeEvent = WorldEventEnum.None;
        this.intensity = 0.0;
      }
    }

    // High flow cascade trigger evaluation
    if (this.activeEvent === WorldEventEnum.None) {
      if (energyNorm >= 0.9 && worldInput.harmony >= 0.95) {
        this.triggerEvent(WorldEventEnum.TranscendentCascade, 5000, 1.0);
      } else if (energyNorm >= 0.75 && worldInput.harmony >= 0.9) {
        this.triggerEvent(WorldEventEnum.RadiantShift, 4000, 0.8);
      } else if (energyNorm >= 0.6 && worldInput.growthPotential >= 0.8) {
        this.triggerEvent(WorldEventEnum.BloomBurst, 3000, 0.6);
      }
    }

    return this.getCurrentSnapshot();
  }

  private triggerEvent(event: WorldEventEnum, durationMs: number, intensity: number): void {
    this.activeEvent = event;
    this.durationMs = durationMs;
    this.timeRemainingMs = durationMs;
    this.intensity = intensity;
  }

  public getCurrentSnapshot(): WorldEventState {
    return {
      activeEvent: this.activeEvent,
      intensity: this.intensity,
      durationMs: this.durationMs,
      timeRemainingMs: this.timeRemainingMs,
      timestamp: Date.now(),
    };
  }

  public reset(): void {
    this.activeEvent = WorldEventEnum.None;
    this.intensity = 0.0;
    this.timeRemainingMs = 0;
    this.durationMs = 0;
  }
}
