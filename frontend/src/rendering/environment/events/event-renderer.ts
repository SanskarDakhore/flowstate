import { PresentationEventState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';

export class EventRenderer implements EnvironmentSubsystem<PresentationEventState> {
  private cachedState: PresentationEventState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<PresentationEventState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.activeEvent === state.activeEvent &&
      this.cachedState.pulseIntensity === state.pulseIntensity &&
      this.cachedState.screenGlowHex === state.screenGlowHex
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<PresentationEventState> | null {
    return this.cachedState;
  }
}
