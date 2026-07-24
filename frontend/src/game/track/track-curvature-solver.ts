import { TrackSlopeBankState } from '@flowstate/shared';

export class TrackCurvatureSolver {
  private gravity: number = 9.81;
  private maxBankAngleRad: number = Math.PI / 4; // 45 degrees max bank angle constraint

  constructor(gravity: number = 9.81, maxBankAngleDeg: number = 45) {
    this.gravity = gravity;
    this.maxBankAngleRad = (maxBankAngleDeg * Math.PI) / 180;
  }

  public computeBankState(
    speed: number,
    curvature: number,
    curveDirectionSign: number = 1.0
  ): TrackSlopeBankState {
    const safeSpeed = Math.max(0, speed);
    const safeCurvature = Math.max(0, curvature);

    // Centrifugal acceleration: a_c = v^2 * kappa
    const centrifugalAcceleration = safeSpeed * safeSpeed * safeCurvature;

    // Ideal bank angle: theta = arctan(a_c / g) * sign
    const idealAngle = Math.atan2(centrifugalAcceleration, this.gravity) * curveDirectionSign;

    // Clamped bank angle adhering to physics safety envelope
    const clampedAngle = Math.max(
      -this.maxBankAngleRad,
      Math.min(this.maxBankAngleRad, idealAngle)
    );

    // Side G-force calculation
    const lateralGForce = (centrifugalAcceleration / this.gravity) * curveDirectionSign;

    return {
      centrifugalAcceleration,
      idealBankAngleRad: idealAngle,
      clampedBankAngleRad: clampedAngle,
      lateralGForce,
    };
  }
}
