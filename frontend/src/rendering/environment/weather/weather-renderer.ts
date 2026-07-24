import { PresentationWeatherState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';
import { CloudLayer } from './cloud-layer';
import { MistLayer } from './mist-layer';
import { WindController } from './wind-controller';

export class WeatherRenderer implements EnvironmentSubsystem<PresentationWeatherState> {
  public readonly cloudLayer = new CloudLayer();
  public readonly mistLayer = new MistLayer();
  public readonly windController = new WindController();

  private cachedState: PresentationWeatherState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<PresentationWeatherState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.cloudOpacity === state.cloudOpacity &&
      this.cachedState.fogDensity === state.fogDensity &&
      this.cachedState.windAnimationStrength === state.windAnimationStrength &&
      this.cachedState.sunVisibility === state.sunVisibility
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.cloudLayer.update(state.cloudOpacity, state.windAnimationStrength);
    this.mistLayer.update(state.fogDensity);
    this.windController.update(state.windAnimationStrength);
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<PresentationWeatherState> | null {
    return this.cachedState;
  }
}
