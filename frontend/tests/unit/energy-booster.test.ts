import { EnergyBoosterEngine } from '../../src/game/interactables/energy-booster-engine';
import { EnergyRingPrimitive, MomentumBoosterPad, Vector3D } from '@flowstate/shared';

describe('Phase 08 — Energy Ring Magnetism & Momentum Boosters', () => {
  let engine: EnergyBoosterEngine;

  const testRing: EnergyRingPrimitive = {
    id: 'ring_alpha',
    center: { x: 0, y: 0, z: 20 },
    normal: { x: 0, y: 0, z: 1 },
    radius: 3.0,
    magneticRadius: 12.0,
    magneticStrength: 50.0,
    boostVelocityMagnitude: 10.0,
  };

  const testPad: MomentumBoosterPad = {
    id: 'pad_alpha',
    center: { x: 0, y: 0, z: 40 },
    forwardDirection: { x: 0, y: 0, z: 1 },
    width: 6.0,
    length: 8.0,
    boostSpeedBonus: 15.0,
    cooldownMs: 500,
  };

  beforeEach(() => {
    engine = new EnergyBoosterEngine();
  });

  describe('Inverse-Square Magnetic Attraction Field', () => {
    it('should compute magnetic attraction force when player is inside magnetic radius', () => {
      const playerPos: Vector3D = { x: 0, y: 0, z: 10.0 }; // 10m away from ring at z=20
      const magState = engine.computeMagnetismField(playerPos, [testRing]);

      expect(magState.isInMagneticField).toBe(true);
      expect(magState.distanceToRing).toBeCloseTo(10.0, 1);
      expect(magState.magneticForce.z).toBeGreaterThan(0); // Force pulls forward towards z=20
    });

    it('should return zero magnetic force when player is outside magnetic radius', () => {
      const playerPos: Vector3D = { x: 0, y: 0, z: -5.0 }; // 25m away from ring at z=20
      const magState = engine.computeMagnetismField(playerPos, [testRing]);

      expect(magState.isInMagneticField).toBe(false);
      expect(magState.magneticForce.z).toBe(0);
    });
  });

  describe('Energy Ring Passage & Velocity Amplification', () => {
    it('should trigger boost impulse and gain resonance when passing through ring aperture', () => {
      const playerPos: Vector3D = { x: 0, y: 0, z: 19.5 };
      const playerVel: Vector3D = { x: 0, y: 0, z: 15.0 };

      const result = engine.evaluateRingPassage(playerPos, playerVel, 1.0, testRing);

      expect(result.hasTriggeredBoost).toBe(true);
      expect(result.resonanceGain).toBe(15.0);
      expect(result.impulseVelocity.z).toBeGreaterThan(playerVel.z); // Boosted velocity > 15 m/s
    });
  });

  describe('Momentum Booster Pad Trajectory Acceleration', () => {
    it('should apply forward speed boost when stepping on booster pad', () => {
      const playerPos: Vector3D = { x: 1.0, y: 0, z: 40.0 };
      const playerVel: Vector3D = { x: 0, y: 0, z: 10.0 };

      const result = engine.evaluateBoosterPad(playerPos, playerVel, testPad);

      expect(result.hasTriggeredBoost).toBe(true);
      expect(result.impulseVelocity.z).toBeCloseTo(25.0, 1); // 10 + 15 bonus = 25 m/s
    });
  });

  describe('Zero-Allocation Performance Stability', () => {
    it('should execute 1,000 steps without NaN or memory exceptions', () => {
      const playerPos: Vector3D = { x: 0, y: 0, z: 12.0 };
      const playerVel: Vector3D = { x: 0, y: 0, z: 10.0 };

      for (let i = 0; i < 1000; i++) {
        const mag = engine.computeMagnetismField(playerPos, [testRing]);
        const ringRes = engine.evaluateRingPassage(playerPos, playerVel, 1.0, testRing);
        const padRes = engine.evaluateBoosterPad(playerPos, playerVel, testPad);

        expect(Number.isNaN(mag.magneticForce.z)).toBe(false);
        expect(Number.isNaN(ringRes.impulseVelocity.z)).toBe(false);
        expect(Number.isNaN(padRes.impulseVelocity.z)).toBe(false);
      }
    });
  });
});
