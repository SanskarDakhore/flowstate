import { VegetationEcosystemConfig } from '../environment-profile';
import { Vector3State } from '../../movement/movement-types';

export interface VegetationDeformationSample {
  displacement: { x: number; y: number; z: number };
  vibrationScale: number;
}

export class VegetationProximitySubsystem {
  private config: VegetationEcosystemConfig;
  private activeUniformBindingsCount: number = 0;

  // Pre-allocated reusable object to eliminate per-frame GC allocations
  private readonly sampleResult: VegetationDeformationSample = {
    displacement: { x: 0, y: 0, z: 0 },
    vibrationScale: 0,
  };

  constructor(config: VegetationEcosystemConfig) {
    this.config = config;
  }

  public setConfig(config: VegetationEcosystemConfig): void {
    this.config = config;
  }

  /**
   * Evaluates proximity vertex displacement formula for a target vertex/node position:
   * r_vec = P_vertex - P_player
   * displacement = r_hat * maxBendingAngle * max(0, 1 - ||r|| / influenceRadius)^2 * heightFraction
   */
  public evaluateDisplacement(
    vertexPos: Vector3State,
    playerPos: Vector3State,
    heightFraction: number = 1.0
  ): VegetationDeformationSample {
    const rx = vertexPos.x - playerPos.x;
    const ry = vertexPos.y - playerPos.y;
    const rz = vertexPos.z - playerPos.z;

    const distance = Math.sqrt(rx * rx + ry * ry + rz * rz);
    const radius = Math.max(0.001, this.config.environmentInfluenceRadius);

    if (distance >= radius || distance <= 0.0001) {
      this.sampleResult.displacement.x = 0;
      this.sampleResult.displacement.y = 0;
      this.sampleResult.displacement.z = 0;
      this.sampleResult.vibrationScale = 0;
      return this.sampleResult;
    }

    const normX = rx / distance;
    const normY = ry / distance;
    const normZ = rz / distance;

    const attenuation = Math.pow(1 - distance / radius, 2);
    const clampedHeight = Math.max(0, Math.min(1, heightFraction));
    const bendScalar = this.config.maxBendingAngle * attenuation * clampedHeight;

    this.sampleResult.displacement.x = normX * bendScalar;
    this.sampleResult.displacement.y = normY * bendScalar * 0.2; // Minor vertical deflection
    this.sampleResult.displacement.z = normZ * bendScalar;

    // High frequency flower vibration scale inside active influence radius
    this.sampleResult.vibrationScale = attenuation * this.config.detailedPetalVibrationScale;

    return this.sampleResult;
  }

  public updateUniformBindings(activeCount: number): void {
    this.activeUniformBindingsCount = activeCount;
  }

  public getActiveUniformBindingsCount(): number {
    return this.activeUniformBindingsCount;
  }

  public reset(): void {
    this.activeUniformBindingsCount = 0;
  }
}
