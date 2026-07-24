import { DPRScalingState, ViewportConfig } from '@flowstate/shared';

export const DEFAULT_VIEWPORT_CONFIG: ViewportConfig = {
  minDPR: 1.0,
  maxDPR: 2.0,
  targetAspectRatio: 16 / 9,
  autoDownscaleOnThermalLag: true,
};

export class ViewportManager {
  private config: ViewportConfig;
  private currentDPR: number;
  private isDownscaled: boolean = false;

  constructor(config: ViewportConfig = DEFAULT_VIEWPORT_CONFIG) {
    this.config = config;
    this.currentDPR = config.maxDPR;
  }

  public updateViewport(
    clientWidth: number,
    clientHeight: number,
    devicePixelRatio: number = 2.0,
    hasFrameLagSpike: boolean = false
  ): DPRScalingState {
    let targetDPR = Math.min(this.config.maxDPR, Math.max(this.config.minDPR, devicePixelRatio));

    // Dynamic resolution downscaling on GPU thermal lag spike
    if (hasFrameLagSpike && this.config.autoDownscaleOnThermalLag) {
      targetDPR = this.config.minDPR;
      this.isDownscaled = true;
    } else if (!hasFrameLagSpike && this.isDownscaled) {
      this.isDownscaled = false;
    }

    this.currentDPR = targetDPR;
    const canvasWidthPx = Math.floor(clientWidth * targetDPR);
    const canvasHeightPx = Math.floor(clientHeight * targetDPR);
    const aspectRatio = clientHeight > 0 ? clientWidth / clientHeight : this.config.targetAspectRatio;

    return {
      currentDPR: this.currentDPR,
      canvasWidthPx,
      canvasHeightPx,
      aspectRatio,
      isDownscaled: this.isDownscaled,
    };
  }

  public getCurrentDPR(): number {
    return this.currentDPR;
  }
}
