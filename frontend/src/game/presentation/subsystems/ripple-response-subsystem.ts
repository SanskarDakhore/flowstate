import {
  WaterEcosystemConfig,
  EnvironmentResponsePriority,
  EnvironmentResponseInstance,
} from '../environment-profile';
import { Vector3State } from '../../movement/movement-types';

export interface RippleDecalInstance extends EnvironmentResponseInstance {
  center: { x: number; y: number; z: number };
  currentRadius: number;
  maxRadius: number;
  amplitude: number;
  opacity: number;
}

export class RippleResponseSubsystem {
  private config: WaterEcosystemConfig;
  private readonly ringPool: RippleDecalInstance[] = [];
  private activeCount: number = 0;

  constructor(config: WaterEcosystemConfig, capacity: number = 16) {
    this.config = config;
    this.initPool(capacity);
  }

  private initPool(capacity: number): void {
    this.ringPool.length = 0;
    for (let i = 0; i < capacity; i++) {
      this.ringPool.push({
        active: false,
        id: i,
        age: 0,
        duration: 1.5,
        normalizedLife: 0,
        priority: EnvironmentResponsePriority.Normal,
        center: { x: 0, y: 0, z: 0 },
        currentRadius: 0.1,
        maxRadius: 3.0,
        amplitude: 1.0,
        opacity: 0,
      });
    }
    this.activeCount = 0;
  }

  public setConfig(config: WaterEcosystemConfig): void {
    this.config = config;
  }

  public triggerImpactRipple(
    position: Vector3State,
    verticalImpactVelocity: number,
    intensityScalar: number = 1.0,
    priority: EnvironmentResponsePriority = EnvironmentResponsePriority.Normal
  ): boolean {
    const impactScale = Math.min(3.0, (Math.abs(verticalImpactVelocity) * this.config.dynamicAmplitudeScalar + 0.5) * intensityScalar);

    for (let i = 0; i < this.ringPool.length; i++) {
      const ring = this.ringPool[i];
      if (!ring.active) {
        ring.active = true;
        ring.age = 0;
        ring.duration = 1.0 + impactScale * 0.4;
        ring.normalizedLife = 0;
        ring.priority = priority;

        ring.center.x = position.x;
        ring.center.y = position.y;
        ring.center.z = position.z;
        ring.currentRadius = 0.2;
        ring.maxRadius = 1.5 + impactScale * 1.2;
        ring.amplitude = impactScale;
        ring.opacity = 1.0;

        this.activeCount++;
        return true;
      }
    }
    return false;
  }

  public update(deltaTimeSeconds: number): void {
    if (this.activeCount === 0) return;

    for (let i = 0; i < this.ringPool.length; i++) {
      const ring = this.ringPool[i];
      if (!ring.active) continue;

      ring.age += deltaTimeSeconds;
      ring.normalizedLife = Math.min(1.0, ring.age / ring.duration);

      if (ring.normalizedLife >= 1.0) {
        ring.active = false;
        ring.opacity = 0;
        this.activeCount = Math.max(0, this.activeCount - 1);
        continue;
      }

      // Radius expansion outward
      ring.currentRadius = 0.2 + (ring.maxRadius - 0.2) * Math.pow(ring.normalizedLife, 0.7);

      // Smooth exponential decay curve for opacity
      const decayLambda = 3.0;
      ring.opacity = Math.exp(-decayLambda * ring.normalizedLife) * ring.amplitude;
    }
  }

  public getActiveRipplesCount(): number {
    return this.activeCount;
  }

  public getPoolCapacity(): number {
    return this.ringPool.length;
  }

  public reset(): void {
    for (let i = 0; i < this.ringPool.length; i++) {
      this.ringPool[i].active = false;
      this.ringPool[i].opacity = 0;
      this.ringPool[i].age = 0;
      this.ringPool[i].normalizedLife = 0;
    }
    this.activeCount = 0;
  }
}
