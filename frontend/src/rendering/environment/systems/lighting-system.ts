import { LightingState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class LightingSystem implements EnvironmentSubsystem<LightingState> {
  private cachedState: LightingState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<LightingState>, _context?: Readonly<RenderFrameContext>): void {
    // Change detection check to skip redundant GPU updates
    if (
      this.cachedState &&
      this.cachedState.sunIntensity === state.sunIntensity &&
      this.cachedState.ambientColorHex === state.ambientColorHex &&
      this.cachedState.colorTemperature === state.colorTemperature
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<LightingState> | null {
    return this.cachedState;
  }
}
