import { AmbientState } from '@flowstate/shared';
import { AudioSubsystem } from './audio-subsystem';

export class AmbientSystem implements AudioSubsystem<AmbientState> {
  private cachedState: AmbientState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<AmbientState>): void {
    if (
      this.cachedState &&
      this.cachedState.windVolume === state.windVolume &&
      this.cachedState.birdsVolume === state.birdsVolume &&
      this.cachedState.leavesVolume === state.leavesVolume &&
      this.cachedState.waterVolume === state.waterVolume &&
      this.cachedState.insectsVolume === state.insectsVolume
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<AmbientState> | null {
    return this.cachedState;
  }
}
