import { PresentationBiomeState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';
import { BiomeManager } from './biome-manager';
import { SplatMaterialEngine } from './splat-material-engine';

export class BiomeRenderer implements EnvironmentSubsystem<PresentationBiomeState> {
  public readonly biomeManager = new BiomeManager();
  public readonly splatEngine = new SplatMaterialEngine();

  private cachedState: PresentationBiomeState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<PresentationBiomeState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.activeBiome === state.activeBiome &&
      this.cachedState.blendRatio === state.blendRatio &&
      this.cachedState.colorGradingHex === state.colorGradingHex
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<PresentationBiomeState> | null {
    return this.cachedState;
  }
}
