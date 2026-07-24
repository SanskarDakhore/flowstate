import {
  CollisionContact,
  SpherePrimitive,
  TrackBoundaryWall,
  TrackFrameBasis,
  TrackRespawnCheckpoint,
  TrackWorldClearanceZone,
  Vector3D,
} from '@flowstate/shared';

export class CollisionSolverEngine {
  private defaultRestitution: number = 0.65;
  private sphereMass: number = 1.0;
  private maxAllowedOutBoundsDistance: number = 18.0;

  private lastSafeCheckpoint: TrackRespawnCheckpoint = {
    safePosition: { x: 0, y: 0, z: 0 },
    safeVelocity: { x: 0, y: 0, z: 15 },
    trackProgressRatio: 0.0,
    isOutOfBounds: false,
  };

  constructor(restitution: number = 0.65, sphereMass: number = 1.0) {
    this.defaultRestitution = restitution;
    this.sphereMass = sphereMass;
  }

  public solveSphereWallCollision(
    sphere: SpherePrimitive,
    velocity: Vector3D,
    wall: TrackBoundaryWall
  ): { contact: CollisionContact; resolvedVelocity: Vector3D; resolvedPosition: Vector3D } {
    // Vector from point on plane to sphere center
    const dx = sphere.center.x - wall.pointOnPlane.x;
    const dy = sphere.center.y - wall.pointOnPlane.y;
    const dz = sphere.center.z - wall.pointOnPlane.z;

    // Distance along wall normal
    const dist = dx * wall.planeNormal.x + dy * wall.planeNormal.y + dz * wall.planeNormal.z;
    const penetration = sphere.radius - dist;

    if (penetration <= 0) {
      return {
        contact: {
          hasContact: false,
          contactPoint: sphere.center,
          normal: wall.planeNormal,
          penetrationDepth: 0,
          normalImpulseMagnitude: 0,
          isWallBounce: false,
        },
        resolvedVelocity: velocity,
        resolvedPosition: sphere.center,
      };
    }

    // Resolve positional penetration overlap
    const resolvedPosition: Vector3D = {
      x: sphere.center.x + wall.planeNormal.x * penetration,
      y: sphere.center.y + wall.planeNormal.y * penetration,
      z: sphere.center.z + wall.planeNormal.z * penetration,
    };

    // Calculate normal impulse Jn = -(1 + e) * (v dot N) * m
    const vDotN = velocity.x * wall.planeNormal.x + velocity.y * wall.planeNormal.y + velocity.z * wall.planeNormal.z;
    let normalImpulse = 0;
    let resolvedVelocity: Vector3D = { ...velocity };

    if (vDotN < 0) {
      const e = wall.restitution ?? this.defaultRestitution;
      normalImpulse = -(1 + e) * vDotN * this.sphereMass;

      // Normal reflection vector
      let vx = velocity.x + wall.planeNormal.x * (normalImpulse / this.sphereMass);
      let vy = velocity.y + wall.planeNormal.y * (normalImpulse / this.sphereMass);
      let vz = velocity.z + wall.planeNormal.z * (normalImpulse / this.sphereMass);

      // Tangential Coulomb friction impulse damping
      const mu = wall.friction ?? 0.2;
      const tanX = velocity.x - vDotN * wall.planeNormal.x;
      const tanY = velocity.y - vDotN * wall.planeNormal.y;
      const tanZ = velocity.z - vDotN * wall.planeNormal.z;
      const tanLen = Math.sqrt(tanX * tanX + tanY * tanY + tanZ * tanZ);

      if (tanLen > 1e-4) {
        const frictionFactor = Math.min(1.0, (mu * normalImpulse) / tanLen);
        vx -= (tanX / tanLen) * frictionFactor;
        vy -= (tanY / tanLen) * frictionFactor;
        vz -= (tanZ / tanLen) * frictionFactor;
      }

      resolvedVelocity = { x: vx, y: vy, z: vz };
    }

    const contactPoint: Vector3D = {
      x: sphere.center.x - wall.planeNormal.x * sphere.radius,
      y: sphere.center.y - wall.planeNormal.y * sphere.radius,
      z: sphere.center.z - wall.planeNormal.z * sphere.radius,
    };

    return {
      contact: {
        hasContact: true,
        contactPoint,
        normal: wall.planeNormal,
        penetrationDepth: penetration,
        normalImpulseMagnitude: normalImpulse,
        isWallBounce: vDotN < -0.5,
      },
      resolvedVelocity,
      resolvedPosition,
    };
  }

  public enforceTrackWorldClearance(
    trackFrame: TrackFrameBasis,
    terrainHeight: number,
    clearanceBuffer: number = 2.0
  ): TrackWorldClearanceZone {
    const requiredRadius = trackFrame.width * 0.5 + clearanceBuffer;
    // World terrain height clearance plane must stay below track surface minus buffer
    const maxAllowedTerrainHeight = trackFrame.position.y - 0.5;

    return {
      trackCenter: trackFrame.position,
      trackTangent: trackFrame.tangent,
      trackWidth: trackFrame.width,
      requiredClearanceRadius: requiredRadius,
      maxAllowedTerrainHeight,
    };
  }

  public evaluateOutOfBounds(
    playerPosition: Vector3D,
    nearestTrackFrame: TrackFrameBasis,
    progressRatio: number = 0.5
  ): TrackRespawnCheckpoint {
    // Distance vector from nearest track center to player
    const dx = playerPosition.x - nearestTrackFrame.position.x;
    const dy = playerPosition.y - nearestTrackFrame.position.y;
    const dz = playerPosition.z - nearestTrackFrame.position.z;
    const lateralDist = Math.sqrt(dx * dx + dz * dz);

    const isLateralOut = lateralDist > nearestTrackFrame.width * 1.5 + this.maxAllowedOutBoundsDistance;
    const isVerticalOut = dy < -20.0; // Fallen more than 20m below track elevation

    const isOutOfBounds = isLateralOut || isVerticalOut;

    if (!isOutOfBounds) {
      // Update last known safe checkpoint vector
      this.lastSafeCheckpoint = {
        safePosition: {
          x: nearestTrackFrame.position.x,
          y: nearestTrackFrame.position.y + 1.0, // 1m ground clearance offset
          z: nearestTrackFrame.position.z,
        },
        safeVelocity: {
          x: nearestTrackFrame.tangent.x * 12.0,
          y: 0.0,
          z: nearestTrackFrame.tangent.z * 12.0,
        },
        trackProgressRatio: progressRatio,
        isOutOfBounds: false,
      };
    } else {
      this.lastSafeCheckpoint = {
        ...this.lastSafeCheckpoint,
        isOutOfBounds: true,
      };
    }

    return this.lastSafeCheckpoint;
  }

  public testRingTriggerIntersection(
    sphere: SpherePrimitive,
    ringCenter: Vector3D,
    ringRadius: number = 3.0
  ): boolean {
    const dx = sphere.center.x - ringCenter.x;
    const dy = sphere.center.y - ringCenter.y;
    const dz = sphere.center.z - ringCenter.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    const threshold = sphere.radius + ringRadius;
    return distSq <= threshold * threshold;
  }
}
