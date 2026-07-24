import { SkyState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class SkySystem implements EnvironmentSubsystem<SkyState> {
  private cachedState: SkyState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<SkyState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.skyBlend === state.skyBlend &&
      this.cachedState.starOpacity === state.starOpacity &&
      this.cachedState.cloudBlend === state.cloudBlend
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<SkyState> | null {
    return this.cachedState;
  }
}
