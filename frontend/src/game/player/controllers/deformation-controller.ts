import { ExpressionInputs, PlayerExpressionProfile } from '../player-expression-profile';

export class DeformationController {
  private profile: PlayerExpressionProfile;
  private currentScale: { x: number; y: number; z: number } = { x: 1.0, y: 1.0, z: 1.0 };
  private springVelocity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  constructor(profile: PlayerExpressionProfile) {
    this.profile = profile;
  }

  public setProfile(profile: PlayerExpressionProfile): void {
    this.profile = profile;
  }

  public triggerJumpLaunchCompression(): void {
    const intensity = this.profile.expressionIntensity;
    const compression = 1.0 - (1.0 - this.profile.jumpLaunchCompression) * intensity;
    const sideStretch = 1.0 / Math.sqrt(Math.max(0.1, compression));

    // Zero-delay instantaneous visual impulse injection into transform state
    this.currentScale = {
      x: sideStretch,
      y: compression,
      z: sideStretch,
    };
    // Rebound velocity directed upward into launch stretch
    this.springVelocity = {
      x: (1.0 - sideStretch) * 4.0,
      y: (1.25 - compression) * 8.0,
      z: (1.0 - sideStretch) * 4.0,
    };
  }

  public triggerLandingImpact(impactVelocity: number): void {
    const intensity = this.profile.expressionIntensity;
    const normalizedImpact = Math.min(1.0, Math.abs(impactVelocity) / 20.0);
    const squishFactor = 1.0 - normalizedImpact * 0.25 * intensity;
    const sideExpansion = 1.0 / Math.sqrt(Math.max(0.1, squishFactor));

    this.currentScale = {
      x: sideExpansion,
      y: squishFactor,
      z: sideExpansion,
    };
    this.springVelocity = {
      x: (1.0 - sideExpansion) * 5.0,
      y: (1.0 - squishFactor) * 10.0,
      z: (1.0 - sideExpansion) * 5.0,
    };
  }

  public update(inputs: ExpressionInputs, dt: number): { x: number; y: number; z: number } {
    if (dt <= 0) {
      return { ...this.currentScale };
    }

    const clampedDt = Math.min(0.1, Math.max(0.001, dt));
    const intensity = this.profile.expressionIntensity;

    // 1. Derive target deformation vector based on kinematic speed & airborne trajectory
    const speed = inputs.motion.speed;
    const maxSpeed = 20.0;
    const normalizedSpeed = Math.min(1.0, speed / maxSpeed);

    let targetX = 1.0;
    let targetY = 1.0;
    let targetZ = 1.0;

    if (!inputs.motion.isGrounded) {
      const vertVel = inputs.motion.verticalVelocity;
      if (vertVel > 2.5) { // ASCENDING
        targetY = 1.0 + 0.18 * intensity;
      } else if (vertVel < -2.5) { // DESCENDING
        targetY = 1.0 - 0.12 * intensity;
      }
    } else if (normalizedSpeed > 0.05) { // ACCELERATING / RUNNING
      const stretchZ = 1.0 + (this.profile.maxHorizontalStretch * normalizedSpeed) * intensity;
      targetZ = stretchZ;
      targetX = 1.0 / Math.sqrt(targetZ);
      targetY = targetX;
    }

    // Ensure target satisfies volume preservation (targetX * targetY * targetZ = 1.0)
    if (inputs.motion.isGrounded && normalizedSpeed <= 0.05) {
      targetX = 1.0;
      targetY = 1.0;
      targetZ = 1.0;
    } else if (!inputs.motion.isGrounded) {
      targetX = 1.0 / Math.sqrt(Math.max(0.1, targetY));
      targetZ = targetX;
    }

    // 2. Mass-Spring-Damper Integration step
    const k = this.profile.landingElasticity;
    const c = this.profile.landingDamping;

    const ax = -k * (this.currentScale.x - targetX) - c * this.springVelocity.x;
    const ay = -k * (this.currentScale.y - targetY) - c * this.springVelocity.y;
    const az = -k * (this.currentScale.z - targetZ) - c * this.springVelocity.z;

    this.springVelocity.x += ax * clampedDt;
    this.springVelocity.y += ay * clampedDt;
    this.springVelocity.z += az * clampedDt;

    this.currentScale.x += this.springVelocity.x * clampedDt;
    this.currentScale.y += this.springVelocity.y * clampedDt;
    this.currentScale.z += this.springVelocity.z * clampedDt;

    // 3. Post-integration normalization to enforce volume preservation invariant (Sx * Sy * Sz = 1.0 +/- 0.005)
    const volume = this.currentScale.x * this.currentScale.y * this.currentScale.z;
    if (volume > 1e-4 && Math.abs(volume - 1.0) > 0.0001) {
      const scaleCorrection = Math.pow(1.0 / volume, 1.0 / 3.0);
      this.currentScale.x *= scaleCorrection;
      this.currentScale.y *= scaleCorrection;
      this.currentScale.z *= scaleCorrection;
    }

    return { ...this.currentScale };
  }

  public reset(): void {
    this.currentScale = { x: 1.0, y: 1.0, z: 1.0 };
    this.springVelocity = { x: 0, y: 0, z: 0 };
  }
}
