import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';
import {
  LIVING_VALLEY_CONFIG,
  GOLDEN_HOUR_VALLEY_PALETTE,
  ScatterPatchDefinition,
} from './living-valley-config';
import { seededUnit, seedFromId } from './organic-noise';
import { buildGrassClump } from './grass-blade-geometry';
import { createGrassWindMaterial, GrassWindMaterialHandle } from './grass-wind-material';

// Alternating angular polyhedron types (Octahedron, Icosahedron) for rock
// silhouette variety — flat-shaded so facets stay sharp and planar, per the
// "planar facets, not round blobs" rock-language guidance.
const STONE_POLYHEDRON_TYPES = [1, 3];

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

  private grassMaterialHandle: GrassWindMaterialHandle;
  private stoneMaterial: StandardMaterial;
  private flowerMaterial: StandardMaterial;
  private windElapsedSeconds = 0;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Wind-Animated Grass Material — custom ShaderMaterial (see
    // grass-wind-material.ts) instead of StandardMaterial: blade sway comes
    // from a vertex shader reading the phase/flex data baked into each
    // clump's vertex colors by buildGrassClump().
    this.grassMaterialHandle = createGrassWindMaterial(
      'grassWindMat',
      scene,
      GOLDEN_HOUR_VALLEY_PALETTE.sage,
      new Vector3(-0.6, -0.35, 0.7),
      GOLDEN_HOUR_VALLEY_PALETTE.sunlightKey.scale(0.6),
      GOLDEN_HOUR_VALLEY_PALETTE.ambientSky.scale(0.4)
    );

    // 2. Weathered Stone Material — CC0 PBR albedo + normal (ambientCG Rock058),
    // shared across every stone cluster and the "steep slope" splat in the
    // ground shader, per the "single unified stone texture family" rule.
    this.stoneMaterial = new StandardMaterial('stoneScatterMat', scene);
    this.stoneMaterial.diffuseTexture = new Texture(
      '/assets/worlds/living-valley/materials/rocks/stone_crag_albedo.png',
      scene
    );
    this.stoneMaterial.bumpTexture = new Texture(
      '/assets/worlds/living-valley/materials/rocks/stone_crag_normal.png',
      scene
    );
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
        this.grassMesh.material = this.grassMaterialHandle.material;
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

        // Small fan of crossed, tapered opaque quads — replaces the earlier
        // tapered-cone tuft, which read as a spike rather than grass.
        const g = buildGrassClump(`g_${patch.id}_${i}`, this.scene, {
          bladeCount: 6,
          baseHeight: 1.1,
          heightJitter: 0.35,
          baseWidth: 0.4,
          colorVariance: seededUnit(patch.id, i + 350),
          seed: seedFromId(patch.id) + i,
        });
        g.position = pos;
        g.rotation.y = seededUnit(patch.id, i + 300) * Math.PI;
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

        // First stone in each cluster reads as a larger anchor; the rest are smaller companions —
        // natural stone families have scale hierarchy rather than uniform-sized pebbles.
        const scaleMul = i === 0 ? 1.35 : 0.55 + seededUnit(cluster.id, i + 500) * 0.35;
        const sizeX = 1.5 * scaleMul;
        const sizeY = 1.0 * scaleMul;
        const sizeZ = 1.8 * scaleMul;

        // Ground burial: sink the stone into the terrain proportional to its own
        // height so it reads as emerging from the ground rather than resting on top.
        const burialDepth = sizeY * 0.35;

        const pos = new Vector3(
          trackFrame.center.x + trackFrame.right.x * side * offsetDist,
          trackFrame.center.y - 1.8 - burialDepth,
          trackFrame.center.z + trackFrame.right.z * side * offsetDist
        );

        // Angular, flat-shaded polyhedron (planar facets) instead of a displaced
        // sphere — natural rock silhouette variety comes from alternating type +
        // non-uniform sizeX/Y/Z + rotation, not surface noise (which would smooth
        // away the hard facet edges `flat: true` is providing).
        const typeIndex = Math.floor(seededUnit(cluster.id, i + 800) * STONE_POLYHEDRON_TYPES.length);
        const st = MeshBuilder.CreatePolyhedron(
          `st_${cluster.id}_${i}`,
          { type: STONE_POLYHEDRON_TYPES[typeIndex], sizeX, sizeY, sizeZ, flat: true },
          this.scene
        );
        st.position = pos;
        st.rotation.y = seededUnit(cluster.id, i + 600) * Math.PI;
        st.rotation.x = (seededUnit(cluster.id, i + 900) - 0.5) * 0.3;
        st.rotation.z = (seededUnit(cluster.id, i + 950) - 0.5) * 0.3;
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

  /** Advances the grass wind animation's time uniform. */
  public update(deltaTimeSeconds: number): void {
    this.windElapsedSeconds += deltaTimeSeconds;
    this.grassMaterialHandle.setTime(this.windElapsedSeconds);
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

    this.grassMaterialHandle.material.dispose(true, true);
    this.stoneMaterial.dispose();
    this.flowerMaterial.dispose();
  }
}
