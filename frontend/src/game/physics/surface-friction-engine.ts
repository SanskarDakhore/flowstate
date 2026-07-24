import {
  SlopeInclineState,
  SURFACE_MATERIAL_PRESETS,
  SurfaceFrictionResult,
  SurfaceMaterialType,
  SurfacePhysicalProperties,
  Vector3D,
} from '@flowstate/shared';

export class SurfaceFrictionEngine {
  private currentMaterial: SurfacePhysicalProperties;
  private gravityMagnitude: number = 28.0; // Terrestrial base gravity
  private sphereMass: number = 1.0;

  constructor(
    materialType: SurfaceMaterialType = 'STONE_MARBLE',
    gravityMagnitude: number = 28.0,
    sphereMass: number = 1.0
  ) {
    this.currentMaterial = SURFACE_MATERIAL_PRESETS[materialType] ?? SURFACE_MATERIAL_PRESETS.STONE_MARBLE;
    this.gravityMagnitude = gravityMagnitude;
    this.sphereMass = sphereMass;
  }

  public setMaterial(materialType: SurfaceMaterialType): void {
    this.currentMaterial = SURFACE_MATERIAL_PRESETS[materialType] ?? SURFACE_MATERIAL_PRESETS.STONE_MARBLE;
  }

  public getMaterial(): SurfacePhysicalProperties {
    return this.currentMaterial;
  }

  public computeSlopeIncline(surfaceNormal: Vector3D): SlopeInclineState {
    const worldUp = { x: 0, y: 1, z: 0 };
    // Normal dot worldUp gives cos(slopeAngle)
    const dot = Math.max(-1.0, Math.min(1.0, surfaceNormal.y));
    const slopeAngleRad = Math.acos(dot);

    // Downslope vector S_down = g - (g dot N) * N
    const gravityVec = { x: 0, y: -this.gravityMagnitude, z: 0 };
    const gDotN = gravityVec.y * surfaceNormal.y;

    const sDx = -gDotN * surfaceNormal.x;
    const sDy = gravityVec.y - gDotN * surfaceNormal.y;
    const sDz = -gDotN * surfaceNormal.z;

    const sLen = Math.sqrt(sDx * sDx + sDy * sDy + sDz * sDz);
    let downslopeDir = { x: 0, y: 0, z: 0 };
    if (sLen > 1e-4) {
      downslopeDir = { x: sDx / sLen, y: sDy / sLen, z: sDz / sLen };
    }

    const inclineGravityAccel = this.gravityMagnitude * Math.sin(slopeAngleRad);

    return {
      slopeAngleRad,
      isDownslope: slopeAngleRad > 0.01,
      downslopeDirection: downslopeDir,
      inclineGravityAccel,
    };
  }

  public evaluateSurfaceFriction(
    velocity: Vector3D,
    surfaceNormal: Vector3D,
    steeringIntentDir?: Vector3D
  ): SurfaceFrictionResult {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
    const slopeState = this.computeSlopeIncline(surfaceNormal);

    // Normal force magnitude: N = m * g * cos(slope)
    const normalForce = this.sphereMass * this.gravityMagnitude * Math.cos(slopeState.slopeAngleRad);

    // Rolling resistance force: F_rr = mu_r * N
    const rollingResistanceForce = this.currentMaterial.rollingResistance * normalForce * speed;

    // Downslope acceleration vector
    const downslopeAccel = {
      x: slopeState.downslopeDirection.x * slopeState.inclineGravityAccel,
      y: slopeState.downslopeDirection.y * slopeState.inclineGravityAccel,
      z: slopeState.downslopeDirection.z * slopeState.inclineGravityAccel,
    };

    // Kinetic drift evaluation: lateral centrifugal force vs static friction limit
    let lateralGForce = 0;
    let isDrifting = false;

    if (speed > 1.0 && steeringIntentDir) {
      const velDirX = velocity.x / speed;
      const velDirZ = velocity.z / speed;

      // Cross product in 2D plane (x, z) gives lateral side component
      const sideComponent = velDirX * steeringIntentDir.z - velDirZ * steeringIntentDir.x;
      lateralGForce = Math.abs(sideComponent) * (speed * 0.5);

      // Max static friction traction threshold: F_max = mu_s * N
      const maxStaticTraction = this.currentMaterial.staticFriction * normalForce;
      if (lateralGForce > maxStaticTraction) {
        isDrifting = true;
      }
    }

    const effectiveFriction = isDrifting
      ? this.currentMaterial.dynamicFriction
      : this.currentMaterial.staticFriction;

    return {
      effectiveFriction,
      rollingResistanceForce,
      downslopeAcceleration: downslopeAccel,
      isDrifting,
      lateralGForce,
      surfaceType: this.currentMaterial.materialType,
    };
  }
}
