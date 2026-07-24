import { TrackSplineSmoother } from '../../src/game/track/spline-smoother';
import { Vector3D } from '@flowstate/shared';

describe('Phase 17 — Track Spline Smoothing & Interpolation', () => {
  let smoother: TrackSplineSmoother;

  const samplePoints: Vector3D[] = [
    { x: 0, y: 0, z: 0 },
    { x: 5, y: 15, z: 20 }, // Sharp kink spike
    { x: 0, y: 0, z: 40 },
    { x: 0, y: 0, z: 60 },
  ];

  beforeEach(() => {
    smoother = new TrackSplineSmoother();
  });

  describe('Control Point Smoothing Filter', () => {
    it('should smooth out sharp control point kink spikes', () => {
      const smoothed = smoother.smoothControlPoints(samplePoints);

      expect(smoothed[1].y).toBeLessThan(samplePoints[1].y);
      expect(smoothed[0]).toEqual(samplePoints[0]);
    });
  });

  describe('Curvature Spike Clamping & Continuity', () => {
    it('should clamp raw curvature exceeding maxAllowedCurvature threshold', () => {
      const node = smoother.evaluateSmoothedSegment(
        samplePoints[0],
        samplePoints[1],
        samplePoints[2],
        samplePoints[3],
        0.5
      );

      expect(node.curvature).toBeLessThanOrEqual(0.05);
    });
  });
});
