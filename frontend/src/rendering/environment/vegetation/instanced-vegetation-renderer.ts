import { InstancedVegetationShaderState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';
import { WindDisplacementSolver } from './wind-displacement-solver';
import { InstanceBufferManager } from './instance-buffer-manager';

export class InstancedVegetationRenderer implements EnvironmentSubsystem<InstancedVegetationShaderState> {
  public readonly windSolver = new WindDisplacementSolver();
  public readonly bufferManager = new InstanceBufferManager();

  private cachedState: InstancedVegetationShaderState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<InstancedVegetationShaderState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.instanceCount === state.instanceCount &&
      this.cachedState.swayFrequencyHz === state.swayFrequencyHz &&
      this.cachedState.swayAmplitudeMeters === state.swayAmplitudeMeters &&
      this.cachedState.bendingStiffness === state.bendingStiffness &&
      this.cachedState.foliageColorTintHex === state.foliageColorTintHex
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.bufferManager.updateInstanceBuffer(state.instanceCount);
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<InstancedVegetationShaderState> | null {
    return this.cachedState;
  }
}
