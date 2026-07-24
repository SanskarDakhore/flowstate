import {
  FoliageInstanceData,
  FoliageMeshConfig,
  InstancedFoliageMetrics,
  Vector3D,
  WindSwayUniforms,
} from '@flowstate/shared';

export const DEFAULT_FOLIAGE_CONFIG: FoliageMeshConfig = {
  maxInstances: 1000,
  defaultBladeHeight: 1.2,
  bendRadius: 2.5,
};

export class InstancedFoliageRenderer {
  private config: FoliageMeshConfig;
  private activeCount: number = 0;
  private bentCount: number = 0;

  // Pre-allocated Float32Arrays for zero-allocation rendering
  private instanceBuffer: Float32Array; // 16 floats per 4x4 matrix * maxInstances
  private positions: Float32Array;      // 3 floats (X,Y,Z) per instance
  private displacements: Float32Array;  // 3 floats (dX,dY,dZ) per instance

  constructor(config: FoliageMeshConfig = DEFAULT_FOLIAGE_CONFIG) {
    this.config = config;
    this.instanceBuffer = new Float32Array(config.maxInstances * 16);
    this.positions = new Float32Array(config.maxInstances * 3);
    this.displacements = new Float32Array(config.maxInstances * 3);
  }

  public addInstance(position: Vector3D, rotationY: number = 0.0, scale: number = 1.0): boolean {
    if (this.activeCount >= this.config.maxInstances) return false;

    const idx = this.activeCount;
    const posIdx = idx * 3;
    const matIdx = idx * 16;

    this.positions[posIdx] = position.x;
    this.positions[posIdx + 1] = position.y;
    this.positions[posIdx + 2] = position.z;

    // Pack 4x4 affine transform matrix into instance buffer
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    this.instanceBuffer[matIdx] = cosY * scale;
    this.instanceBuffer[matIdx + 1] = 0.0;
    this.instanceBuffer[matIdx + 2] = -sinY * scale;
    this.instanceBuffer[matIdx + 3] = 0.0;

    this.instanceBuffer[matIdx + 4] = 0.0;
    this.instanceBuffer[matIdx + 5] = scale;
    this.instanceBuffer[matIdx + 6] = 0.0;
    this.instanceBuffer[matIdx + 7] = 0.0;

    this.instanceBuffer[matIdx + 8] = sinY * scale;
    this.instanceBuffer[matIdx + 9] = 0.0;
    this.instanceBuffer[matIdx + 10] = cosY * scale;
    this.instanceBuffer[matIdx + 11] = 0.0;

    this.instanceBuffer[matIdx + 12] = position.x;
    this.instanceBuffer[matIdx + 13] = position.y;
    this.instanceBuffer[matIdx + 14] = position.z;
    this.instanceBuffer[matIdx + 15] = 1.0;

    this.activeCount++;
    return true;
  }

  public updateWindAndSphereInteractions(
    wind: WindSwayUniforms,
    spherePos: Vector3D,
    sphereRadius: number = 0.5
  ): void {
    const totalBendRadius = this.config.bendRadius + sphereRadius;
    this.bentCount = 0;

    for (let i = 0; i < this.activeCount; i++) {
      const posIdx = i * 3;
      const posX = this.positions[posIdx];
      const posY = this.positions[posIdx + 1];
      const posZ = this.positions[posIdx + 2];

      // Procedural harmonic wind sway displacement
      const windPhase = posX * 0.1 + posZ * 0.1;
      const swayOffset = Math.sin(wind.windTime * wind.windFrequency + windPhase) * wind.windStrength * 0.3;

      // Sphere distance evaluation
      const dx = posX - spherePos.x;
      const dy = posY - spherePos.y;
      const dz = posZ - spherePos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      let bendX = 0.0;
      let bendZ = 0.0;

      if (dist < totalBendRadius && dist > 0.001) {
        const factor = (totalBendRadius - dist) / totalBendRadius;
        bendX = (dx / dist) * factor * 1.5;
        bendZ = (dz / dist) * factor * 1.5;
        this.bentCount++;
      }

      this.displacements[posIdx] = swayOffset + bendX;
      this.displacements[posIdx + 1] = 0.0;
      this.displacements[posIdx + 2] = swayOffset * 0.5 + bendZ;
    }
  }

  public getMetrics(): InstancedFoliageMetrics {
    return {
      activeInstanceCount: this.activeCount,
      maxCapacity: this.config.maxInstances,
      bentInstancesCount: this.bentCount,
      bufferByteLength: this.instanceBuffer.byteLength + this.positions.byteLength + this.displacements.byteLength,
    };
  }
}
