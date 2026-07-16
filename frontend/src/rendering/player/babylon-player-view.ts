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
import { GOLDEN_HOUR_VALLEY_PALETTE } from '../environment/living-valley-config';
import { PlayerExpressionController } from '../../game/player/player-expression-controller';
import { MovementState, JumpState, GravityPhase, getMomentumQuality } from '../../game/movement/movement-types';
import { MovementEventDispatcher } from '../../game/movement/movement-events';

export class BabylonPlayerView implements PlayerView {
  private containerNode: Mesh;
  private coreMesh: Mesh;
  private shellMesh: Mesh;
  private haloMesh: Mesh;
  private coreMaterial: StandardMaterial;
  private shellMaterial: StandardMaterial;
  private haloMaterial: StandardMaterial;
  private particleSystem: ParticleSystem | null = null;
  private scene: Scene;

  private expressionController: PlayerExpressionController;

  private flareTimer: number = 0;
  private boundaryDisruptionTimer: number = 0;
  private lastObservedJumpCounter: number = 0;
  private activeEnergyRings: Array<{ mesh: Mesh; material: StandardMaterial; timer: number }> = [];

  constructor(scene: Scene, dispatcher: MovementEventDispatcher | null = null) {
    this.scene = scene;
    this.expressionController = new PlayerExpressionController(undefined, dispatcher);

    // 1. Root Container Node (Handles spatial translation and orientation)
    this.containerNode = new Mesh('playerRootNode', scene);
    this.containerNode.position = new Vector3(0, 0.45, 0);

    // 2. Inner Luminous Core Node (Crisp, high-value visual anchor, diameter 0.45)
    this.coreMesh = MeshBuilder.CreateSphere('playerCoreMesh', { diameter: 0.45, segments: 16 }, scene);
    this.coreMaterial = new StandardMaterial('playerCoreMat', scene);
    this.coreMaterial.diffuseColor = new Color3(0.8, 0.95, 1.0);
    this.coreMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.playerCore.clone();
    this.coreMaterial.specularColor = new Color3(1.0, 1.0, 1.0);
    this.coreMesh.material = this.coreMaterial;
    this.coreMesh.parent = this.containerNode;

    // 3. Outer Resonance Shell (Elongated Droplet/Seed Form: 0.7 x 0.7 x 0.95)
    this.shellMesh = MeshBuilder.CreateSphere('playerShellMesh', { diameterX: 0.7, diameterY: 0.7, diameterZ: 0.95, segments: 20 }, scene);
    this.shellMaterial = PlayerMaterialFactory.createPlayerMaterial('playerShellMat', scene);
    this.shellMaterial.alpha = 0.85;
    this.shellMesh.material = this.shellMaterial;
    this.shellMesh.parent = this.containerNode;

    // 4. Outer Emissive Reactive Halo Mesh (Scale 1.35)
    this.haloMesh = MeshBuilder.CreateSphere('playerHaloMesh', { diameter: 1.35, segments: 16 }, scene);
    this.haloMesh.parent = this.containerNode;

    this.haloMaterial = new StandardMaterial('playerHaloMat', scene);
    this.haloMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.bioluminescence.clone();
    this.haloMaterial.alpha = 0.22;
    this.haloMaterial.backFaceCulling = false;
    this.haloMesh.material = this.haloMaterial;

    // 5. Particle Speed Trail System
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

  public getExpressionController(): PlayerExpressionController {
    return this.expressionController;
  }

  public updateVisuals(
    speed: number,
    harmony: number,
    airborneHeight: number = 0,
    verticalVelocity: number = 0,
    justLanded: boolean = false,
    jumpEventCounter: number = 0,
    lastJumpIndex: number = 0,
    deltaTimeSeconds: number = 0.016,
    movementState?: MovementState
  ): void {
    // Detect new jump events monotonically for energy ring presentation
    if (jumpEventCounter > this.lastObservedJumpCounter) {
      this.lastObservedJumpCounter = jumpEventCounter;
      if (lastJumpIndex === 1) {
        this.triggerFirstJumpVfx();
      } else if (lastJumpIndex === 2) {
        this.triggerSecondJumpVfx();
      }
    }

    // Construct or extract read-only state snapshot
    const momScore = movementState?.momentumScore ?? (harmony * 100);
    const movState: MovementState = movementState ?? {
      isGrounded: airborneHeight <= 0,
      isAirborne: airborneHeight > 0,
      isCoyoteWindowActive: false,
      isJumpBuffered: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      currentJumpCount: lastJumpIndex,
      jumpState: airborneHeight <= 0 ? JumpState.Grounded : (verticalVelocity > 0 ? JumpState.Ascending : JumpState.Descending),
      jumpId: jumpEventCounter,
      landingImpact: justLanded ? 10.0 : 0,
      verticalVelocity,
      airborneHeight,
      currentHorizontalVelocityVector: { x: 0, z: speed },
      momentumMagnitude: speed,
      momentumScore: momScore,
      momentumQuality: getMomentumQuality(momScore),
      flowEfficiency: harmony,
      activeGravityPhase: airborneHeight <= 0 ? GravityPhase.Grounded : (verticalVelocity > 0 ? GravityPhase.Ascending : GravityPhase.Descending),
      activeEnvironmentProfileId: 'terrestrial-ground',
      activeMovementProfileId: 'default-responsive',
      currentAirControl: 0.6,
      appliedGravity: -28.0,
      targetSpeed: 20.0,
      desiredVelocity: { x: 0, z: speed },
      velocityError: 0,
      directionDelta: 0,
    };

    // Passive Renderer Adapter Rule: Delegate calculation completely to expression controller
    const expressionState = this.expressionController.update(
      movState,
      { x: this.containerNode.position.x, y: this.containerNode.position.y - 0.45, z: this.containerNode.position.z },
      deltaTimeSeconds
    );

    // 1. Apply pre-computed scale transform
    const { x: scaleX, y: scaleY, z: scaleZ } = expressionState.scaleTransform;
    this.coreMesh.scaling.set(scaleX, scaleY, scaleZ);
    this.shellMesh.scaling.set(scaleX, scaleY, scaleZ);

    // 2. Apply MaterialExpression shading
    let flareBoost = 0;
    if (this.flareTimer > 0) {
      this.flareTimer -= deltaTimeSeconds;
      flareBoost = Math.max(0, this.flareTimer / 0.35);
    }

    let disruptionWobble = 0;
    if (this.boundaryDisruptionTimer > 0) {
      this.boundaryDisruptionTimer -= deltaTimeSeconds;
      disruptionWobble = Math.sin(this.boundaryDisruptionTimer * 30.0) * 0.18;
    }

    const mat = expressionState.material;
    const pulseFactor = 0.08 * Math.sin(mat.pulsePhase * 3.0) + flareBoost * 0.25 + disruptionWobble;

    this.haloMesh.scaling.set(1.0 + pulseFactor, 1.0 + pulseFactor, 1.0 + pulseFactor);
    this.haloMaterial.alpha = Math.min(1.0, mat.glowAlpha + flareBoost * 0.35);
    this.shellMaterial.alpha = mat.surfaceOpacity;

    // 3. Apply TrailExpression to particle system
    if (this.particleSystem) {
      const trail = expressionState.trail;
      const flareParticles = Math.round(flareBoost * 120);
      this.particleSystem.emitRate = Math.round(20 + trail.opacity * 60 + harmony * 40) + flareParticles;
      this.particleSystem.minEmitPower = 1.0 + trail.intensity * 3.0 + flareBoost * 2.0;
      this.particleSystem.maxEmitPower = 2.0 + trail.intensity * 5.0 + flareBoost * 3.0;
    }

    // Update active second-jump energy rings
    this.updateEnergyRings(deltaTimeSeconds);
  }

  public triggerTargetPassFlare(): void {
    this.flareTimer = 0.35; // 350ms kinetic flare impulse
  }

  public triggerFirstJumpVfx(): void {
    this.coreMaterial.emissiveColor = new Color3(0.8, 1.0, 1.0);
    setTimeout(() => {
      if (this.coreMaterial) {
        this.coreMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.playerCore.clone();
      }
    }, 120);
  }

  private triggerSecondJumpVfx(): void {
    try {
      const innerRing = MeshBuilder.CreateTorus(
        'secondJumpRingInner',
        { diameter: 1.0, thickness: 0.12, tessellation: 24 },
        this.scene
      );
      innerRing.position = this.containerNode.position.clone();

      const innerMat = new StandardMaterial('secondJumpInnerMat', this.scene);
      innerMat.emissiveColor = new Color3(0.4, 0.95, 1.0);
      innerMat.alpha = 0.9;
      innerMat.backFaceCulling = false;
      innerRing.material = innerMat;

      this.activeEnergyRings.push({ mesh: innerRing, material: innerMat, timer: 0.22 });
    } catch (e) {
      console.warn('[BabylonPlayerView] Energy ring VFX fallback:', e);
    }
  }

  private updateEnergyRings(deltaTime: number): void {
    for (let i = this.activeEnergyRings.length - 1; i >= 0; i--) {
      const entry = this.activeEnergyRings[i];
      entry.timer -= deltaTime;
      const progress = 1.0 - Math.max(0, entry.timer / 0.22);

      const scale = 1.0 + progress * 2.2;
      entry.mesh.scaling.set(scale, 1.0, scale);
      entry.material.alpha = 0.9 * (1.0 - progress);

      if (entry.timer <= 0) {
        entry.mesh.dispose();
        this.activeEnergyRings.splice(i, 1);
      }
    }
  }

  public triggerBoundaryDisruption(): void {
    this.boundaryDisruptionTimer = 0.25; // 250ms subtle energy disruption
  }

  public setPosition(x: number, y: number, z: number): void {
    this.containerNode.position.set(x, y + 0.45, z);
  }

  public getPosition(): { x: number; y: number; z: number } {
    return { x: this.containerNode.position.x, y: this.containerNode.position.y - 0.45, z: this.containerNode.position.z };
  }

  public getMesh(): Mesh {
    return this.containerNode;
  }

  public resetVisualState(): void {
    this.lastObservedJumpCounter = 0;
    this.flareTimer = 0;
    this.boundaryDisruptionTimer = 0;
    this.coreMesh.scaling.set(1, 1, 1);
    this.shellMesh.scaling.set(1, 1, 1);
    this.activeEnergyRings.forEach((e) => e.mesh.dispose());
    this.activeEnergyRings = [];
    this.expressionController.reset();
  }

  public dispose(): void {
    this.resetVisualState();
    this.expressionController.dispose();
    if (this.particleSystem) {
      this.particleSystem.stop();
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
    this.haloMesh.dispose();
    this.shellMesh.dispose();
    this.coreMesh.dispose();
    this.containerNode.dispose();
  }
}
