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
} from './living-valley-config';
import { TreeSystem } from './tree-system';
import { VegetationScatter } from './vegetation-scatter';
import { AmbientParticleSystem } from './ambient-particle-system';
import { applyOrganicDisplacement, seedFromId } from './organic-noise';
import { TerrainSystem } from './terrain-system';
import { LIVING_VALLEY_BIOME_CONFIG } from './biome-config';
import { ResonanceTree } from './resonance-tree';
import { GroundInjectionPoint } from './terrain-geometry';

/** World 01's signature landmark position: Grand Reopening zone, opposite side
 * from the existing d1-d3 tree grove, well beyond ordinary tree lateral offsets
 * so it stands alone as the dominant silhouette. */
const RESONANCE_TREE_PROGRESS = 0.87;
const RESONANCE_TREE_LATERAL_OFFSET = -65;

/**
 * World 01 — The Living Valley: Macro World Composition Engine.
 * Constructs terrain via TerrainSystem, midground framing landforms, trees, near vegetation scatter,
 * background mountain ridges, and drifting atmospheric particle spores.
 * Single Source of Truth: All landforms sample FlowPath to enforce track clearance envelopes.
 */
export class LivingValleyComposition {
  private scene: Scene;
  private valleyFloorMesh: Mesh | null = null;
  private landformMeshes: Mesh[] = [];
  private mountainMeshes: Mesh[] = [];

  public readonly terrainSystem: TerrainSystem;
  public readonly treeSystem: TreeSystem;
  public readonly vegetationScatter: VegetationScatter;
  public readonly ambientParticles: AmbientParticleSystem;
  public readonly resonanceTree: ResonanceTree;

  // Landform materials are split by role so the 11 bluffs/cliffs/ridges don't
  // read as one repeated flat-colored shape: cliffs stay darker/sharper,
  // bluffs read warmer/sunlit, rolling ridges sit at a mid-tone between them.
  private landformMaterialCliff: StandardMaterial;
  private landformMaterialBluff: StandardMaterial;
  private landformMaterialRidge: StandardMaterial;
  private mountainMaterials: Map<string, StandardMaterial> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Terrain System 2.0 initialization
    this.terrainSystem = new TerrainSystem(
      scene,
      LIVING_VALLEY_BIOME_CONFIG,
      new Vector3(-0.6, -0.35, 0.7),
      GOLDEN_HOUR_VALLEY_PALETTE.sunlightKey.scale(0.6),
      GOLDEN_HOUR_VALLEY_PALETTE.ambientSky.scale(0.4)
    );

    // Subsystem initialization
    this.treeSystem = new TreeSystem(scene);
    this.vegetationScatter = new VegetationScatter(scene);
    this.ambientParticles = new AmbientParticleSystem(scene);
    this.resonanceTree = new ResonanceTree(scene);

    // 2. Midground Landform Materials (role-based, still just 3 shared materials total)
    this.landformMaterialCliff = new StandardMaterial('landformCliffMat', scene);
    this.landformMaterialCliff.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.slateShadow;
    this.landformMaterialCliff.specularColor = new Color3(0.04, 0.05, 0.06);
    this.landformMaterialCliff.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.slateShadow.scale(0.15);

    this.landformMaterialBluff = new StandardMaterial('landformBluffMat', scene);
    this.landformMaterialBluff.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.landformBluff;
    this.landformMaterialBluff.specularColor = new Color3(0.03, 0.04, 0.04);
    this.landformMaterialBluff.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.landformBluff.scale(0.22);

    this.landformMaterialRidge = new StandardMaterial('landformRidgeMat', scene);
    this.landformMaterialRidge.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.landformRidge;
    this.landformMaterialRidge.specularColor = new Color3(0.03, 0.04, 0.05);
    this.landformMaterialRidge.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.landformRidge.scale(0.18);
  }

  /**
   * Builds the full macro environment around the provided playable FlowPath.
   */
  public buildComposition(path: FlowPath): void {
    this.dispose();

    const injectionPoints = this.computeGroundInjectionPoints(path);
    this.valleyFloorMesh = this.terrainSystem.buildTerrain(path, injectionPoints);

    this.createMidgroundLandforms(path);
    this.createMountainHorizon();

    // Build Layer 2 near vegetation, Layer 3 midground trees, Layer 5 ambient particles
    this.treeSystem.buildTreeSystem(path);
    this.vegetationScatter.buildScatter(path);
    this.ambientParticles.initParticleSystem();

    // World 01 signature landmark (Checkpoint C)
    const landmarkFrame = path.getTrackFrame(RESONANCE_TREE_PROGRESS);
    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius + LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;
    const landmarkLateral =
      Math.sign(RESONANCE_TREE_LATERAL_OFFSET) *
      Math.max(minClearance, Math.abs(RESONANCE_TREE_LATERAL_OFFSET));
    this.resonanceTree.build({
      x: landmarkFrame.center.x + landmarkFrame.right.x * landmarkLateral,
      y: landmarkFrame.center.y + landmarkFrame.right.y * landmarkLateral - 8,
      z: landmarkFrame.center.z + landmarkFrame.right.z * landmarkLateral,
    });
  }

  /**
   * Updates dynamic environment elements (ambient particle volume centering).
   */
  public update(deltaTimeSeconds: number, playerPosition?: { x: number; y: number; z: number }): void {
    if (playerPosition) {
      this.ambientParticles.updateCenter(playerPosition);
    }
    this.vegetationScatter.update(deltaTimeSeconds);
  }

  /**
   * Approximate world-space (x, z) contact points for trees and stone clusters.
   */
  private computeGroundInjectionPoints(path: FlowPath): GroundInjectionPoint[] {
    const points: GroundInjectionPoint[] = [];
    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius + LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;

    // Trees: exposed soil under the canopy shade line
    LIVING_VALLEY_CONFIG.trees.forEach((def) => {
      const trackFrame = path.getTrackFrame(def.progressAnchor);
      const effectiveLateralOffset =
        Math.sign(def.lateralOffset) * Math.max(minClearance, Math.abs(def.lateralOffset));
      points.push({
        x: trackFrame.center.x + trackFrame.right.x * effectiveLateralOffset,
        z: trackFrame.center.z + trackFrame.right.z * effectiveLateralOffset,
        radius: 7 * def.scale,
        strength: 0.6,
      });
    });

    // Stone clusters: exposed rock/dirt around each cluster's authored anchor
    LIVING_VALLEY_CONFIG.vegetation.stoneClusters.forEach((cluster) => {
      const trackFrame = path.getTrackFrame(cluster.progressCenter);
      const side = cluster.side === 'left' ? -1 : cluster.side === 'right' ? 1 : 1;
      const offsetDist = (cluster.lateralMin + cluster.lateralMax) * 0.5;
      points.push({
        x: trackFrame.center.x + trackFrame.right.x * side * offsetDist,
        z: trackFrame.center.z + trackFrame.right.z * side * offsetDist,
        radius: 6,
        strength: 0.9,
      });
    });

    return points;
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
      let material: StandardMaterial;
      let noiseAmplitudeRatio: number;
      let noiseFrequency: number;

      // Create low-poly stylized organic forms based on variant
      if (def.variant === 'smooth-bluff') {
        mesh = MeshBuilder.CreateSphere(
          def.id,
          { segments: 8, diameterX: def.scale[0], diameterY: def.scale[1], diameterZ: def.scale[2] },
          this.scene
        );
        material = this.landformMaterialBluff;
        noiseAmplitudeRatio = 0.13;
        noiseFrequency = 0.05;
      } else if (def.variant === 'cliff-wall') {
        mesh = MeshBuilder.CreateBox(
          def.id,
          { width: def.scale[0], height: def.scale[1], depth: def.scale[2] },
          this.scene
        );
        material = this.landformMaterialCliff;
        noiseAmplitudeRatio = 0.035;
        noiseFrequency = 0.03;
      } else {
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
        material = this.landformMaterialRidge;
        noiseAmplitudeRatio = 0.10;
        noiseFrequency = 0.045;
      }

      const minDimension = Math.min(def.scale[0], def.scale[1], def.scale[2]);
      applyOrganicDisplacement(mesh, {
        amplitude: minDimension * noiseAmplitudeRatio,
        frequency: noiseFrequency,
        seed: seedFromId(def.id),
      });

      mesh.position = worldPos;
      mesh.rotation.y = def.rotationY;
      mesh.rotation.z = Math.sign(effectiveLateralOffset) * -0.15;
      mesh.material = material;

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

      const upperPath: Vector3[] = [];
      const lowerPath: Vector3[] = [];

      const segments = layer.peakCount * 4;
      const stepX = layer.lateralSpan / segments;
      const startX = -layer.lateralSpan * 0.5 + layer.asymmetryOffset;

      for (let i = 0; i <= segments; i++) {
        const px = startX + i * stepX;
        const normalized = i / segments;

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
    this.resonanceTree.dispose();
    this.terrainSystem.dispose();

    this.valleyFloorMesh = null;
    this.landformMeshes.forEach((m) => m.dispose());
    this.landformMeshes = [];
    this.mountainMeshes.forEach((m) => m.dispose());
    this.mountainMeshes = [];

    this.landformMaterialCliff.dispose();
    this.landformMaterialBluff.dispose();
    this.landformMaterialRidge.dispose();
    this.mountainMaterials.forEach((mat) => mat.dispose());
    this.mountainMaterials.clear();
  }
}
