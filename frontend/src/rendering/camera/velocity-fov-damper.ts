import { FOVSpringDampingConfig, FOVState } from '@flowstate/shared';

export const DEFAULT_FOV_CONFIG: FOVSpringDampingConfig = {
  minFOV: 70.0,
  maxFOV: 95.0,
  maxSpeed: 50.0,
  springStiffness: 120.0,
  dampingCoefficient: 20.0,
};

export class VelocityFOVDamper {
  private config: FOVSpringDampingConfig;
  private currentFOV: number;
  private velocityFOV: number = 0;

  constructor(config: FOVSpringDampingConfig = DEFAULT_FOV_CONFIG) {
    this.config = config;
    this.currentFOV = config.minFOV;
  }

  public updateFOV(currentSpeed: number, deltaTimeSeconds: number = 0.016): FOVState {
    const normalizedSpeed = Math.min(1.0, Math.max(0.0, currentSpeed / this.config.maxSpeed));
    const targetFOV = this.config.minFOV + (this.config.maxFOV - this.config.minFOV) * normalizedSpeed;

    // Critically damped spring-damper ODE solver: a = -k*(x - target) - c*v
    const displacement = this.currentFOV - targetFOV;
    const springForce = -this.config.springStiffness * displacement;
    const dampingForce = -this.config.dampingCoefficient * this.velocityFOV;
    const acceleration = springForce + dampingForce;

    this.velocityFOV += acceleration * deltaTimeSeconds;
    this.currentFOV += this.velocityFOV * deltaTimeSeconds;

    return {
      currentFOV: this.currentFOV,
      targetFOV,
      velocityFOV: this.velocityFOV,
      normalizedSpeed,
    };
  }

  public resetFOV(fov: number = 70.0): void {
    this.currentFOV = fov;
    this.velocityFOV = 0;
  }
}
