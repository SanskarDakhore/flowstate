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
  DORMANT_VALLEY_PALETTE,
  TreeInstanceDefinition,
} from './living-valley-config';

/**
 * Layer 3 — Midground Tree System.
 * Constructs master stylized low-poly tree templates (curved trunk + organic canopy)
 * and instances them along track clearance corridors for optimal mobile performance.
 */
export class TreeSystem {
  private scene: Scene;
  private masterTrunkMesh: Mesh | null = null;
  private masterCanopyMesh: Mesh | null = null;

  private instances: InstancedMesh[] = [];

  private trunkMaterial: StandardMaterial;
  private canopyMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Muted Dark Slate Wood Material
    this.trunkMaterial = new StandardMaterial('treeTrunkMat', scene);
    this.trunkMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.treeTrunk;
    this.trunkMaterial.specularColor = new Color3(0.02, 0.02, 0.02);

    // 2. Dormant Muted Foliage Material
    this.canopyMaterial = new StandardMaterial('treeCanopyMat', scene);
    this.canopyMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.treeCanopy;
    this.canopyMaterial.specularColor = new Color3(0.04, 0.05, 0.04);
    this.canopyMaterial.emissiveColor = DORMANT_VALLEY_PALETTE.treeCanopy.scale(0.12);
  }

  public buildTreeSystem(path: FlowPath): void {
    this.dispose();

    this.createMasterTreeTemplates();
    this.instantiateTrees(path);
  }

  private createMasterTreeTemplates(): void {
    // Master Trunk Template (Tapered low-poly cylinder)
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

    // Master Canopy Template (Low-poly organic triple sphere cluster)
    const sphere1 = MeshBuilder.CreateSphere('c1', { segments: 6, diameter: 6.0 }, this.scene);
    sphere1.position.y = 8.5;

    const sphere2 = MeshBuilder.CreateSphere('c2', { segments: 6, diameter: 4.8 }, this.scene);
    sphere2.position.set(1.2, 7.5, 0.8);

    const sphere3 = MeshBuilder.CreateSphere('c3', { segments: 6, diameter: 4.5 }, this.scene);
    sphere3.position.set(-1.0, 9.2, -0.6);

    this.masterCanopyMesh = Mesh.MergeMeshes(
      [sphere1, sphere2, sphere3],
      true,
      true,
      undefined,
      false,
      true
    );

    if (this.masterCanopyMesh) {
      this.masterCanopyMesh.name = 'masterTreeCanopy';
      this.masterCanopyMesh.material = this.canopyMaterial;
      this.masterCanopyMesh.isPickable = false;
      this.masterCanopyMesh.isVisible = false;
    }
  }

  private instantiateTrees(path: FlowPath): void {
    if (!this.masterTrunkMesh || !this.masterCanopyMesh) return;

    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius +
      LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;

    LIVING_VALLEY_CONFIG.trees.forEach((def) => {
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

      // Instance Trunk
      const trunkInst = this.masterTrunkMesh!.createInstance(`trunk_${def.id}`);
      trunkInst.position = worldPos;
      trunkInst.scaling.set(def.scale, def.scale, def.scale);
      trunkInst.rotation.y = def.rotationY;
      trunkInst.isPickable = false;

      // Instance Canopy
      const canopyInst = this.masterCanopyMesh!.createInstance(`canopy_${def.id}`);
      canopyInst.position = worldPos;
      canopyInst.scaling.set(def.scale, def.scale, def.scale);
      canopyInst.rotation.y = def.rotationY;
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
    if (this.masterCanopyMesh) {
      this.masterCanopyMesh.dispose();
      this.masterCanopyMesh = null;
    }

    this.trunkMaterial.dispose();
    this.canopyMaterial.dispose();
  }
}
