import { PresentationWildlifeState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';

export class WildlifeRenderer implements EnvironmentSubsystem<PresentationWildlifeState> {
  private cachedState: PresentationWildlifeState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<PresentationWildlifeState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.creatureDensity === state.creatureDensity &&
      this.cachedState.flockCohesion === state.flockCohesion &&
      this.cachedState.activityLevel === state.activityLevel &&
      this.cachedState.spiritAuraIntensity === state.spiritAuraIntensity
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<PresentationWildlifeState> | null {
    return this.cachedState;
  }
}
