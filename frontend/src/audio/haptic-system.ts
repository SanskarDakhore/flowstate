import { HapticState } from '@flowstate/shared';
import { AudioSubsystem } from './audio-subsystem';

export class HapticSystem implements AudioSubsystem<HapticState> {
  private cachedState: HapticState | null = null;
  private triggerCount: number = 0;

  public update(state: Readonly<HapticState>): void {
    if (
      this.cachedState &&
      this.cachedState.intensity === state.intensity &&
      this.cachedState.durationMs === state.durationMs &&
      this.cachedState.style === state.style
    ) {
      return;
    }

    this.cachedState = { ...state };

    // Trigger Browser Navigator Haptic Vibration API if available
    if (state.intensity > 0 && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(state.durationMs);
      } catch (_err) {
        // Safe fallback for environments lacking tactile hardware
      }
    }
    this.triggerCount++;
  }

  public getTriggerCount(): number {
    return this.triggerCount;
  }

  public getCachedState(): Readonly<HapticState> | null {
    return this.cachedState;
  }
}
