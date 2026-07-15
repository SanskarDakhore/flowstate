import {
  Scene,
  Engine,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  GlowLayer,
  DefaultRenderingPipeline,
  Vector3,
  Quaternion,
  LinesMesh,
} from '@babylonjs/core';
import { BabylonPlayerView } from '../player/babylon-player-view';
import { EnvironmentView } from '../environment/environment-view';
import { GameplayCamera } from '../camera/gameplay-camera';
import { GameplayLighting } from '../lighting/gameplay-lighting';
import {
  PrototypeTargetDefinition,
  PrototypeTargetState,
  resolveTargetTransform,
} from '../../game/prototype/prototype-target';
import { FlowPath } from '../../game/movement/flow-path';
import { PlayerState } from '../../game/movement/movement-types';
import { GroundShadowHelper } from '../environment/ground-shadow-helper';

export class GameplayScene {
  public readonly babylonScene: Scene;
  public readonly camera: GameplayCamera;
  public readonly lighting: GameplayLighting;
  public readonly playerView: BabylonPlayerView;
  public readonly environmentView: EnvironmentView;

  private glowLayer: GlowLayer | null = null;
  private renderingPipeline: DefaultRenderingPipeline | null = null;
  private playerGroundShadow: GroundShadowHelper;

  private targetMeshes: Map<string, Mesh> = new Map();
  private targetDefinitions: PrototypeTargetDefinition[] = [];
  private activeTargetPulses: Array<{ mesh: Mesh; material: StandardMaterial; timer: number }> = [];
  // F2 Track Debug Mode
  private debugModeActive: boolean = false;
  private debugLineMeshes: LinesMesh[] = [];
  private activePath: FlowPath | null = null;

  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.babylonScene = new Scene(engine);
    this.lighting = new GameplayLighting(this.babylonScene);
    this.camera = new GameplayCamera(this.babylonScene, canvas);
    this.playerView = new BabylonPlayerView(this.babylonScene);
    this.environmentView = new EnvironmentView(this.babylonScene, this.lighting);
    this.playerGroundShadow = new GroundShadowHelper(this.babylonScene, 'playerGroundShadow', 1.8);

    this.initPostProcessingPipeline();
    this.initTargetMaterials();
    this.setupDebugHotkey();
  }

  private setupDebugHotkey(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e) => {
      if (e.code === 'F2') {
        e.preventDefault();
        this.toggleTrackDebugMode();
      }
    });
  }

  public toggleTrackDebugMode(): void {
    this.debugModeActive = !this.debugModeActive;
    if (!this.debugModeActive) {
      this.clearDebugVisuals();
    } else if (this.activePath) {
      this.rebuildDebugVisuals(this.activePath);
    }
  }

  private clearDebugVisuals(): void {
    this.debugLineMeshes.forEach((mesh) => mesh.dispose());
    this.debugLineMeshes = [];
  }

  public rebuildDebugVisuals(path: FlowPath): void {
    this.activePath = path;
    this.clearDebugVisuals();

    if (!this.debugModeActive) return;

    // 1. Draw RGB TrackFrame Vector Gizmos along the path
    const samples = 24;
    for (let i = 0; i <= samples; i++) {
      const progress = i / samples;
      const frame = path.getTrackFrame(progress);
      const c = new Vector3(frame.center.x, frame.center.y, frame.center.z);

      // Red = Right
      const rightEnd = c.add(new Vector3(frame.right.x, frame.right.y, frame.right.z).scale(1.8));
      const rightLine = MeshBuilder.CreateLines(`debug_right_${i}`, { points: [c, rightEnd] }, this.babylonScene);
      rightLine.color = new Color3(1, 0, 0);

      // Green = Up
      const upEnd = c.add(new Vector3(frame.up.x, frame.up.y, frame.up.z).scale(1.8));
      const upLine = MeshBuilder.CreateLines(`debug_up_${i}`, { points: [c, upEnd] }, this.babylonScene);
      upLine.color = new Color3(0, 1, 0);

      // Blue = Forward
      const fwdEnd = c.add(new Vector3(frame.forward.x, frame.forward.y, frame.forward.z).scale(1.8));
      const fwdLine = MeshBuilder.CreateLines(`debug_fwd_${i}`, { points: [c, fwdEnd] }, this.babylonScene);
      fwdLine.color = new Color3(0, 0, 1);

      this.debugLineMeshes.push(rightLine, upLine, fwdLine);
    }

    // 2. Draw Target Surface Anchors, Resolved Positions, and Connector Lines for targets
    for (const def of this.targetDefinitions) {
      const resolved = resolveTargetTransform(def, path);

      const anchorVec = new Vector3(resolved.surfaceAnchor.x, resolved.surfaceAnchor.y, resolved.surfaceAnchor.z);
      const posVec = new Vector3(resolved.position.x, resolved.position.y, resolved.position.z);

      // Yellow line connecting Surface Anchor to Resolved Position
      const connectorLine = MeshBuilder.CreateLines(
        `target_conn_${def.id}`,
        { points: [anchorVec, posVec] },
        this.babylonScene
      );
      connectorLine.color = new Color3(1, 0.9, 0.2);
      this.debugLineMeshes.push(connectorLine);
    }
  }

  private initPostProcessingPipeline(): void {
    try {
      this.glowLayer = new GlowLayer('glowLayer', this.babylonScene, {
        mainTextureFixedSize: 512,
        blurKernelSize: 32,
      });
      this.glowLayer.intensity = 0.35; // Calibrated restrained glow budget to prevent shape clipping

      this.renderingPipeline = new DefaultRenderingPipeline(
        'defaultPipeline',
        true,
        this.babylonScene,
        [this.camera.getCamera()]
      );
      this.renderingPipeline.fxaaEnabled = true;
      this.renderingPipeline.bloomEnabled = true;
      this.renderingPipeline.bloomThreshold = 0.82;
      this.renderingPipeline.bloomWeight = 0.18;
      this.renderingPipeline.bloomKernel = 24;
    } catch (e) {
      console.warn('[GameplayScene] Post-processing pipeline initialization skipped or fallback:', e);
    }
  }

  private activeRingMaterial!: StandardMaterial;
  private upcomingRingMaterial!: StandardMaterial;
  private distantRingMaterial!: StandardMaterial;
  private activeGateMaterial!: StandardMaterial;
  private upcomingGateMaterial!: StandardMaterial;
  private distantGateMaterial!: StandardMaterial;
  private blockerMaterial!: StandardMaterial;
  private resolvedMaterial!: StandardMaterial;
  private missedMaterial!: StandardMaterial;
  private inactiveMaterial!: StandardMaterial;

  private initTargetMaterials(): void {
    // 1. Ring Materials (Active / Upcoming / Distant)
    this.activeRingMaterial = new StandardMaterial('activeRingMat', this.babylonScene);
    this.activeRingMaterial.emissiveColor = new Color3(0.4, 0.95, 1.0); // Kinetic Cyan
    this.activeRingMaterial.alpha = 1.0;

    this.upcomingRingMaterial = new StandardMaterial('upcomingRingMat', this.babylonScene);
    this.upcomingRingMaterial.emissiveColor = new Color3(0.2, 0.75, 0.9);
    this.upcomingRingMaterial.alpha = 0.65;

    this.distantRingMaterial = new StandardMaterial('distantRingMat', this.babylonScene);
    this.distantRingMaterial.emissiveColor = new Color3(0.1, 0.4, 0.6);
    this.distantRingMaterial.alpha = 0.35;

    // 2. Arch Gate Materials (Active / Upcoming / Distant)
    this.activeGateMaterial = new StandardMaterial('activeGateMat', this.babylonScene);
    this.activeGateMaterial.emissiveColor = new Color3(0.4, 1.0, 0.5); // Emerald Green
    this.activeGateMaterial.alpha = 1.0;

    this.upcomingGateMaterial = new StandardMaterial('upcomingGateMat', this.babylonScene);
    this.upcomingGateMaterial.emissiveColor = new Color3(0.2, 0.8, 0.35);
    this.upcomingGateMaterial.alpha = 0.65;

    this.distantGateMaterial = new StandardMaterial('distantGateMat', this.babylonScene);
    this.distantGateMaterial.emissiveColor = new Color3(0.1, 0.45, 0.2);
    this.distantGateMaterial.alpha = 0.35;

    // 3. Blocker Material
    this.blockerMaterial = new StandardMaterial('blockerMat', this.babylonScene);
    this.blockerMaterial.emissiveColor = new Color3(1.0, 0.25, 0.25);

    // 4. Resolved (Passed) & Missed Target State Materials
    this.resolvedMaterial = new StandardMaterial('resolvedMat', this.babylonScene);
    this.resolvedMaterial.emissiveColor = new Color3(0.15, 0.65, 0.85); // Calm Cyan
    this.resolvedMaterial.alpha = 0.40;

    this.missedMaterial = new StandardMaterial('missedMat', this.babylonScene);
    this.missedMaterial.emissiveColor = new Color3(0.12, 0.12, 0.16); // Desaturated slate
    this.missedMaterial.alpha = 0.15;

    this.inactiveMaterial = new StandardMaterial('inactiveMat', this.babylonScene);
    this.inactiveMaterial.emissiveColor = new Color3(0.1, 0.1, 0.14);
    this.inactiveMaterial.alpha = 0.15;
  }

  public renderTargets(definitions: PrototypeTargetDefinition[], path?: FlowPath): void {
    if (path) {
      this.activePath = path;
    }
    this.targetDefinitions = definitions;

    this.activeTargetPulses.forEach((p) => p.mesh.dispose());
    this.activeTargetPulses = [];
    this.targetMeshes.forEach((mesh) => mesh.dispose());
    this.targetMeshes.clear();

    for (const def of definitions) {
      const resolved = this.activePath
        ? resolveTargetTransform(def, this.activePath)
        : {
            surfaceAnchor: def.position,
            position: def.position,
            forward: { x: 0, y: 0, z: 1 },
            right: { x: 1, y: 0, z: 0 },
            up: { x: 0, y: 1, z: 0 },
          };

      let mesh: Mesh;

      if (def.type === 'RING') {
        // Multi-segment alignment torus for RING target
        mesh = MeshBuilder.CreateTorus(
          def.id,
          { diameter: def.radius * 2, thickness: 0.22, tessellation: 28 },
          this.babylonScene
        );
        mesh.material = this.upcomingRingMaterial;
      } else if (def.type === 'GATE') {
        // Grounded Arch Gate Torus
        mesh = MeshBuilder.CreateTorus(
          def.id,
          { diameter: def.radius * 2.2, thickness: 0.32, tessellation: 28 },
          this.babylonScene
        );
        mesh.material = this.upcomingGateMaterial;
      } else {
        mesh = MeshBuilder.CreateSphere(
          def.id,
          { diameter: def.radius * 2, segments: 16 },
          this.babylonScene
        );
        mesh.material = this.blockerMaterial;
      }

      mesh.position.set(resolved.position.x, resolved.position.y, resolved.position.z);

      const right = new Vector3(resolved.right.x, resolved.right.y, resolved.right.z);
      const up = new Vector3(resolved.up.x, resolved.up.y, resolved.up.z);
      const forward = new Vector3(resolved.forward.x, resolved.forward.y, resolved.forward.z);

      // Base TrackFrame rotation matrix
      const frameRot = Quaternion.RotationQuaternionFromAxis(right, up, forward);

      if (def.type === 'RING' || def.type === 'GATE') {
        // Pitch 90 degrees around local X axis so ring/gate torus opening stands upright facing FORWARD along track
        const pitch90 = Quaternion.RotationAxis(new Vector3(1, 0, 0), Math.PI / 2);
        mesh.rotationQuaternion = frameRot.multiply(pitch90);
      } else {
        mesh.rotationQuaternion = frameRot;
      }

      this.targetMeshes.set(def.id, mesh);
    }

    if (this.debugModeActive && this.activePath) {
      this.rebuildDebugVisuals(this.activePath);
    }
  }

  public updateTargetVisualStates(states: Map<string, PrototypeTargetState>): void {
    // 1. Identify active (first unpassed), upcoming (next 2), and distant target indices
    let activeFound = false;
    let upcomingCount = 0;

    for (const def of this.targetDefinitions) {
      const state = states.get(def.id);
      const mesh = this.targetMeshes.get(def.id);
      if (!mesh) continue;

      if (state?.passed) {
        mesh.material = this.resolvedMaterial;
      } else if (state?.missed) {
        mesh.material = this.missedMaterial;
      } else if (state?.hit) {
        mesh.material = this.inactiveMaterial;
      } else if (!activeFound) {
        // First unpassed target = Active Target
        activeFound = true;
        mesh.material = def.type === 'GATE' ? this.activeGateMaterial : this.activeRingMaterial;
      } else if (upcomingCount < 2) {
        // Next 2 unpassed targets = Upcoming Targets
        upcomingCount++;
        mesh.material = def.type === 'GATE' ? this.upcomingGateMaterial : this.upcomingRingMaterial;
      } else {
        // Distant Targets
        mesh.material = def.type === 'GATE' ? this.distantGateMaterial : this.distantRingMaterial;
      }
    }
  }

  public triggerTargetPassResonance(targetId: string): void {
    const targetMesh = this.targetMeshes.get(targetId);
    if (!targetMesh) return;

    try {
      // Create expanding emissive resonance ring at target position
      const pulseMesh = MeshBuilder.CreateTorus(
        `pulse_${targetId}_${Date.now()}`,
        { diameter: 2.2, thickness: 0.15, tessellation: 24 },
        this.babylonScene
      );
      pulseMesh.position = targetMesh.position.clone();
      if (targetMesh.rotationQuaternion) {
        pulseMesh.rotationQuaternion = targetMesh.rotationQuaternion.clone();
      }

      const pulseMat = new StandardMaterial(`pulseMat_${targetId}`, this.babylonScene);
      pulseMat.emissiveColor = new Color3(0.35, 0.9, 1.0); // Kinetic Cyan pulse
      pulseMat.alpha = 0.95;
      pulseMat.backFaceCulling = false;
      pulseMesh.material = pulseMat;

      this.activeTargetPulses.push({ mesh: pulseMesh, material: pulseMat, timer: 0.35 });
    } catch (e) {
      console.warn('[GameplayScene] Target pass resonance pulse fallback:', e);
    }
  }

  public triggerTargetMissResonance(targetId: string): void {
    const targetMesh = this.targetMeshes.get(targetId);
    if (targetMesh) {
      targetMesh.material = this.inactiveMaterial;
    }
  }

  private updateActiveTargetPulses(deltaTimeSeconds: number): void {
    for (let i = this.activeTargetPulses.length - 1; i >= 0; i--) {
      const p = this.activeTargetPulses[i];
      p.timer -= deltaTimeSeconds;
      const progress = 1.0 - Math.max(0, p.timer / 0.35);

      const scale = 1.0 + progress * 1.8;
      p.mesh.scaling.set(scale, scale, scale);
      p.material.alpha = 0.95 * (1.0 - progress);

      if (p.timer <= 0) {
        p.mesh.dispose();
        this.activeTargetPulses.splice(i, 1);
      }
    }
  }

  public update(
    deltaTimeSeconds: number,
    playerState?: PlayerState,
    lateralIntent: number = 0
  ): void {
    // 1. Update target resonance pulses & environment props
    this.updateActiveTargetPulses(deltaTimeSeconds);
    this.environmentView.update(deltaTimeSeconds, playerState?.position);

    if (playerState) {
      // 2. Sync presentation player position & visual squash/stretch/jump VFX
      this.playerView.setPosition(
        playerState.position.x,
        playerState.position.y,
        playerState.position.z
      );

      // 2b. Sync grounded player contact shadow position (anchored to track surface under jumps)
      const groundY = playerState.position.y - playerState.airborneHeight;
      this.playerGroundShadow.updatePosition(
        playerState.position.x,
        groundY,
        playerState.position.z
      );

      this.playerView.updateVisuals(
        playerState.speed,
        this.environmentView.getHarmonyLevel(),
        playerState.airborneHeight,
        playerState.verticalVelocity,
        playerState.justLanded,
        playerState.jumpEventCounter,
        playerState.lastJumpIndex,
        deltaTimeSeconds
      );

      // 3. Sync camera target with forward look-ahead, lateral banking, and speed FOV
      this.camera.updateTarget(
        playerState.position,
        playerState.forward,
        playerState.speed,
        lateralIntent,
        deltaTimeSeconds
      );
    }
  }

  public render(): void {
    this.babylonScene.render();
  }

  public dispose(): void {
    this.clearDebugVisuals();
    this.activeTargetPulses.forEach((p) => p.mesh.dispose());
    this.activeTargetPulses = [];
    this.targetMeshes.forEach((mesh) => mesh.dispose());
    this.targetMeshes.clear();
    this.renderingPipeline?.dispose();
    this.glowLayer?.dispose();
    this.playerGroundShadow.dispose();
    this.playerView.dispose();
    this.environmentView.dispose();
    this.camera.dispose();
    this.lighting.dispose();
    this.babylonScene.dispose();
  }
}
