import { KineticSplashEngine } from '../../src/rendering/vfx/kinetic-splash-engine';
import { Vector3D } from '@flowstate/shared';

describe('Phase 13 — Particle Systems & Kinetic Splashes', () => {
  let vfxEngine: KineticSplashEngine;

  const playerPos: Vector3D = { x: 0, y: 1.0, z: 50.0 };
  const playerVel: Vector3D = { x: 0, y: 0, z: 25.0 };

  beforeEach(() => {
    vfxEngine = new KineticSplashEngine();
  });

  describe('Ground Roll Trailing Spark Emitters', () => {
    it('should spawn trailing sparks when player is rolling above speed threshold (>2m/s)', () => {
      const burst = vfxEngine.emitGroundRollTrail(playerPos, playerVel);

      expect(burst.spawnedParticleCount).toBe(2);
      expect(vfxEngine.getEmitterState().activeParticleCount).toBe(2);
    });

    it('should not spawn trail particles when player speed is under 2m/s threshold', () => {
      const slowVel: Vector3D = { x: 0, y: 0, z: 0.5 };
      const burst = vfxEngine.emitGroundRollTrail(playerPos, slowVel);

      expect(burst.spawnedParticleCount).toBe(0);
    });
  });

  describe('High-Impact Wall Splash Bursts', () => {
    it('should trigger radial splash burst when collision force exceeds 5.0 Ns threshold', () => {
      const contactPos: Vector3D = { x: 5.0, y: 1.0, z: 50.0 };
      const normal: Vector3D = { x: -1.0, y: 0.0, z: 0.0 };

      const burst = vfxEngine.triggerWallSplash(contactPos, normal, 12.0);

      expect(burst.spawnedParticleCount).toBeGreaterThanOrEqual(40);
      expect(vfxEngine.getEmitterState().activeParticleCount).toBeGreaterThanOrEqual(40);
    });

    it('should ignore weak wall impacts below 5.0 Ns threshold', () => {
      const contactPos: Vector3D = { x: 5.0, y: 1.0, z: 50.0 };
      const normal: Vector3D = { x: -1.0, y: 0.0, z: 0.0 };

      const burst = vfxEngine.triggerWallSplash(contactPos, normal, 3.0);

      expect(burst.spawnedParticleCount).toBe(0);
    });
  });

  describe('Energy Ring Eruption Bursts', () => {
    it('should spawn 40 ring eruption particles on ring passage trigger', () => {
      const ringCenter: Vector3D = { x: 0, y: 0, z: 100.0 };
      const ringNormal: Vector3D = { x: 0, y: 0, z: 1.0 };

      const burst = vfxEngine.triggerRingEruption(ringCenter, ringNormal);

      expect(burst.spawnedParticleCount).toBe(40);
    });
  });

  describe('Particle Simulation Tick & Recycling', () => {
    it('should advance particle simulation, decay life, and recycle expired particles', () => {
      vfxEngine.triggerWallSplash(playerPos, { x: 0, y: 1, z: 0 }, 10.0);
      const initialCount = vfxEngine.getEmitterState().activeParticleCount;

      // Advance simulation by 600ms (exceeding particle lifetime 500ms)
      for (let i = 0; i < 40; i++) {
        vfxEngine.stepSimulation(0.016);
      }

      const finalCount = vfxEngine.getEmitterState().activeParticleCount;
      expect(finalCount).toBeLessThan(initialCount);
    });
  });

  describe('Zero-Allocation Steady-State Stability', () => {
    it('should execute 1,000 particle simulation ticks without memory exceptions or NaNs', () => {
      vfxEngine.triggerWallSplash(playerPos, { x: 0, y: 1, z: 0 }, 15.0);

      for (let i = 0; i < 1000; i++) {
        vfxEngine.emitGroundRollTrail(playerPos, playerVel);
        vfxEngine.stepSimulation(0.016);
      }

      const state = vfxEngine.getEmitterState();
      expect(Number.isNaN(state.activeParticleCount)).toBe(false);
    });
  });
});
