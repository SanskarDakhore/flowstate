import { TrackFrameBasis, TrackSplineNode, Vector3D } from '@flowstate/shared';

export class CatmullRomSplineSolver {
  private alpha: number = 0.5; // Centripetal parameterization

  constructor(alpha: number = 0.5) {
    this.alpha = alpha;
  }

  public evaluatePoint(
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    p3: Vector3D,
    t: number
  ): Vector3D {
    const tClamped = Math.min(1.0, Math.max(0.0, t));
    const t2 = tClamped * tClamped;
    const t3 = t2 * tClamped;

    // Standard Catmull-Rom Matrix formulation
    const x = 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * tClamped +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );

    const y = 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * tClamped +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );

    const z = 0.5 * (
      (2 * p1.z) +
      (-p0.z + p2.z) * tClamped +
      (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
      (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3
    );

    return { x, y, z };
  }

  public evaluateTangent(
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    p3: Vector3D,
    t: number
  ): Vector3D {
    const tClamped = Math.min(1.0, Math.max(0.0, t));
    const t2 = tClamped * tClamped;

    // First derivative with respect to t
    const dx = 0.5 * (
      (-p0.x + p2.x) +
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tClamped +
      3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2
    );

    const dy = 0.5 * (
      (-p0.y + p2.y) +
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tClamped +
      3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2
    );

    const dz = 0.5 * (
      (-p0.z + p2.z) +
      2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * tClamped +
      3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t2
    );

    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 1e-6) {
      return { x: 0, y: 0, z: 1 };
    }
    return { x: dx / len, y: dy / len, z: dz / len };
  }

  public evaluateCurvature(
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    p3: Vector3D,
    t: number
  ): number {
    const tClamped = Math.min(1.0, Math.max(0.0, t));
    const t2 = tClamped * tClamped;

    // First derivative P'(t)
    const dx1 = 0.5 * ((-p0.x + p2.x) + 2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tClamped + 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);
    const dy1 = 0.5 * ((-p0.y + p2.y) + 2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tClamped + 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);
    const dz1 = 0.5 * ((-p0.z + p2.z) + 2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * tClamped + 3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t2);

    // Second derivative P''(t)
    const dx2 = 0.5 * (2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) + 6 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * tClamped);
    const dy2 = 0.5 * (2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) + 6 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * tClamped);
    const dz2 = 0.5 * (2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) + 6 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * tClamped);

    // Cross product P'(t) x P''(t)
    const cx = dy1 * dz2 - dz1 * dy2;
    const cy = dz1 * dx2 - dx1 * dz2;
    const cz = dx1 * dy2 - dy1 * dx2;

    const crossMag = Math.sqrt(cx * cx + cy * cy + cz * cz);
    const speed = Math.sqrt(dx1 * dx1 + dy1 * dy1 + dz1 * dz1);

    if (speed < 1e-5) return 0;
    return crossMag / (speed * speed * speed);
  }

  public computeFrameBasis(
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    p3: Vector3D,
    t: number,
    trackWidth: number = 8.0
  ): TrackFrameBasis {
    const pos = this.evaluatePoint(p0, p1, p2, p3, t);
    const tangent = this.evaluateTangent(p0, p1, p2, p3, t);
    const curvature = this.evaluateCurvature(p0, p1, p2, p3, t);

    // Reference up vector [0, 1, 0]
    let upX = 0;
    let upY = 1;
    let upZ = 0;

    // Handle parallel edge case with tangent
    if (Math.abs(tangent.y) > 0.99) {
      upX = 0;
      upY = 0;
      upZ = 1;
    }

    // Binormal = Tangent x Up
    let bx = tangent.y * upZ - tangent.z * upY;
    let by = tangent.z * upX - tangent.x * upZ;
    let bz = tangent.x * upY - tangent.y * upX;
    const bLen = Math.sqrt(bx * bx + by * by + bz * bz);
    bx /= bLen;
    by /= bLen;
    bz /= bLen;

    // Normal = Binormal x Tangent
    const nx = by * tangent.z - bz * tangent.y;
    const ny = bz * tangent.x - bx * tangent.z;
    const nz = bx * tangent.y - by * tangent.x;

    return {
      position: pos,
      tangent,
      normal: { x: nx, y: ny, z: nz },
      binormal: { x: bx, y: by, z: bz },
      curvature,
      width: trackWidth,
    };
  }
}
