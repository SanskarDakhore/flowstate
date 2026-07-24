import { TerrainState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class TerrainRenderer implements EnvironmentSubsystem<TerrainState> {
  private cachedState: TerrainState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<TerrainState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.colorGrading === state.colorGrading &&
      this.cachedState.wetness === state.wetness
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<TerrainState> | null {
    return this.cachedState;
  }
}
