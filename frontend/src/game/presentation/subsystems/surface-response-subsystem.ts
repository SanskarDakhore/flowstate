import {
  SurfaceResponseConfig,
  SurfaceMaterial,
  EnvironmentResponsePriority,
  EnvironmentResponseInstance,
} from '../environment-profile';
import { Vector3State } from '../../movement/movement-types';

export interface SurfaceDebrisInstance extends EnvironmentResponseInstance {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  scale: number;
  opacity: number;
  material: SurfaceMaterial;
}

export class SurfaceResponseSubsystem {
  private config: SurfaceResponseConfig;
  private readonly pool: SurfaceDebrisInstance[] = [];
  private activeCount: number = 0;
  private peakUsageCount: number = 0;

  constructor(config: SurfaceResponseConfig) {
    this.config = config;
    this.initPool(config.maxPooledDebrisInstances);
  }

  private initPool(capacity: number): void {
    this.pool.length = 0;
    for (let i = 0; i < capacity; i++) {
      this.pool.push({
        active: false,
        id: i,
        age: 0,
        duration: 1.0,
        normalizedLife: 0,
        priority: EnvironmentResponsePriority.Normal,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        scale: 1.0,
        opacity: 0,
        material: this.config.defaultSurfaceMaterial,
      });
    }
    this.activeCount = 0;
    this.peakUsageCount = 0;
  }

  public setConfig(config: SurfaceResponseConfig): void {
    this.config = config;
    if (this.pool.length !== config.maxPooledDebrisInstances) {
      this.initPool(config.maxPooledDebrisInstances);
    }
  }

  public triggerSurfaceResponse(
    position: Vector3State,
    velocity: Vector3State,
    surfaceMaterial?: SurfaceMaterial,
    overrideProbability?: number,
    priority: EnvironmentResponsePriority = EnvironmentResponsePriority.Normal,
    intensityScalar: number = 1.0
  ): boolean {
    const prob = (overrideProbability ?? this.config.emissionProbability) * intensityScalar;
    if (Math.random() > prob) return false;

    for (let i = 0; i < this.pool.length; i++) {
      const instance = this.pool[i];
      if (!instance.active) {
        instance.active = true;
        instance.age = 0;
        instance.duration = 0.4 + Math.random() * 0.4;
        instance.normalizedLife = 0;
        instance.priority = priority;

        instance.position.x = position.x + (Math.random() - 0.5) * this.config.activeResponseRadius * 0.5;
        instance.position.y = position.y + 0.1;
        instance.position.z = position.z + (Math.random() - 0.5) * this.config.activeResponseRadius * 0.5;

        const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
        const dispersion = Math.max(0.5, speed * 0.1) * intensityScalar;

        instance.velocity.x = (Math.random() - 0.5) * dispersion;
        instance.velocity.y = (0.4 + Math.random() * 0.6) * intensityScalar;
        instance.velocity.z = (Math.random() - 0.5) * dispersion;

        instance.scale = (0.4 + Math.random() * 0.4) * intensityScalar;
        instance.opacity = 1.0;
        instance.material = surfaceMaterial ?? this.config.defaultSurfaceMaterial;

        this.activeCount++;
        if (this.activeCount > this.peakUsageCount) {
          this.peakUsageCount = this.activeCount;
        }
        return true;
      }
    }
    return false;
  }

  public update(deltaTimeSeconds: number): void {
    if (this.activeCount === 0) return;

    for (let i = 0; i < this.pool.length; i++) {
      const inst = this.pool[i];
      if (!inst.active) continue;

      inst.age += deltaTimeSeconds;
      inst.normalizedLife = Math.min(1.0, inst.age / inst.duration);

      if (inst.normalizedLife >= 1.0) {
        inst.active = false;
        inst.opacity = 0;
        this.activeCount = Math.max(0, this.activeCount - 1);
        continue;
      }

      // Physics motion
      inst.position.x += inst.velocity.x * deltaTimeSeconds;
      inst.position.y += inst.velocity.y * deltaTimeSeconds;
      inst.position.z += inst.velocity.z * deltaTimeSeconds;

      inst.velocity.y -= 2.5 * deltaTimeSeconds;
      inst.velocity.x *= 0.95;
      inst.velocity.z *= 0.95;

      // Smooth decay
      inst.opacity = 1.0 - inst.normalizedLife;
    }
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  public getInactiveCount(): number {
    return this.pool.length - this.activeCount;
  }

  public getPoolFreeCount(): number {
    return this.getInactiveCount();
  }

  public getPoolCapacity(): number {
    return this.pool.length;
  }

  public getPeakUsageCount(): number {
    return this.peakUsageCount;
  }

  public reset(): void {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].active = false;
      this.pool[i].opacity = 0;
      this.pool[i].age = 0;
      this.pool[i].normalizedLife = 0;
    }
    this.activeCount = 0;
    this.peakUsageCount = 0;
  }
}
