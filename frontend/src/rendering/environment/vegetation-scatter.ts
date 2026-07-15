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
} from './living-valley-config';

/**
 * Layer 2 — Near Vegetation Scatter System.
 * Generates restrained sage grass clumps, smooth river stones, and soft unopened lavender buds
 * framed along ribbon shoulders. Merged into static batch meshes for high mobile performance.
 */
export class VegetationScatter {
  private scene: Scene;
  private grassMesh: Mesh | null = null;
  private stoneMesh: Mesh | null = null;
  private flowerMesh: Mesh | null = null;

  private grassMaterial: StandardMaterial;
  private stoneMaterial: StandardMaterial;
  private flowerMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Muted Sage Grass Material
    this.grassMaterial = new StandardMaterial('grassScatterMat', scene);
    this.grassMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.sage;
    this.grassMaterial.specularColor = new Color3(0.02, 0.03, 0.02);

    // 2. Smooth Slate Stone Material
    this.stoneMaterial = new StandardMaterial('stoneScatterMat', scene);
    this.stoneMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.stone;
    this.stoneMaterial.specularColor = new Color3(0.08, 0.09, 0.10);

    // 3. Soft Lavender Flower Bud Material
    this.flowerMaterial = new StandardMaterial('flowerScatterMat', scene);
    this.flowerMaterial.diffuseColor = DORMANT_VALLEY_PALETTE.flowerBud;
    this.flowerMaterial.emissiveColor = DORMANT_VALLEY_PALETTE.flowerBud.scale(0.25);
    this.flowerMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
  }

  public buildScatter(path: FlowPath): void {
    this.dispose();

    const config = LIVING_VALLEY_CONFIG.vegetation;
    const grassClumpsToMerge: Mesh[] = [];
    const stonesToMerge: Mesh[] = [];
    const flowersToMerge: Mesh[] = [];

    // Deterministic pseudo-random generation along FlowPath progress
    for (let i = 1; i <= config.grassClumpCount; i++) {
      const progress = i / (config.grassClumpCount + 1);
      const trackFrame = path.getTrackFrame(progress);
      const side = i % 2 === 0 ? 1 : -1;
      const offsetDist = config.minLateralDistance + ((i * 7) % 12);

      const pos = new Vector3(
        trackFrame.center.x + trackFrame.right.x * side * offsetDist,
        trackFrame.center.y - 1.2 + trackFrame.up.y * ((i % 3) - 1.5),
        trackFrame.center.z + trackFrame.right.z * side * offsetDist
      );

      // Create low-poly grass clump
      const g = MeshBuilder.CreateBox(
        `g_${i}`,
        { width: 0.8, height: 1.4, depth: 0.8 },
        this.scene
      );
      g.position = pos;
      g.rotation.y = (i * 0.5) % Math.PI;
      grassClumpsToMerge.push(g);
    }

    for (let i = 1; i <= config.stoneClusterCount; i++) {
      const progress = i / (config.stoneClusterCount + 1);
      const trackFrame = path.getTrackFrame(progress);
      const side = i % 2 === 0 ? -1 : 1;
      const offsetDist = config.minLateralDistance + 2 + ((i * 5) % 10);

      const pos = new Vector3(
        trackFrame.center.x + trackFrame.right.x * side * offsetDist,
        trackFrame.center.y - 1.8,
        trackFrame.center.z + trackFrame.right.z * side * offsetDist
      );

      // Create smooth river stone
      const st = MeshBuilder.CreateSphere(
        `st_${i}`,
        { segments: 4, diameterX: 2.2, diameterY: 1.1, diameterZ: 2.8 },
        this.scene
      );
      st.position = pos;
      st.rotation.y = (i * 0.9) % Math.PI;
      stonesToMerge.push(st);
    }

    for (let i = 1; i <= config.flowerBudCount; i++) {
      const progress = i / (config.flowerBudCount + 1);
      const trackFrame = path.getTrackFrame(progress);
      const side = i % 3 === 0 ? 1 : -1;
      const offsetDist = config.minLateralDistance + 1 + ((i * 3) % 8);

      const pos = new Vector3(
        trackFrame.center.x + trackFrame.right.x * side * offsetDist,
        trackFrame.center.y - 0.8,
        trackFrame.center.z + trackFrame.right.z * side * offsetDist
      );

      // Create unopened flower bud
      const fl = MeshBuilder.CreateSphere(
        `fl_${i}`,
        { segments: 5, diameterX: 0.9, diameterY: 1.4, diameterZ: 0.9 },
        this.scene
      );
      fl.position = pos;
      flowersToMerge.push(fl);
    }

    // Batch merge into single static meshes to minimize draw calls
    if (grassClumpsToMerge.length > 0) {
      this.grassMesh = Mesh.MergeMeshes(grassClumpsToMerge, true, true, undefined, false, true);
      if (this.grassMesh) {
        this.grassMesh.material = this.grassMaterial;
        this.grassMesh.isPickable = false;
      }
    }

    if (stonesToMerge.length > 0) {
      this.stoneMesh = Mesh.MergeMeshes(stonesToMerge, true, true, undefined, false, true);
      if (this.stoneMesh) {
        this.stoneMesh.material = this.stoneMaterial;
        this.stoneMesh.isPickable = false;
      }
    }

    if (flowersToMerge.length > 0) {
      this.flowerMesh = Mesh.MergeMeshes(flowersToMerge, true, true, undefined, false, true);
      if (this.flowerMesh) {
        this.flowerMesh.material = this.flowerMaterial;
        this.flowerMesh.isPickable = false;
      }
    }
  }

  public dispose(): void {
    if (this.grassMesh) {
      this.grassMesh.dispose();
      this.grassMesh = null;
    }
    if (this.stoneMesh) {
      this.stoneMesh.dispose();
      this.stoneMesh = null;
    }
    if (this.flowerMesh) {
      this.flowerMesh.dispose();
      this.flowerMesh = null;
    }

    this.grassMaterial.dispose();
    this.stoneMaterial.dispose();
    this.flowerMaterial.dispose();
  }
}
