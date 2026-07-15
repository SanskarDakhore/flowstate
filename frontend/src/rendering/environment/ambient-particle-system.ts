import {
  Scene,
  ParticleSystem,
  Vector3,
  Color4,
  Texture,
} from '@babylonjs/core';
import {
  LIVING_VALLEY_CONFIG,
  DORMANT_VALLEY_PALETTE,
} from './living-valley-config';

/**
 * Layer 5 — Ambient Particle System.
 * Lightweight GPU/CPU particle system emitting soft drifting pollen spores along the visual volume.
 */
export class AmbientParticleSystem {
  private scene: Scene;
  private particleSystem: ParticleSystem | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public initParticleSystem(): void {
    this.dispose();

    const config = LIVING_VALLEY_CONFIG.particles;
    this.particleSystem = new ParticleSystem('ambientSpores', config.maxParticles, this.scene);

    // Subtle procedurally generated particle texture fallback
    const sporeColor = DORMANT_VALLEY_PALETTE.sporeParticle;
    this.particleSystem.color1 = new Color4(sporeColor.r, sporeColor.g, sporeColor.b, 0.6);
    this.particleSystem.color2 = new Color4(sporeColor.r, sporeColor.g, sporeColor.b, 0.2);
    this.particleSystem.colorDead = new Color4(sporeColor.r, sporeColor.g, sporeColor.b, 0.0);

    this.particleSystem.minSize = config.minSize;
    this.particleSystem.maxSize = config.maxSize;

    this.particleSystem.minLifeTime = 3.5;
    this.particleSystem.maxLifeTime = 6.0;

    this.particleSystem.emitRate = config.emissionRate;

    // Soft upward and forward drift
    this.particleSystem.direction1 = new Vector3(-1.0, 0.8, 1.5);
    this.particleSystem.direction2 = new Vector3(1.0, 1.4, 3.0);

    this.particleSystem.minEmitPower = 0.5;
    this.particleSystem.maxEmitPower = 1.5;
    this.particleSystem.updateSpeed = 0.008;

    // Emission volume wrapping the primary valley section
    this.particleSystem.minEmitBox = new Vector3(-35, -2, 0);
    this.particleSystem.maxEmitBox = new Vector3(35, 12, 600);

    this.particleSystem.start();
  }

  public updateCenter(playerPosition: { x: number; y: number; z: number }): void {
    if (!this.particleSystem) return;
    // Shift particle emission volume ahead of the player position
    this.particleSystem.minEmitBox.set(playerPosition.x - 30, playerPosition.y - 4, playerPosition.z - 10);
    this.particleSystem.maxEmitBox.set(playerPosition.x + 30, playerPosition.y + 16, playerPosition.z + 120);
  }

  public dispose(): void {
    if (this.particleSystem) {
      this.particleSystem.stop();
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
  }
}
