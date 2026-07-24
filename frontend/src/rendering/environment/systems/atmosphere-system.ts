import { AtmosphereState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class AtmosphereSystem implements EnvironmentSubsystem<AtmosphereState> {
  private cachedState: AtmosphereState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<AtmosphereState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.fogDensity === state.fogDensity &&
      this.cachedState.bloomIntensity === state.bloomIntensity &&
      this.cachedState.exposure === state.exposure
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<AtmosphereState> | null {
    return this.cachedState;
  }
}
