import {
  Scene,
  MeshBuilder,
  Mesh,
  Vector3,
  StandardMaterial,
  Color3,
  Color4,
  ParticleSystem,
} from '@babylonjs/core';
import { PlayerView } from './player-view';
import { PlayerMaterialFactory } from '../materials/player-material';

export class BabylonPlayerView implements PlayerView {
  private coreMesh: Mesh;
  private haloMesh: Mesh;
  private haloMaterial: StandardMaterial;
  private particleSystem: ParticleSystem | null = null;
  private scene: Scene;

  private currentPulseTime: number = 0;
  private landingSquashTimer: number = 0;
  private readonly SQUASH_DURATION: number = 0.22; // 220ms visual landing sequence

  // Jump Event Consumption State
  private lastObservedJumpCounter: number = 0;
  private activeEnergyRings: Array<{ mesh: Mesh; material: StandardMaterial; timer: number }> = [];

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Core Glowing Orb Mesh (Radius 0.45, Diameter 0.9)
    this.coreMesh = MeshBuilder.CreateSphere('playerCoreMesh', { diameter: 0.9, segments: 24 }, scene);
    this.coreMesh.material = PlayerMaterialFactory.createPlayerMaterial('playerMat', scene);
    this.coreMesh.position = new Vector3(0, 0.45, 0);

    // 2. Outer Emissive Halo Mesh
    this.haloMesh = MeshBuilder.CreateSphere('playerHaloMesh', { diameter: 1.4, segments: 16 }, scene);
    this.haloMesh.parent = this.coreMesh;

    this.haloMaterial = new StandardMaterial('playerHaloMat', scene);
    this.haloMaterial.emissiveColor = new Color3(0.1, 0.7, 1.0);
    this.haloMaterial.alpha = 0.25;
    this.haloMaterial.backFaceCulling = false;
    this.haloMesh.material = this.haloMaterial;

    // 3. Particle Speed Trail System
    this.initTrailParticles();
  }

  private initTrailParticles(): void {
    try {
      this.particleSystem = new ParticleSystem('playerTrail', 200, this.scene);

      this.particleSystem.emitter = this.coreMesh;
      this.particleSystem.minEmitBox = new Vector3(-0.1, -0.1, -0.2);
      this.particleSystem.maxEmitBox = new Vector3(0.1, 0.1, 0.0);

      this.particleSystem.color1 = new Color4(0.2, 0.8, 1.0, 0.8);
      this.particleSystem.color2 = new Color4(0.5, 0.2, 0.9, 0.5);
      this.particleSystem.colorDead = new Color4(0.05, 0.05, 0.2, 0.0);

      this.particleSystem.minSize = 0.15;
      this.particleSystem.maxSize = 0.35;

      this.particleSystem.minLifeTime = 0.2;
      this.particleSystem.maxLifeTime = 0.5;

      this.particleSystem.emitRate = 40;
      this.particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE; // Additive glow blend

      this.particleSystem.gravity = new Vector3(0, 0, 0);
      this.particleSystem.direction1 = new Vector3(-0.2, -0.2, -3.0);
      this.particleSystem.direction2 = new Vector3(0.2, 0.2, -5.0);

      this.particleSystem.minEmitPower = 1.5;
      this.particleSystem.maxEmitPower = 3.0;

      this.particleSystem.start();
    } catch (e) {
      console.warn('[BabylonPlayerView] Particle trail initialization fallback:', e);
    }
  }

  public updateVisuals(
    speed: number,
    harmony: number,
    airborneHeight: number = 0,
    verticalVelocity: number = 0,
    justLanded: boolean = false,
    jumpEventCounter: number = 0,
    lastJumpIndex: number = 0,
    deltaTimeSeconds: number = 0.016
  ): void {
    this.currentPulseTime += deltaTimeSeconds * 3.0;

    // Detect new jump events monotonically
    if (jumpEventCounter > this.lastObservedJumpCounter) {
      this.lastObservedJumpCounter = jumpEventCounter;
      if (lastJumpIndex === 2) {
        this.triggerSecondJumpVfx();
      }
    }

    // Trigger visual squash animation on landing impact
    if (justLanded) {
      this.landingSquashTimer = this.SQUASH_DURATION;
    }

    // 1. Layer-3 Visual Mesh Scaling (Squash & Stretch)
    let scaleX = 1.0;
    let scaleY = 1.0;
    let scaleZ = 1.0;

    if (this.landingSquashTimer > 0) {
      this.landingSquashTimer -= deltaTimeSeconds;
      const progress = 1.0 - Math.max(0, this.landingSquashTimer / this.SQUASH_DURATION);

      if (progress < 0.4) {
        const t = progress / 0.4;
        scaleY = 1.0 - t * 0.20; // 0.80 vertical height
        scaleX = 1.0 + t * 0.14; // 1.14 horizontal width
        scaleZ = scaleX;
      } else if (progress < 0.8) {
        const t = (progress - 0.4) / 0.4;
        scaleY = 0.80 + t * 0.32; // 1.12 vertical stretch
        scaleX = 1.14 - t * 0.22; // 0.92 horizontal contraction
        scaleZ = scaleX;
      } else {
        const t = (progress - 0.8) / 0.2;
        scaleY = 1.12 - t * 0.12; // 1.00
        scaleX = 0.92 + t * 0.08; // 1.00
        scaleZ = scaleX;
      }
    } else if (airborneHeight > 0) {
      if (verticalVelocity > 3.0) {
        scaleY = 1.12;
        scaleX = 0.92;
        scaleZ = 0.94;
      } else if (verticalVelocity < -5.0) {
        scaleY = 0.92;
        scaleX = 1.05;
        scaleZ = 1.05;
      }
    }

    this.coreMesh.scaling.set(scaleX, scaleY, scaleZ);

    // Update active second-jump energy rings
    this.updateEnergyRings(deltaTimeSeconds);

    // 2. Halo breathing pulse
    const pulseFactor = 0.08 * Math.sin(this.currentPulseTime);
    this.haloMesh.scaling.set(1.0 + pulseFactor, 1.0 + pulseFactor, 1.0 + pulseFactor);
    this.haloMaterial.alpha = 0.25 + 0.1 * Math.sin(this.currentPulseTime * 1.5);

    // 3. Dynamic speed trail particle adjustment
    if (this.particleSystem) {
      const normalizedSpeed = Math.min(1.0, speed / 20.0);
      this.particleSystem.emitRate = Math.round(20 + normalizedSpeed * 80 + harmony * 40);
      this.particleSystem.minEmitPower = 1.0 + normalizedSpeed * 3.0;
      this.particleSystem.maxEmitPower = 2.0 + normalizedSpeed * 5.0;
    }
  }

  private triggerSecondJumpVfx(): void {
    try {
      // Create expanding emissive cyan energy pulse ring at player visual center
      const ringMesh = MeshBuilder.CreateTorus(
        'secondJumpRing',
        { diameter: 1.2, thickness: 0.1, tessellation: 20 },
        this.scene
      );
      ringMesh.position = this.coreMesh.position.clone();

      const ringMat = new StandardMaterial('secondJumpRingMat', this.scene);
      ringMat.emissiveColor = new Color3(0.3, 0.95, 1.0);
      ringMat.alpha = 0.8;
      ringMat.backFaceCulling = false;
      ringMesh.material = ringMat;

      this.activeEnergyRings.push({ mesh: ringMesh, material: ringMat, timer: 0.25 });
    } catch (e) {
      console.warn('[BabylonPlayerView] Energy ring VFX fallback:', e);
    }
  }

  private updateEnergyRings(deltaTime: number): void {
    for (let i = this.activeEnergyRings.length - 1; i >= 0; i--) {
      const entry = this.activeEnergyRings[i];
      entry.timer -= deltaTime;
      const progress = 1.0 - Math.max(0, entry.timer / 0.25);

      // Expand outward and fade alpha
      const scale = 1.0 + progress * 2.2;
      entry.mesh.scaling.set(scale, 1.0, scale);
      entry.material.alpha = 0.8 * (1.0 - progress);

      if (entry.timer <= 0) {
        entry.mesh.dispose();
        this.activeEnergyRings.splice(i, 1);
      }
    }
  }

  public setPosition(x: number, y: number, z: number): void {
    this.coreMesh.position.set(x, y, z);
  }

  public getPosition(): { x: number; y: number; z: number } {
    return { x: this.coreMesh.position.x, y: this.coreMesh.position.y, z: this.coreMesh.position.z };
  }

  public getMesh(): Mesh {
    return this.coreMesh;
  }

  public resetVisualState(): void {
    this.lastObservedJumpCounter = 0;
    this.landingSquashTimer = 0;
    this.coreMesh.scaling.set(1, 1, 1);
    this.activeEnergyRings.forEach((e) => e.mesh.dispose());
    this.activeEnergyRings = [];
  }

  public dispose(): void {
    this.resetVisualState();
    if (this.particleSystem) {
      this.particleSystem.stop();
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
    this.haloMesh.dispose();
    this.coreMesh.dispose(false, true);
  }
}
