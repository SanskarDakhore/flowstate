import {
  KineticSplashConfig,
  ParticleEmitterState,
  Vector3D,
  VFXBurstResult,
} from '@flowstate/shared';

export const DEFAULT_VFX_CONFIG: KineticSplashConfig = {
  maxParticles: 1000,
  baseParticleLifeMs: 500,
  sparkSpeedScalar: 1.5,
  wallImpactThreshold: 5.0,
};

export class KineticSplashEngine {
  private config: KineticSplashConfig;
  private maxParticles: number;
  private activeCount: number = 0;
  private totalBursts: number = 0;

  // Pre-allocated TypedArray buffers for zero heap allocation
  private positions: Float32Array;
  private velocities: Float32Array;
  private lifetimes: Float32Array; // [remainingMs, initialMs] per particle
  private colors: Float32Array;    // [R, G, B] per particle

  constructor(config: KineticSplashConfig = DEFAULT_VFX_CONFIG) {
    this.config = config;
    this.maxParticles = config.maxParticles;

    this.positions = new Float32Array(this.maxParticles * 3);
    this.velocities = new Float32Array(this.maxParticles * 3);
    this.lifetimes = new Float32Array(this.maxParticles * 2);
    this.colors = new Float32Array(this.maxParticles * 3);
  }

  public emitGroundRollTrail(playerPosition: Vector3D, playerVelocity: Vector3D): VFXBurstResult {
    const speed = Math.sqrt(
      playerVelocity.x * playerVelocity.x +
        playerVelocity.y * playerVelocity.y +
        playerVelocity.z * playerVelocity.z
    );

    if (speed < 2.0) {
      return { burstType: 'GROUND_TRAIL', spawnedParticleCount: 0, impactIntensity: 0 };
    }

    const particlesToSpawn = 2;
    let spawned = 0;

    for (let i = 0; i < particlesToSpawn; i++) {
      if (this.activeCount >= this.maxParticles) break;

      const idx = this.activeCount;
      const posIdx = idx * 3;
      const lifeIdx = idx * 2;

      this.positions[posIdx] = playerPosition.x + (Math.random() - 0.5) * 0.4;
      this.positions[posIdx + 1] = playerPosition.y - 0.5; // Surface contact point
      this.positions[posIdx + 2] = playerPosition.z + (Math.random() - 0.5) * 0.4;

      // Reverse trailing spark velocity
      this.velocities[posIdx] = -playerVelocity.x * 0.2 + (Math.random() - 0.5) * 2.0;
      this.velocities[posIdx + 1] = Math.random() * 2.0 + 1.0;
      this.velocities[posIdx + 2] = -playerVelocity.z * 0.2 + (Math.random() - 0.5) * 2.0;

      this.lifetimes[lifeIdx] = this.config.baseParticleLifeMs;
      this.lifetimes[lifeIdx + 1] = this.config.baseParticleLifeMs;

      // Cyan kinetic trail color (0.2, 0.75, 1.0)
      this.colors[posIdx] = 0.2;
      this.colors[posIdx + 1] = 0.75;
      this.colors[posIdx + 2] = 1.0;

      this.activeCount++;
      spawned++;
    }

    return { burstType: 'GROUND_TRAIL', spawnedParticleCount: spawned, impactIntensity: speed };
  }

  public triggerWallSplash(
    contactPosition: Vector3D,
    contactNormal: Vector3D,
    impactForce: number
  ): VFXBurstResult {
    if (impactForce < this.config.wallImpactThreshold) {
      return { burstType: 'WALL_SPLASH', spawnedParticleCount: 0, impactIntensity: impactForce };
    }

    const countToSpawn = Math.min(100, Math.max(10, Math.floor(impactForce * 4.0)));
    let spawned = 0;

    for (let i = 0; i < countToSpawn; i++) {
      if (this.activeCount >= this.maxParticles) break;

      const idx = this.activeCount;
      const posIdx = idx * 3;
      const lifeIdx = idx * 2;

      this.positions[posIdx] = contactPosition.x;
      this.positions[posIdx + 1] = contactPosition.y;
      this.positions[posIdx + 2] = contactPosition.z;

      // Radial splash along contact normal + random tangent spread
      const sparkSpeed = impactForce * this.config.sparkSpeedScalar;
      this.velocities[posIdx] = contactNormal.x * sparkSpeed + (Math.random() - 0.5) * sparkSpeed;
      this.velocities[posIdx + 1] = contactNormal.y * sparkSpeed + Math.random() * sparkSpeed;
      this.velocities[posIdx + 2] = contactNormal.z * sparkSpeed + (Math.random() - 0.5) * sparkSpeed;

      const life = this.config.baseParticleLifeMs * (0.8 + Math.random() * 0.6);
      this.lifetimes[lifeIdx] = life;
      this.lifetimes[lifeIdx + 1] = life;

      // Champagne solar spark color (1.0, 0.9, 0.5)
      this.colors[posIdx] = 1.0;
      this.colors[posIdx + 1] = 0.9;
      this.colors[posIdx + 2] = 0.5;

      this.activeCount++;
      spawned++;
    }

    this.totalBursts++;
    return { burstType: 'WALL_SPLASH', spawnedParticleCount: spawned, impactIntensity: impactForce };
  }

  public triggerRingEruption(ringCenter: Vector3D, ringNormal: Vector3D): VFXBurstResult {
    const countToSpawn = 40;
    let spawned = 0;

    for (let i = 0; i < countToSpawn; i++) {
      if (this.activeCount >= this.maxParticles) break;

      const idx = this.activeCount;
      const posIdx = idx * 3;
      const lifeIdx = idx * 2;

      const angle = (i / countToSpawn) * Math.PI * 2;
      const radius = 3.0;

      this.positions[posIdx] = ringCenter.x + Math.cos(angle) * radius;
      this.positions[posIdx + 1] = ringCenter.y + Math.sin(angle) * radius;
      this.positions[posIdx + 2] = ringCenter.z;

      this.velocities[posIdx] = Math.cos(angle) * 8.0;
      this.velocities[posIdx + 1] = Math.sin(angle) * 8.0;
      this.velocities[posIdx + 2] = ringNormal.z * 12.0;

      const life = 600.0;
      this.lifetimes[lifeIdx] = life;
      this.lifetimes[lifeIdx + 1] = life;

      // Mint kinetic color (0.4, 0.9, 0.7)
      this.colors[posIdx] = 0.4;
      this.colors[posIdx + 1] = 0.9;
      this.colors[posIdx + 2] = 0.7;

      this.activeCount++;
      spawned++;
    }

    this.totalBursts++;
    return { burstType: 'RING_ERUPTION', spawnedParticleCount: spawned, impactIntensity: 15.0 };
  }

  public stepSimulation(deltaTimeSeconds: number = 0.016): void {
    const deltaMs = deltaTimeSeconds * 1000.0;
    let writeIdx = 0;

    for (let readIdx = 0; readIdx < this.activeCount; readIdx++) {
      const lifeIdx = readIdx * 2;
      const remainingLife = this.lifetimes[lifeIdx] - deltaMs;

      if (remainingLife > 0) {
        const readPos = readIdx * 3;
        const writePos = writeIdx * 3;
        const writeLife = writeIdx * 2;

        // Position update: P = P + V * dt
        this.positions[writePos] = this.positions[readPos] + this.velocities[readPos] * deltaTimeSeconds;
        this.positions[writePos + 1] = this.positions[readPos + 1] + this.velocities[readPos + 1] * deltaTimeSeconds;
        this.positions[writePos + 2] = this.positions[readPos + 2] + this.velocities[readPos + 2] * deltaTimeSeconds;

        // Velocity damping & gravity
        this.velocities[writePos] = this.velocities[readPos] * 0.95;
        this.velocities[writePos + 1] = (this.velocities[readPos + 1] - 4.0 * deltaTimeSeconds) * 0.95;
        this.velocities[writePos + 2] = this.velocities[readPos + 2] * 0.95;

        this.lifetimes[writeLife] = remainingLife;
        this.lifetimes[writeLife + 1] = this.lifetimes[lifeIdx + 1];

        this.colors[writePos] = this.colors[readPos];
        this.colors[writePos + 1] = this.colors[readPos + 1];
        this.colors[writePos + 2] = this.colors[readPos + 2];

        writeIdx++;
      }
    }

    this.activeCount = writeIdx;
  }

  public getEmitterState(): ParticleEmitterState {
    return {
      activeParticleCount: this.activeCount,
      poolCapacity: this.maxParticles,
      isEmittingTrail: this.activeCount > 0,
      totalBurstsTriggered: this.totalBursts,
    };
  }
}
