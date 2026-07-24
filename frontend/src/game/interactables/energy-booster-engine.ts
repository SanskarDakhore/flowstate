import {
  BoosterImpulseResult,
  EnergyRingPrimitive,
  MagnetismFieldState,
  MomentumBoosterPad,
  Vector3D,
} from '@flowstate/shared';

export class EnergyBoosterEngine {
  private baseEpsilon: number = 0.5; // Softening parameter to prevent division by zero near ring center

  public computeMagnetismField(
    playerPosition: Vector3D,
    rings: ReadonlyArray<EnergyRingPrimitive>
  ): MagnetismFieldState {
    let nearestRing: EnergyRingPrimitive | null = null;
    let minDistance = Infinity;

    for (const ring of rings) {
      if (ring.isCollected) continue;

      const dx = ring.center.x - playerPosition.x;
      const dy = ring.center.y - playerPosition.y;
      const dz = ring.center.z - playerPosition.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= ring.magneticRadius && dist < minDistance) {
        minDistance = dist;
        nearestRing = ring;
      }
    }

    if (!nearestRing) {
      return {
        isInMagneticField: false,
        magneticForce: { x: 0, y: 0, z: 0 },
        distanceToRing: Infinity,
      };
    }

    // Direction vector from player to ring center
    const dx = nearestRing.center.x - playerPosition.x;
    const dy = nearestRing.center.y - playerPosition.y;
    const dz = nearestRing.center.z - playerPosition.z;
    const dirX = dx / minDistance;
    const dirY = dy / minDistance;
    const dirZ = dz / minDistance;

    // Inverse-square magnetic pull magnitude: F_mag = k_mag / (d^2 + epsilon)
    const magScalar = nearestRing.magneticStrength / (minDistance * minDistance + this.baseEpsilon);

    return {
      isInMagneticField: true,
      magneticForce: {
        x: dirX * magScalar,
        y: dirY * magScalar,
        z: dirZ * magScalar,
      },
      distanceToRing: minDistance,
      targetRingId: nearestRing.id,
    };
  }

  public evaluateRingPassage(
    playerPosition: Vector3D,
    playerVelocity: Vector3D,
    playerRadius: number,
    ring: EnergyRingPrimitive
  ): BoosterImpulseResult {
    if (ring.isCollected) {
      return { hasTriggeredBoost: false, impulseVelocity: playerVelocity, resonanceGain: 0 };
    }

    const dx = playerPosition.x - ring.center.x;
    const dy = playerPosition.y - ring.center.y;
    const dz = playerPosition.z - ring.center.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const hitRadius = playerRadius + ring.radius;

    if (distSq <= hitRadius * hitRadius) {
      // Ring passed! Apply 1.25x speed boost + ring impulse normal
      const curSpeed = Math.sqrt(
        playerVelocity.x * playerVelocity.x +
          playerVelocity.y * playerVelocity.y +
          playerVelocity.z * playerVelocity.z
      );

      const boostSpeed = (curSpeed + ring.boostVelocityMagnitude) * 1.25;
      const boostVel: Vector3D = {
        x: ring.normal.x * boostSpeed,
        y: ring.normal.y * boostSpeed,
        z: ring.normal.z * boostSpeed,
      };

      return {
        hasTriggeredBoost: true,
        impulseVelocity: boostVel,
        resonanceGain: 15.0, // +15% resonance refill
        activeBoosterId: ring.id,
      };
    }

    return { hasTriggeredBoost: false, impulseVelocity: playerVelocity, resonanceGain: 0 };
  }

  public evaluateBoosterPad(
    playerPosition: Vector3D,
    playerVelocity: Vector3D,
    pad: MomentumBoosterPad
  ): BoosterImpulseResult {
    const dx = Math.abs(playerPosition.x - pad.center.x);
    const dz = Math.abs(playerPosition.z - pad.center.z);

    if (dx <= pad.width * 0.5 && dz <= pad.length * 0.5) {
      const curSpeed = Math.sqrt(
        playerVelocity.x * playerVelocity.x +
          playerVelocity.y * playerVelocity.y +
          playerVelocity.z * playerVelocity.z
      );
      const newSpeed = curSpeed + pad.boostSpeedBonus;

      const boostedVel: Vector3D = {
        x: pad.forwardDirection.x * newSpeed,
        y: playerVelocity.y, // Preserve vertical velocity
        z: pad.forwardDirection.z * newSpeed,
      };

      return {
        hasTriggeredBoost: true,
        impulseVelocity: boostedVel,
        resonanceGain: 10.0,
        activeBoosterId: pad.id,
      };
    }

    return { hasTriggeredBoost: false, impulseVelocity: playerVelocity, resonanceGain: 0 };
  }
}
