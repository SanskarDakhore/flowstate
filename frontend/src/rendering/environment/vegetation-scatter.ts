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
  GOLDEN_HOUR_VALLEY_PALETTE,
  ScatterPatchDefinition,
} from './living-valley-config';
import { applyOrganicDisplacement, seededUnit } from './organic-noise';

/**
 * Layer 2 — Near Vegetation Scatter System.
 * Generates sunlit grass tufts, smooth river stones, and warm peach blossom buds
 * as small authored patches/clusters (not a globally-uniform scatter), then
 * merges each category into a single static batch mesh for mobile performance.
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

    // 1. Sunlit Sage Grass Material
    this.grassMaterial = new StandardMaterial('grassScatterMat', scene);
    this.grassMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.sage;
    this.grassMaterial.specularColor = new Color3(0.02, 0.03, 0.02);

    // 2. Warm River Stone Material
    this.stoneMaterial = new StandardMaterial('stoneScatterMat', scene);
    this.stoneMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.stone;
    this.stoneMaterial.specularColor = new Color3(0.08, 0.09, 0.10);

    // 3. Warm Peach Flower Bud Material
    this.flowerMaterial = new StandardMaterial('flowerScatterMat', scene);
    this.flowerMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.flowerBud;
    this.flowerMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.flowerBud.scale(0.25);
    this.flowerMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
  }

  public buildScatter(path: FlowPath): void {
    this.dispose();

    const grassClumpsToMerge = this.buildGrassPatches(path);
    const stonesToMerge = this.buildStoneClusters(path);
    const flowersToMerge = this.buildFlowerPatches(path);

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

  /** Deterministic progress position jittered within a patch's spread around its authored center. */
  private jitterProgress(patch: ScatterPatchDefinition, index: number): number {
    const t = (seededUnit(patch.id, index) - 0.5) * 2 * patch.progressSpread;
    return Math.max(0, Math.min(1, patch.progressCenter + t));
  }

  /** Which side of the track an item sits on — fixed for 'left'/'right' patches, seeded per-item for 'both'. */
  private resolveSide(patch: ScatterPatchDefinition, index: number): number {
    if (patch.side === 'left') return -1;
    if (patch.side === 'right') return 1;
    return seededUnit(patch.id, index + 37) > 0.5 ? 1 : -1;
  }

  /** Deterministic lateral distance jittered within the patch's authored range. */
  private jitterLateral(patch: ScatterPatchDefinition, index: number): number {
    const t = seededUnit(patch.id, index + 71);
    return patch.lateralMin + t * (patch.lateralMax - patch.lateralMin);
  }

  private buildGrassPatches(path: FlowPath): Mesh[] {
    const meshes: Mesh[] = [];

    LIVING_VALLEY_CONFIG.vegetation.grassPatches.forEach((patch) => {
      for (let i = 0; i < patch.count; i++) {
        const progress = this.jitterProgress(patch, i);
        const trackFrame = path.getTrackFrame(progress);
        const side = this.resolveSide(patch, i);
        const offsetDist = this.jitterLateral(patch, i);
        const verticalJitter = (seededUnit(patch.id, i + 200) - 0.5) * 2.4;

        const pos = new Vector3(
          trackFrame.center.x + trackFrame.right.x * side * offsetDist,
          trackFrame.center.y - 1.2 + trackFrame.up.y * verticalJitter,
          trackFrame.center.z + trackFrame.right.z * side * offsetDist
        );

        // Tapered grass tuft (narrow top, wider base) instead of a flat-sided box
        const g = MeshBuilder.CreateCylinder(
          `g_${patch.id}_${i}`,
          { diameterTop: 0.15, diameterBottom: 0.55, height: 1.4, tessellation: 5 },
          this.scene
        );
        g.position = pos;
        g.rotation.y = seededUnit(patch.id, i + 300) * Math.PI;
        // Slight natural lean so tufts don't all stand perfectly upright
        g.rotation.z = (seededUnit(patch.id, i + 400) - 0.5) * 0.1;
        meshes.push(g);
      }
    });

    return meshes;
  }

  private buildStoneClusters(path: FlowPath): Mesh[] {
    const meshes: Mesh[] = [];

    LIVING_VALLEY_CONFIG.vegetation.stoneClusters.forEach((cluster) => {
      for (let i = 0; i < cluster.count; i++) {
        const progress = this.jitterProgress(cluster, i);
        const trackFrame = path.getTrackFrame(progress);
        const side = this.resolveSide(cluster, i);
        const offsetDist = this.jitterLateral(cluster, i);

        const pos = new Vector3(
          trackFrame.center.x + trackFrame.right.x * side * offsetDist,
          trackFrame.center.y - 1.8,
          trackFrame.center.z + trackFrame.right.z * side * offsetDist
        );

        // First stone in each cluster reads as a larger anchor; the rest are smaller companions —
        // natural stone families have scale hierarchy rather than uniform-sized pebbles.
        const scaleMul = i === 0 ? 1.35 : 0.55 + seededUnit(cluster.id, i + 500) * 0.35;

        const st = MeshBuilder.CreateSphere(
          `st_${cluster.id}_${i}`,
          {
            segments: 4,
            diameterX: 2.2 * scaleMul,
            diameterY: 1.1 * scaleMul,
            diameterZ: 2.8 * scaleMul,
          },
          this.scene
        );
        // Break up the sphere silhouette into a natural rock shape
        applyOrganicDisplacement(st, {
          amplitude: 0.22 * scaleMul,
          frequency: 0.6,
          seed: seededUnit(cluster.id, i) * 40,
        });
        st.position = pos;
        st.rotation.y = seededUnit(cluster.id, i + 600) * Math.PI;
        meshes.push(st);
      }
    });

    return meshes;
  }

  private buildFlowerPatches(path: FlowPath): Mesh[] {
    const meshes: Mesh[] = [];

    LIVING_VALLEY_CONFIG.vegetation.flowerPatches.forEach((patch) => {
      for (let i = 0; i < patch.count; i++) {
        const progress = this.jitterProgress(patch, i);
        const trackFrame = path.getTrackFrame(progress);
        const side = this.resolveSide(patch, i);
        const offsetDist = this.jitterLateral(patch, i);

        const pos = new Vector3(
          trackFrame.center.x + trackFrame.right.x * side * offsetDist,
          trackFrame.center.y - 0.8,
          trackFrame.center.z + trackFrame.right.z * side * offsetDist
        );

        const scaleMul = 0.85 + seededUnit(patch.id, i + 700) * 0.3;

        // Unopened flower bud
        const fl = MeshBuilder.CreateSphere(
          `fl_${patch.id}_${i}`,
          {
            segments: 5,
            diameterX: 0.9 * scaleMul,
            diameterY: 1.4 * scaleMul,
            diameterZ: 0.9 * scaleMul,
          },
          this.scene
        );
        fl.position = pos;
        meshes.push(fl);
      }
    });

    return meshes;
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
