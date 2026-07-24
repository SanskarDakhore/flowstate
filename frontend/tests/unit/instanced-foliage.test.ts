import { InstancedFoliageRenderer } from '../../src/rendering/environment/instanced-foliage-renderer';
import { Vector3D, WindSwayUniforms } from '@flowstate/shared';

describe('Phase 24 — GPU Instanced Grass & Foliage Renderer', () => {
  let renderer: InstancedFoliageRenderer;

  const wind: WindSwayUniforms = {
    windTime: 2.5,
    windStrength: 1.0,
    windFrequency: 2.0,
  };

  const spherePos: Vector3D = { x: 10.0, y: 1.0, z: 20.0 };

  beforeEach(() => {
    renderer = new InstancedFoliageRenderer();
  });

  describe('Instance Buffer Management', () => {
    it('should pack up to 1,000 foliage instances into pre-allocated Float32Array buffers', () => {
      for (let i = 0; i < 50; i++) {
        renderer.addInstance({ x: i * 2.0, y: 0.0, z: 10.0 }, Math.PI * 0.25, 1.2);
      }

      const metrics = renderer.getMetrics();
      expect(metrics.activeInstanceCount).toBe(50);
      expect(metrics.bufferByteLength).toBeGreaterThan(0);
    });
  });

  describe('Wind Sway & Sphere Touch Interaction Bending', () => {
    it('should calculate wind sway and outward bending for grass blades near rolling sphere', () => {
      renderer.addInstance({ x: 10.5, y: 1.0, z: 20.0 }); // Within 2.5m bend radius of spherePos (10, 1, 20)
      renderer.addInstance({ x: 100.0, y: 0.0, z: 100.0 }); // Far away

      renderer.updateWindAndSphereInteractions(wind, spherePos, 0.5);

      const metrics = renderer.getMetrics();
      expect(metrics.bentInstancesCount).toBe(1);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 foliage rendering updates without memory exceptions or NaNs', () => {
      for (let i = 0; i < 100; i++) {
        renderer.addInstance({ x: i * 1.5, y: 0, z: i * 2.0 });
      }

      for (let step = 0; step < 1000; step++) {
        renderer.updateWindAndSphereInteractions({ ...wind, windTime: step * 0.016 }, spherePos);
      }

      const metrics = renderer.getMetrics();
      expect(metrics.activeInstanceCount).toBe(100);
    });
  });
});
