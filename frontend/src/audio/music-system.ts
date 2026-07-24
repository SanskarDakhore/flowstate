import { MusicState } from '@flowstate/shared';
import { AudioSubsystem } from './audio-subsystem';

export class MusicSystem implements AudioSubsystem<MusicState> {
  private cachedState: MusicState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<MusicState>): void {
    if (
      this.cachedState &&
      this.cachedState.volume === state.volume &&
      this.cachedState.crossfade === state.crossfade &&
      this.cachedState.intensity === state.intensity &&
      this.cachedState.filterCutoff === state.filterCutoff
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<MusicState> | null {
    return this.cachedState;
  }
}
