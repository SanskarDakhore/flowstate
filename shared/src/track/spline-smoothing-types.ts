import { Vector3D } from './track-types';

export interface SplineTensionConfig {
  readonly tension: number;         // Default 0.5 (centripetal)
  readonly maxAllowedCurvature: number; // Curvature ceiling cap (e.g. 0.05 rad/m)
  readonly smoothingPasses: number;
}

export interface SmoothedSplineNode {
  readonly position: Vector3D;
  readonly tangent: Vector3D;
  readonly curvature: number;
  readonly isClamped: boolean;
}
