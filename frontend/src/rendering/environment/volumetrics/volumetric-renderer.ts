import { VolumetricLightingState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';
import { SunshaftSystem } from './sunshaft-system';
import { VolumetricFogSystem } from './volumetric-fog-system';

export class VolumetricRenderer implements EnvironmentSubsystem<VolumetricLightingState> {
  public readonly sunshaftSystem = new SunshaftSystem();
  public readonly fogSystem = new VolumetricFogSystem();

  private cachedState: VolumetricLightingState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<VolumetricLightingState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.sunshaftIntensity === state.sunshaftIntensity &&
      this.cachedState.mieScatteringFactor === state.mieScatteringFactor &&
      this.cachedState.fogHeightFalloff === state.fogHeightFalloff &&
      this.cachedState.lightShaftDensity === state.lightShaftDensity &&
      this.cachedState.ambientGlowColorHex === state.ambientGlowColorHex
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<VolumetricLightingState> | null {
    return this.cachedState;
  }
}
