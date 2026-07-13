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

export class GameplayScene {
  public readonly babylonScene: Scene;
  public readonly camera: GameplayCamera;
  public readonly lighting: GameplayLighting;
  public readonly playerView: BabylonPlayerView;
  public readonly environmentView: EnvironmentView;

  private glowLayer: GlowLayer | null = null;
  private renderingPipeline: DefaultRenderingPipeline | null = null;

  private targetMeshes: Map<string, Mesh> = new Map();
  private targetDefinitions: PrototypeTargetDefinition[] = [];
  private ringMaterial!: StandardMaterial;
  private gateMaterial!: StandardMaterial;
  private blockerMaterial!: StandardMaterial;
  private inactiveMaterial!: StandardMaterial;

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
      this.glowLayer.intensity = 0.6;

      this.renderingPipeline = new DefaultRenderingPipeline(
        'defaultPipeline',
        true,
        this.babylonScene,
        [this.camera.getCamera()]
      );
      this.renderingPipeline.fxaaEnabled = true;
      this.renderingPipeline.bloomEnabled = true;
      this.renderingPipeline.bloomThreshold = 0.75;
      this.renderingPipeline.bloomWeight = 0.35;
      this.renderingPipeline.bloomKernel = 32;
    } catch (e) {
      console.warn('[GameplayScene] Post-processing pipeline initialization skipped or fallback:', e);
    }
  }

  private initTargetMaterials(): void {
    this.ringMaterial = new StandardMaterial('ringMat', this.babylonScene);
    this.ringMaterial.emissiveColor = new Color3(0.2, 0.85, 1.0); // Vibrant Cyan glow

    this.gateMaterial = new StandardMaterial('gateMat', this.babylonScene);
    this.gateMaterial.emissiveColor = new Color3(0.3, 1.0, 0.4); // Emerald green glow

    this.blockerMaterial = new StandardMaterial('blockerMat', this.babylonScene);
    this.blockerMaterial.emissiveColor = new Color3(1.0, 0.25, 0.25); // Red glow

    this.inactiveMaterial = new StandardMaterial('inactiveMat', this.babylonScene);
    this.inactiveMaterial.emissiveColor = new Color3(0.15, 0.15, 0.2); // Dim grey
    this.inactiveMaterial.alpha = 0.25;
  }

  public renderTargets(definitions: PrototypeTargetDefinition[], path?: FlowPath): void {
    if (path) {
      this.activePath = path;
    }
    this.targetDefinitions = definitions;

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
        mesh = MeshBuilder.CreateTorus(
          def.id,
          { diameter: def.radius * 2, thickness: 0.25, tessellation: 24 },
          this.babylonScene
        );
        mesh.material = this.ringMaterial;
      } else if (def.type === 'GATE') {
        mesh = MeshBuilder.CreateBox(
          def.id,
          { width: def.radius * 2, height: def.radius * 2.2, depth: 0.3 },
          this.babylonScene
        );
        mesh.material = this.gateMaterial;
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
      mesh.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(right, up, forward);

      this.targetMeshes.set(def.id, mesh);
    }

    if (this.debugModeActive && this.activePath) {
      this.rebuildDebugVisuals(this.activePath);
    }
  }

  public updateTargetVisualStates(states: Map<string, PrototypeTargetState>): void {
    states.forEach((state, id) => {
      const mesh = this.targetMeshes.get(id);
      if (mesh && (state.passed || state.hit || state.missed)) {
        mesh.material = this.inactiveMaterial;
      }
    });
  }

  public update(
    deltaTimeSeconds: number,
    playerState?: PlayerState,
    lateralIntent: number = 0
  ): void {
    // 1. Update environment props (rotating landmark crystals)
    this.environmentView.update(deltaTimeSeconds);

    if (playerState) {
      // 2. Sync presentation player position & visual squash/stretch/jump VFX
      this.playerView.setPosition(
        playerState.position.x,
        playerState.position.y,
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
    this.targetMeshes.forEach((mesh) => mesh.dispose());
    this.targetMeshes.clear();
    this.renderingPipeline?.dispose();
    this.glowLayer?.dispose();
    this.playerView.dispose();
    this.environmentView.dispose();
    this.camera.dispose();
    this.lighting.dispose();
    this.babylonScene.dispose();
  }
}
