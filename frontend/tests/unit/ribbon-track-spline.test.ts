import { CatmullRomSplineSolver } from '../../src/game/track/catmull-rom-spline';
import { TrackCurvatureSolver } from '../../src/game/track/track-curvature-solver';
import { RibbonMeshGenerator } from '../../src/game/track/ribbon-mesh-generator';
import { TrackFrameBasis, Vector3D } from '@flowstate/shared';

describe('Phase 04 — Ribbon Track Architecture & Curvature Spline Math', () => {
  let splineSolver: CatmullRomSplineSolver;
  let curvatureSolver: TrackCurvatureSolver;
  let meshGenerator: RibbonMeshGenerator;

  const p0: Vector3D = { x: 0, y: 0, z: -10 };
  const p1: Vector3D = { x: 0, y: 0, z: 0 };
  const p2: Vector3D = { x: 10, y: 0, z: 20 };
  const p3: Vector3D = { x: 20, y: 0, z: 40 };

  beforeEach(() => {
    splineSolver = new CatmullRomSplineSolver(0.5);
    curvatureSolver = new TrackCurvatureSolver(9.81, 45);
    meshGenerator = new RibbonMeshGenerator();
  });

  describe('CatmullRomSplineSolver', () => {
    it('should interpolate smooth 3D positions monotonically between p1 and p2', () => {
      const pos0 = splineSolver.evaluatePoint(p0, p1, p2, p3, 0.0);
      const posMid = splineSolver.evaluatePoint(p0, p1, p2, p3, 0.5);
      const pos1 = splineSolver.evaluatePoint(p0, p1, p2, p3, 1.0);

      expect(pos0.x).toBeCloseTo(p1.x, 4);
      expect(pos0.z).toBeCloseTo(p1.z, 4);
      expect(pos1.x).toBeCloseTo(p2.x, 4);
      expect(pos1.z).toBeCloseTo(p2.z, 4);

      expect(posMid.x).toBeGreaterThan(pos0.x);
      expect(posMid.x).toBeLessThan(pos1.x);
    });

    it('should evaluate unit length tangent vector', () => {
      const tangent = splineSolver.evaluateTangent(p0, p1, p2, p3, 0.5);
      const len = Math.sqrt(tangent.x ** 2 + tangent.y ** 2 + tangent.z ** 2);
      expect(len).toBeCloseTo(1.0, 4);
    });

    it('should compute orthogonal frame basis vectors', () => {
      const frame = splineSolver.computeFrameBasis(p0, p1, p2, p3, 0.5, 8.0);

      // Tangent dot Binormal == 0
      const dotTB = frame.tangent.x * frame.binormal.x + frame.tangent.y * frame.binormal.y + frame.tangent.z * frame.binormal.z;
      expect(dotTB).toBeCloseTo(0.0, 4);

      // Tangent dot Normal == 0
      const dotTN = frame.tangent.x * frame.normal.x + frame.tangent.y * frame.normal.y + frame.tangent.z * frame.normal.z;
      expect(dotTN).toBeCloseTo(0.0, 4);

      expect(frame.width).toBe(8.0);
    });
  });

  describe('TrackCurvatureSolver', () => {
    it('should compute centrifugal acceleration and dynamic bank angle', () => {
      const curvature = 0.02; // Curved track radius ~50m
      const speed = 25.0; // 25 m/s speed

      const bank = curvatureSolver.computeBankState(speed, curvature, 1.0);

      expect(bank.centrifugalAcceleration).toBeCloseTo(12.5, 2);
      expect(bank.idealBankAngleRad).toBeGreaterThan(0);
      expect(bank.clampedBankAngleRad).toBeLessThanOrEqual(Math.PI / 4); // Clamped at 45 deg
    });
  });

  describe('RibbonMeshGenerator', () => {
    it('should generate pre-allocated Float32Array vertex buffers for ribbon quad mesh', () => {
      const frames: TrackFrameBasis[] = [];
      const bankAngles: number[] = [];

      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const frame = splineSolver.computeFrameBasis(p0, p1, p2, p3, t, 6.0);
        frames.push(frame);
        bankAngles.push(0.1 * i);
      }

      const mesh = meshGenerator.generateRibbonMesh(frames, bankAngles);

      expect(mesh.vertexCount).toBe(22); // 11 frames * 2
      expect(mesh.indexCount).toBe(60); // 10 quads * 6
      expect(mesh.positions.length).toBe(22 * 3);
      expect(mesh.normals.length).toBe(22 * 3);
      expect(mesh.uvs.length).toBe(22 * 2);
      expect(mesh.indices.length).toBe(60);
    });
  });
});
