export interface FOVSpringDampingConfig {
  readonly minFOV: number;         // Default 70 deg
  readonly maxFOV: number;         // Default 95 deg
  readonly maxSpeed: number;       // Speed at max FOV (e.g. 50 m/s)
  readonly springStiffness: number;// Default 120.0
  readonly dampingCoefficient: number; // Default 20.0 (critically damped)
}

export interface FOVState {
  readonly currentFOV: number;
  readonly targetFOV: number;
  readonly velocityFOV: number; // Spring velocity
  readonly normalizedSpeed: number;
}
