import { SurfaceFrictionEngine } from '../../src/game/physics/surface-friction-engine';
import { SURFACE_MATERIAL_PRESETS, Vector3D } from '@flowstate/shared';

describe('Phase 06 — Surface Friction & Ground Roll Physics', () => {
  let engine: SurfaceFrictionEngine;

  beforeEach(() => {
    engine = new SurfaceFrictionEngine('STONE_MARBLE', 28.0, 1.0);
  });

  describe('Surface Material Constants', () => {
    it('should initialize with STONE_MARBLE material properties by default', () => {
      const mat = engine.getMaterial();
      expect(mat.materialType).toBe('STONE_MARBLE');
      expect(mat.staticFriction).toBe(0.90);
      expect(mat.dynamicFriction).toBe(0.85);
    });

    it('should update properties dynamically when hot-swapping materials', () => {
      engine.setMaterial('CRYSTAL_ICE');
      const mat = engine.getMaterial();
      expect(mat.materialType).toBe('CRYSTAL_ICE');
      expect(mat.staticFriction).toBe(0.15);
      expect(mat.speedScalar).toBe(1.2);
    });
  });

  describe('Slope Incline Acceleration Math', () => {
    it('should compute zero downslope acceleration on flat ground (normal = [0, 1, 0])', () => {
      const normal: Vector3D = { x: 0, y: 1, z: 0 };
      const slope = engine.computeSlopeIncline(normal);

      expect(slope.slopeAngleRad).toBeCloseTo(0, 4);
      expect(slope.isDownslope).toBe(false);
      expect(slope.inclineGravityAccel).toBeCloseTo(0, 4);
    });

    it('should compute positive downslope gravity acceleration on an inclined plane', () => {
      // 30 degree incline (normal y = cos(30 deg) = 0.866)
      const normal: Vector3D = { x: 0, y: Math.cos(Math.PI / 6), z: Math.sin(Math.PI / 6) };
      const slope = engine.computeSlopeIncline(normal);

      expect(slope.slopeAngleRad).toBeCloseTo(Math.PI / 6, 3);
      expect(slope.isDownslope).toBe(true);
      expect(slope.inclineGravityAccel).toBeGreaterThan(0);
    });
  });

  describe('Kinetic Drift Threshold Evaluation', () => {
    it('should maintain solid traction on STONE_MARBLE under normal steering forces', () => {
      const velocity: Vector3D = { x: 0, y: 0, z: 5.0 };
      const normal: Vector3D = { x: 0, y: 1, z: 0 };
      const intent: Vector3D = { x: 0.1, y: 0, z: 0.99 };

      const result = engine.evaluateSurfaceFriction(velocity, normal, intent);
      expect(result.isDrifting).toBe(false);
      expect(result.effectiveFriction).toBe(SURFACE_MATERIAL_PRESETS.STONE_MARBLE.staticFriction);
    });

    it('should trigger kinetic drift on CRYSTAL_ICE when lateral turn forces exceed static grip', () => {
      engine.setMaterial('CRYSTAL_ICE');
      const velocity: Vector3D = { x: 0, y: 0, z: 25.0 }; // High speed
      const normal: Vector3D = { x: 0, y: 1, z: 0 };
      const intent: Vector3D = { x: 1.0, y: 0, z: 0.0 }; // Sharp 90 deg turn

      const result = engine.evaluateSurfaceFriction(velocity, normal, intent);
      expect(result.isDrifting).toBe(true);
      expect(result.effectiveFriction).toBe(SURFACE_MATERIAL_PRESETS.CRYSTAL_ICE.dynamicFriction);
    });
  });

  describe('Zero-Allocation Calculation Stability', () => {
    it('should execute 1,000 steps without NaN or memory exceptions', () => {
      const velocity: Vector3D = { x: 2.0, y: 0, z: 12.0 };
      const normal: Vector3D = { x: 0, y: 1, z: 0 };

      for (let i = 0; i < 1000; i++) {
        const res = engine.evaluateSurfaceFriction(velocity, normal);
        expect(Number.isNaN(res.effectiveFriction)).toBe(false);
        expect(Number.isFinite(res.rollingResistanceForce)).toBe(true);
      }
    });
  });
});
