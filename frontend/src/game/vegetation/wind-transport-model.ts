import { WindDispersalVector } from '@flowstate/shared';

export class WindTransportModel {
  private currentVector: WindDispersalVector = {
    directionX: 1.0,
    directionZ: 0.0,
    velocityMs: 2.0,
    seedDriftRate: 0.1,
    pollenCount: 0.0,
    petalDriftRate: 0.0,
  };

  public update(
    baseWindSpeed: number,
    baseWindAngleRad: number,
    bloomProgress: number,
    windDampingFactor: number
  ): WindDispersalVector {
    const effectiveWindSpeed = Math.max(0.1, baseWindSpeed * (1.0 - windDampingFactor));
    const directionX = Math.cos(baseWindAngleRad);
    const directionZ = Math.sin(baseWindAngleRad);

    const seedDriftRate = effectiveWindSpeed * 0.15;
    const pollenCount = bloomProgress * effectiveWindSpeed * 0.8;
    const petalDriftRate = (bloomProgress > 0.4 && effectiveWindSpeed > 0.5)
      ? (bloomProgress - 0.4) * effectiveWindSpeed * 1.2
      : 0.0;

    this.currentVector = {
      directionX,
      directionZ,
      velocityMs: effectiveWindSpeed,
      seedDriftRate,
      pollenCount,
      petalDriftRate,
    };

    return this.currentVector;
  }

  public getCurrentVector(): WindDispersalVector {
    return this.currentVector;
  }
}
