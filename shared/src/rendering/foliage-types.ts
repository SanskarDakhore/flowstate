import { Vector3D } from '../track/track-types';

export interface FoliageMeshConfig {
  readonly maxInstances: number;     // Default 1,000
  readonly defaultBladeHeight: number;// Default 1.2m
  readonly bendRadius: number;       // Default 2.5m (sphere proximity bend)
}

export interface FoliageInstanceData {
  readonly instanceId: string;
  readonly position: Vector3D;
  readonly rotationY: number;
  readonly scale: number;
  readonly densityWeight: number;
}

export interface WindSwayUniforms {
  readonly windTime: number;
  readonly windStrength: number;
  readonly windFrequency: number;
}

export interface InstancedFoliageMetrics {
  readonly activeInstanceCount: number;
  readonly maxCapacity: number;
  readonly bentInstancesCount: number;
  readonly bufferByteLength: number;
}
