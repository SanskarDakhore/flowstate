import { VegetationState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class VegetationSystem implements EnvironmentSubsystem<VegetationState> {
  private cachedState: VegetationState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<VegetationState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.grassDensity === state.grassDensity &&
      this.cachedState.grassColorHex === state.grassColorHex &&
      this.cachedState.windStrength === state.windStrength &&
      this.cachedState.flowerDensity === state.flowerDensity &&
      this.cachedState.leafDensity === state.leafDensity &&
      this.cachedState.grassHeight === state.grassHeight &&
      this.cachedState.treeVitality === state.treeVitality
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<VegetationState> | null {
    return this.cachedState;
  }
}
