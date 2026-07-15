import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
  Vector3,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';
import {
  LIVING_VALLEY_CONFIG,
  DORMANT_VALLEY_PALETTE,
  LandformDefinition,
  MountainLayerConfig,
} from './living-valley-config';
import { TreeSystem } from './tree-system';
import { VegetationScatter } from './vegetation-scatter';
import { AmbientParticleSystem } from './ambient-particle-system';

/**
 * World 01 — The Living Valley: Macro World Composition Engine.
 * Constructs terrain, midground framing landforms, trees, near vegetation scatter,
 * background mountain ridges, and drifting atmospheric particle spores.
 * Single Source of Truth: All landforms sample FlowPath to enforce track clearance envelopes.
 */
export class LivingValleyComposition {
  private scene: Scene;
  private valleyFloorMesh: Mesh | null = null;
  private landformMeshes: Mesh[] = [];
  private mountainMeshes: Mesh[] = [];

  public readonly treeSystem: TreeSystem;
  public readonly vegetationScatter: VegetationScatter;
  public readonly ambientParticles: AmbientParticleSystem;

  private terrainMaterial: StandardMaterial;
  private landformMaterial: StandardMaterial;
  private mountainMaterials: Map<string, StandardMaterial> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;

    // Subsystem initialization
    this.treeSystem = new TreeSystem(scene);
    this.vegetationScatter = new VegetationScatter(scene);
    this.ambientParticles = new AmbientParticleSystem(scene);

    // 1. Terrain Base Material (Muted Sage)
    this.terrainMaterial = new StandardMaterial('valleyTerrainMat', scene);
    this.terrainMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.sage;
    this.terrainMaterial.specularColor = new Color3(0.02, 0.03, 0.02);
    this.terrainMaterial.emissiveColor = DORMANT_VALLEY_PALETTE.sage.scale(0.15);

    // 2. Midground Landform Material (Deep Slate Shadow)
    this.landformMaterial = new StandardMaterial('landformMat', scene);
    this.landformMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.slateShadow;
    this.landformMaterial.specularColor = new Color3(0.04, 0.05, 0.06);
    this.landformMaterial.emissiveColor = DORMANT_VALLEY_PALETTE.slateShadow.scale(0.2);
  }

  /**
   * Builds the full macro environment around the provided playable FlowPath.
   */
  public buildComposition(path: FlowPath): void {
    this.dispose();

    this.createValleyFloor(path);
    this.createMidgroundLandforms(path);
    this.createMountainHorizon();

    // Build Layer 2 near vegetation, Layer 3 midground trees, Layer 5 ambient particles
    this.treeSystem.buildTreeSystem(path);
    this.vegetationScatter.buildScatter(path);
    this.ambientParticles.initParticleSystem();
  }

  /**
   * Updates dynamic environment elements (ambient particle volume centering).
   */
  public update(deltaTimeSeconds: number, playerPosition?: { x: number; y: number; z: number }): void {
    if (playerPosition) {
      this.ambientParticles.updateCenter(playerPosition);
    }
  }

  /**
   * Generates a smooth continuous terrain ribbon beneath the track route.
   */
  private createValleyFloor(path: FlowPath): void {
    const { width, subdivisionsX, subdivisionsZ, baseDepth } = LIVING_VALLEY_CONFIG.terrain;
    const totalLength = path.getTotalLength();

    const paths: Vector3[][] = [];
    const halfWidth = width * 0.5;

    for (let r = 0; r <= subdivisionsX; r++) {
      const rowPath: Vector3[] = [];
      const u = r / subdivisionsX; // 0..1 across lateral width
      const offsetFactor = (u - 0.5) * 2; // -1..+1

      for (let c = 0; c <= subdivisionsZ; c++) {
        const progress = c / subdivisionsZ;
        const trackPoint = path.getPosition(progress);
        const trackFrame = path.getTrackFrame(progress);

        // Valley bowl contouring: terrain dips lower near center, gently rises far laterally
        const bowlDip = (1 - Math.cos(offsetFactor * Math.PI * 0.5)) * 18;
        // Section depth variation (Opening Expanse drops deeper)
        const sectionDepth = Math.sin(progress * Math.PI * 2) * 6;

        const vx = trackPoint.x + trackFrame.right.x * (offsetFactor * halfWidth);
        const vy = Math.min(trackPoint.y - 12.0, baseDepth) - bowlDip + sectionDepth;
        const vz = trackPoint.z + trackFrame.right.z * (offsetFactor * halfWidth);

        rowPath.push(new Vector3(vx, vy, vz));
      }
      paths.push(rowPath);
    }

    this.valleyFloorMesh = MeshBuilder.CreateRibbon(
      'valleyFloor',
      {
        pathArray: paths,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    this.valleyFloorMesh.material = this.terrainMaterial;
  }

  /**
   * Generates track-aware midground framing landforms (bluffs, ridges, shoulders).
   */
  private createMidgroundLandforms(path: FlowPath): void {
    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius +
      LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;

    LIVING_VALLEY_CONFIG.landforms.forEach((def) => {
      const trackFrame = path.getTrackFrame(def.progressAnchor);

      // Validate and enforce minimum clearance envelope from sampled ribbon frame
      const effectiveLateralOffset =
        Math.sign(def.lateralOffset) *
        Math.max(minClearance, Math.abs(def.lateralOffset));

      const worldPos = new Vector3(
        trackFrame.center.x +
          trackFrame.right.x * effectiveLateralOffset +
          trackFrame.up.x * def.verticalOffset,
        trackFrame.center.y +
          trackFrame.right.y * effectiveLateralOffset +
          trackFrame.up.y * def.verticalOffset,
        trackFrame.center.z +
          trackFrame.right.z * effectiveLateralOffset +
          trackFrame.up.z * def.verticalOffset
      );

      let mesh: Mesh;

      // Create low-poly stylized organic forms based on variant
      if (def.variant === 'smooth-bluff') {
        mesh = MeshBuilder.CreateSphere(
          def.id,
          { segments: 8, diameterX: def.scale[0], diameterY: def.scale[1], diameterZ: def.scale[2] },
          this.scene
        );
      } else if (def.variant === 'cliff-wall') {
        mesh = MeshBuilder.CreateBox(
          def.id,
          { width: def.scale[0], height: def.scale[1], depth: def.scale[2] },
          this.scene
        );
      } else {
        // rolling-shoulder & ridge-mound
        mesh = MeshBuilder.CreateCylinder(
          def.id,
          {
            diameterTop: def.scale[0] * 0.4,
            diameterBottom: def.scale[0],
            height: def.scale[1],
            tessellation: 10,
          },
          this.scene
        );
      }

      mesh.position = worldPos;
      mesh.rotation.y = def.rotationY;
      mesh.rotation.z = Math.sign(effectiveLateralOffset) * -0.15; // Subtle tilt into valley
      mesh.material = this.landformMaterial;

      this.landformMeshes.push(mesh);
    });
  }

  /**
   * Generates 3 distinct background mountain silhouettes overlapping the horizon.
   */
  private createMountainHorizon(): void {
    LIVING_VALLEY_CONFIG.mountainLayers.forEach((layer) => {
      const mat = new StandardMaterial(`mountainMat_${layer.id}`, this.scene);
      const color = Color3.FromHexString(layer.colorHex);
      mat.diffuseColor = color;
      mat.emissiveColor = color.scale(0.35);
      mat.specularColor = new Color3(0, 0, 0);
      mat.disableLighting = false;

      this.mountainMaterials.set(layer.id, mat);

      // Build layered mountain ridge card using ribbon geometry
      const upperPath: Vector3[] = [];
      const lowerPath: Vector3[] = [];

      const segments = layer.peakCount * 4;
      const stepX = layer.lateralSpan / segments;
      const startX = -layer.lateralSpan * 0.5 + layer.asymmetryOffset;

      for (let i = 0; i <= segments; i++) {
        const px = startX + i * stepX;
        const normalized = i / segments;

        // Controlled jagged mountain peak noise
        const peakFactor =
          Math.sin(normalized * Math.PI * layer.peakCount) * 0.5 +
          Math.cos(normalized * Math.PI * (layer.peakCount * 1.7)) * 0.3 +
          0.8;

        const py = layer.baseY + peakFactor * layer.heightScale;
        const pz = layer.distanceZ;

        upperPath.push(new Vector3(px, py, pz));
        lowerPath.push(new Vector3(px, layer.baseY - 50, pz));
      }

      const mtnMesh = MeshBuilder.CreateRibbon(
        layer.id,
        {
          pathArray: [upperPath, lowerPath],
          sideOrientation: Mesh.DOUBLESIDE,
        },
        this.scene
      );
      mtnMesh.material = mat;

      this.mountainMeshes.push(mtnMesh);
    });
  }

  public dispose(): void {
    this.ambientParticles.dispose();
    this.vegetationScatter.dispose();
    this.treeSystem.dispose();

    if (this.valleyFloorMesh) {
      this.valleyFloorMesh.dispose();
      this.valleyFloorMesh = null;
    }
    this.landformMeshes.forEach((m) => m.dispose());
    this.landformMeshes = [];
    this.mountainMeshes.forEach((m) => m.dispose());
    this.mountainMeshes = [];

    this.terrainMaterial.dispose();
    this.landformMaterial.dispose();
    this.mountainMaterials.forEach((mat) => mat.dispose());
    this.mountainMaterials.clear();
  }
}
