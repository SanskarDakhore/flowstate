import {
  SmoothedSplineNode,
  SplineTensionConfig,
  Vector3D,
} from '@flowstate/shared';
import { CatmullRomSplineSolver } from './catmull-rom-spline';

export const DEFAULT_TENSION_CONFIG: SplineTensionConfig = {
  tension: 0.5,
  maxAllowedCurvature: 0.05,
  smoothingPasses: 2,
};

export class TrackSplineSmoother {
  private config: SplineTensionConfig;
  private solver: CatmullRomSplineSolver;

  constructor(config: SplineTensionConfig = DEFAULT_TENSION_CONFIG) {
    this.config = config;
    this.solver = new CatmullRomSplineSolver(config.tension);
  }

  public smoothControlPoints(points: Vector3D[]): Vector3D[] {
    if (points.length < 3) return [...points];

    const smoothed: Vector3D[] = new Array(points.length);
    smoothed[0] = { ...points[0] };
    smoothed[points.length - 1] = { ...points[points.length - 1] };

    for (let pass = 0; pass < this.config.smoothingPasses; pass++) {
      for (let i = 1; i < points.length - 1; i++) {
        const prev = pass === 0 ? points[i - 1] : smoothed[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Laplacian smoothing filter: P_smooth = 0.5 * P_curr + 0.25 * (P_prev + P_next)
        smoothed[i] = {
          x: 0.5 * curr.x + 0.25 * (prev.x + next.x),
          y: 0.5 * curr.y + 0.25 * (prev.y + next.y),
          z: 0.5 * curr.z + 0.25 * (prev.z + next.z),
        };
      }
    }

    return smoothed;
  }

  public evaluateSmoothedSegment(
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    p3: Vector3D,
    t: number
  ): SmoothedSplineNode {
    const frame = this.solver.computeFrameBasis(p0, p1, p2, p3, t, 8.0);
    const pos = frame.position;
    const tangent = frame.tangent;
    const rawCurvature = frame.curvature;

    let isClamped = false;
    let curvature = rawCurvature;

    if (rawCurvature > this.config.maxAllowedCurvature) {
      curvature = this.config.maxAllowedCurvature;
      isClamped = true;
    }

    return {
      position: pos,
      tangent,
      curvature,
      isClamped,
    };
  }
}
