export interface Vector3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface TrackSplineNode {
  readonly position: Vector3D;
  readonly width?: number;
  readonly rollAngleRad?: number;
}

export interface TrackFrameBasis {
  readonly position: Vector3D;
  readonly tangent: Vector3D;
  readonly normal: Vector3D;
  readonly binormal: Vector3D;
  readonly curvature: number;
  readonly width: number;
}

export interface TrackSlopeBankState {
  readonly centrifugalAcceleration: number; // m/s^2
  readonly idealBankAngleRad: number; // Dynamic roll angle
  readonly clampedBankAngleRad: number; // Physical constraint clamped
  readonly lateralGForce: number; // Relative side-G force
}

export interface TrackSegmentMeshBuffers {
  readonly positions: Float32Array;
  readonly normals: Float32Array;
  readonly uvs: Float32Array;
  readonly indices: Uint32Array;
  readonly vertexCount: number;
  readonly indexCount: number;
}
