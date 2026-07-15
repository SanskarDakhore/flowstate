import {
  Scene,
  MeshBuilder,
  Mesh,
  InstancedMesh,
  StandardMaterial,
  Color3,
  Vector3,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';
import {
  LIVING_VALLEY_CONFIG,
  GOLDEN_HOUR_VALLEY_PALETTE,
  TreeCanopyVariant,
} from './living-valley-config';
import { applyOrganicDisplacement, seededUnit } from './organic-noise';

/**
 * Layer 3 — Midground Tree System.
 * Constructs master stylized low-poly tree templates (curved trunk + a small
 * family of organic canopy silhouettes) and instances them along track
 * clearance corridors for optimal mobile performance. All canopy variants
 * share one material — only geometry differs — so material count and draw
 * calls stay flat regardless of silhouette variety.
 */
export class TreeSystem {
  private scene: Scene;
  private masterTrunkMesh: Mesh | null = null;
  private masterCanopyMeshes: Map<TreeCanopyVariant, Mesh> = new Map();

  private instances: InstancedMesh[] = [];

  private trunkMaterial: StandardMaterial;
  private canopyMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Warm Bark Wood Material
    this.trunkMaterial = new StandardMaterial('treeTrunkMat', scene);
    this.trunkMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.treeTrunk;
    this.trunkMaterial.specularColor = new Color3(0.02, 0.02, 0.02);

    // 2. Sunlit Foliage Material (shared across all canopy silhouette variants)
    this.canopyMaterial = new StandardMaterial('treeCanopyMat', scene);
    this.canopyMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.treeCanopy;
    this.canopyMaterial.specularColor = new Color3(0.04, 0.05, 0.04);
    this.canopyMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.treeCanopy.scale(0.12);
  }

  public buildTreeSystem(path: FlowPath): void {
    this.dispose();

    this.createMasterTreeTemplates();
    this.instantiateTrees(path);
  }

  private createMasterTreeTemplates(): void {
    // Master Trunk Template (Tapered low-poly cylinder) — shared by all canopy variants
    this.masterTrunkMesh = MeshBuilder.CreateCylinder(
      'masterTreeTrunk',
      {
        height: 8.0,
        diameterTop: 0.8,
        diameterBottom: 1.6,
        tessellation: 6,
      },
      this.scene
    );
    this.masterTrunkMesh.position.y = 4.0;
    this.masterTrunkMesh.material = this.trunkMaterial;
    this.masterTrunkMesh.isPickable = false;
    this.masterTrunkMesh.isVisible = false; // Master mesh template stays hidden

    this.masterCanopyMeshes.set('broad', this.buildBroadCanopy());
    this.masterCanopyMeshes.set('narrow', this.buildNarrowCanopy());
    this.masterCanopyMeshes.set('windswept', this.buildWindsweptCanopy());
  }

  /** Wide, rounded hero canopy — mature tree silhouette. */
  private buildBroadCanopy(): Mesh {
    const s1 = MeshBuilder.CreateSphere('canopy_broad_1', { segments: 6, diameter: 6.0 }, this.scene);
    s1.position.y = 8.5;

    const s2 = MeshBuilder.CreateSphere('canopy_broad_2', { segments: 6, diameter: 4.8 }, this.scene);
    s2.position.set(1.2, 7.5, 0.8);

    const s3 = MeshBuilder.CreateSphere('canopy_broad_3', { segments: 6, diameter: 4.5 }, this.scene);
    s3.position.set(-1.0, 9.2, -0.6);

    const mesh = Mesh.MergeMeshes([s1, s2, s3], true, true, undefined, false, true)!;
    mesh.name = 'masterTreeCanopy_broad';
    applyOrganicDisplacement(mesh, { amplitude: 0.55, frequency: 0.22, seed: 4.2 });
    return this.finalizeCanopyTemplate(mesh);
  }

  /** Taller, narrower, upward-reaching canopy — companion/background silhouette. */
  private buildNarrowCanopy(): Mesh {
    const s1 = MeshBuilder.CreateSphere('canopy_narrow_1', { segments: 6, diameterX: 3.8, diameterY: 4.6, diameterZ: 3.8 }, this.scene);
    s1.position.y = 8.0;

    const s2 = MeshBuilder.CreateSphere('canopy_narrow_2', { segments: 6, diameterX: 3.2, diameterY: 3.8, diameterZ: 3.2 }, this.scene);
    s2.position.set(0.5, 10.4, 0.3);

    const s3 = MeshBuilder.CreateSphere('canopy_narrow_3', { segments: 5, diameterX: 2.4, diameterY: 3.0, diameterZ: 2.4 }, this.scene);
    s3.position.set(-0.3, 12.4, -0.2);

    const mesh = Mesh.MergeMeshes([s1, s2, s3], true, true, undefined, false, true)!;
    mesh.name = 'masterTreeCanopy_narrow';
    applyOrganicDisplacement(mesh, { amplitude: 0.4, frequency: 0.26, seed: 9.7 });
    return this.finalizeCanopyTemplate(mesh);
  }

  /** Asymmetric, lopsided canopy read as shaped by prevailing wind — breaks silhouette symmetry. */
  private buildWindsweptCanopy(): Mesh {
    const s1 = MeshBuilder.CreateSphere('canopy_windswept_1', { segments: 6, diameter: 5.2 }, this.scene);
    s1.position.set(0, 8.2, 0);

    const s2 = MeshBuilder.CreateSphere('canopy_windswept_2', { segments: 6, diameter: 4.0 }, this.scene);
    s2.position.set(2.4, 7.6, 0.6);

    const s3 = MeshBuilder.CreateSphere('canopy_windswept_3', { segments: 5, diameter: 3.2 }, this.scene);
    s3.position.set(3.6, 8.8, -0.4);

    const mesh = Mesh.MergeMeshes([s1, s2, s3], true, true, undefined, false, true)!;
    mesh.name = 'masterTreeCanopy_windswept';
    applyOrganicDisplacement(mesh, { amplitude: 0.5, frequency: 0.2, seed: 16.3 });
    return this.finalizeCanopyTemplate(mesh);
  }

  private finalizeCanopyTemplate(mesh: Mesh): Mesh {
    mesh.material = this.canopyMaterial;
    mesh.isPickable = false;
    mesh.isVisible = false;
    return mesh;
  }

  private instantiateTrees(path: FlowPath): void {
    if (!this.masterTrunkMesh) return;

    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius +
      LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;

    LIVING_VALLEY_CONFIG.trees.forEach((def) => {
      const canopyTemplate = this.masterCanopyMeshes.get(def.canopyVariant);
      if (!canopyTemplate) return;

      const trackFrame = path.getTrackFrame(def.progressAnchor);

      // Enforce strict clearance distance outside the 18m+ protected gameplay corridor
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

      // Small deterministic lean so trees don't all stand at a perfect vertical —
      // trunk and canopy share the same lean value so they tilt together.
      const leanX = (seededUnit(def.id, 1) - 0.5) * 0.14;
      const leanZ = (seededUnit(def.id, 2) - 0.5) * 0.14;

      // Instance Trunk
      const trunkInst = this.masterTrunkMesh!.createInstance(`trunk_${def.id}`);
      trunkInst.position = worldPos;
      trunkInst.scaling.set(def.scale, def.scale, def.scale);
      trunkInst.rotation.set(leanX, def.rotationY, leanZ);
      trunkInst.isPickable = false;

      // Instance Canopy
      const canopyInst = canopyTemplate.createInstance(`canopy_${def.id}`);
      canopyInst.position = worldPos;
      canopyInst.scaling.set(def.scale, def.scale, def.scale);
      canopyInst.rotation.set(leanX, def.rotationY, leanZ);
      canopyInst.isPickable = false;

      this.instances.push(trunkInst, canopyInst);
    });
  }

  public dispose(): void {
    this.instances.forEach((inst) => inst.dispose());
    this.instances = [];

    if (this.masterTrunkMesh) {
      this.masterTrunkMesh.dispose();
      this.masterTrunkMesh = null;
    }
    this.masterCanopyMeshes.forEach((mesh) => mesh.dispose());
    this.masterCanopyMeshes.clear();

    this.trunkMaterial.dispose();
    this.canopyMaterial.dispose();
  }
}
