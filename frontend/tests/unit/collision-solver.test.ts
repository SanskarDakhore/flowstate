import { CollisionSolverEngine } from '../../src/game/physics/collision-solver-engine';
import { SpherePrimitive, TrackBoundaryWall, TrackFrameBasis, Vector3D } from '@flowstate/shared';

describe('Phase 07 — Collision Solver & Track Boundaries', () => {
  let engine: CollisionSolverEngine;

  beforeEach(() => {
    engine = new CollisionSolverEngine(0.65, 1.0);
  });

  describe('Sphere vs Boundary Wall Impulse Response', () => {
    it('should detect contact and bounce sphere away from wall with restitution', () => {
      const sphere: SpherePrimitive = { center: { x: 3.8, y: 0, z: 10 }, radius: 1.0 };
      const velocity: Vector3D = { x: 5.0, y: 0, z: 10.0 }; // Moving into right wall

      // Wall at x = 4.0 with normal pointing left [-1, 0, 0]
      const wall: TrackBoundaryWall = {
        id: 'right_wall',
        planeNormal: { x: -1.0, y: 0, z: 0 },
        pointOnPlane: { x: 4.0, y: 0, z: 10 },
        restitution: 0.65,
        friction: 0.1,
      };

      const result = engine.solveSphereWallCollision(sphere, velocity, wall);

      expect(result.contact.hasContact).toBe(true);
      expect(result.contact.penetrationDepth).toBeCloseTo(0.8, 2);
      expect(result.contact.isWallBounce).toBe(true);
      expect(result.resolvedVelocity.x).toBeLessThan(0); // Vector reversed away from wall
    });

    it('should ignore wall when sphere is outside collision penetration distance', () => {
      const sphere: SpherePrimitive = { center: { x: 0, y: 0, z: 10 }, radius: 1.0 };
      const velocity: Vector3D = { x: 0, y: 0, z: 15.0 };

      const wall: TrackBoundaryWall = {
        id: 'right_wall',
        planeNormal: { x: -1.0, y: 0, z: 0 },
        pointOnPlane: { x: 4.0, y: 0, z: 10 },
        restitution: 0.65,
        friction: 0.1,
      };

      const result = engine.solveSphereWallCollision(sphere, velocity, wall);
      expect(result.contact.hasContact).toBe(false);
      expect(result.resolvedVelocity.x).toBe(0);
    });
  });

  describe('World Settings Track Clearance Resolution', () => {
    it('should enforce required track clearance and max allowed terrain height', () => {
      const trackFrame: TrackFrameBasis = {
        position: { x: 0, y: 10.0, z: 50.0 },
        tangent: { x: 0, y: 0, z: 1 },
        normal: { x: 0, y: 1, z: 0 },
        binormal: { x: 1, y: 0, z: 0 },
        curvature: 0.01,
        width: 8.0,
      };

      const clearance = engine.enforceTrackWorldClearance(trackFrame, 12.0, 2.0);

      expect(clearance.requiredClearanceRadius).toBe(6.0); // (8.0 / 2) + 2.0
      expect(clearance.maxAllowedTerrainHeight).toBe(9.5); // 10.0 - 0.5
    });
  });

  describe('Out-of-Bounds Detection & Respawn Checkpoints', () => {
    const trackFrame: TrackFrameBasis = {
      position: { x: 0, y: 0, z: 100.0 },
      tangent: { x: 0, y: 0, z: 1.0 },
      normal: { x: 0, y: 1, z: 0 },
      binormal: { x: 1, y: 0, z: 0 },
      curvature: 0.0,
      width: 8.0,
    };

    it('should update safe checkpoint vector when player is on track', () => {
      const posOnTrack: Vector3D = { x: 1.0, y: 0.5, z: 100.0 };
      const checkpoint = engine.evaluateOutOfBounds(posOnTrack, trackFrame, 0.4);

      expect(checkpoint.isOutOfBounds).toBe(false);
      expect(checkpoint.safePosition.z).toBe(100.0);
    });

    it('should trigger out of bounds when player falls >20m below track elevation', () => {
      const posFallen: Vector3D = { x: 0.0, y: -25.0, z: 100.0 };
      const checkpoint = engine.evaluateOutOfBounds(posFallen, trackFrame, 0.4);

      expect(checkpoint.isOutOfBounds).toBe(true);
    });
  });

  describe('Ring Trigger Volume Intersection', () => {
    it('should detect ring trigger volume intersection when sphere enters radius', () => {
      const sphere: SpherePrimitive = { center: { x: 1.0, y: 0, z: 50 }, radius: 1.0 };
      const ringCenter: Vector3D = { x: 0, y: 0, z: 50 };

      const hit = engine.testRingTriggerIntersection(sphere, ringCenter, 3.0);
      expect(hit).toBe(true);
    });
  });
});
