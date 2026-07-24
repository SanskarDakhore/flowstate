export interface ViewportConfig {
  readonly minDPR: number;         // Default 1.0
  readonly maxDPR: number;         // Default 2.0
  readonly targetAspectRatio: number; // Default 16/9 = 1.7778
  readonly autoDownscaleOnThermalLag: boolean;
}

export interface DPRScalingState {
  readonly currentDPR: number;
  readonly canvasWidthPx: number;
  readonly canvasHeightPx: number;
  readonly aspectRatio: number;
  readonly isDownscaled: boolean;
}

export interface CanvasBounds {
  readonly width: number;
  readonly height: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
}
