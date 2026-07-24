import { SFXState } from '@flowstate/shared';
import { AudioSubsystem } from './audio-subsystem';

export class SFXSystem implements AudioSubsystem<SFXState> {
  private cachedState: SFXState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<SFXState>): void {
    if (
      this.cachedState &&
      this.cachedState.sfxVolume === state.sfxVolume &&
      this.cachedState.spatialBlend === state.spatialBlend
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<SFXState> | null {
    return this.cachedState;
  }
}
