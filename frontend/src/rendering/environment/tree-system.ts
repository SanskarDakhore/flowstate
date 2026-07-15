import {
  Scene,
  MeshBuilder,
  Mesh,
  InstancedMesh,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';
import {
  LIVING_VALLEY_CONFIG,
  GOLDEN_HOUR_VALLEY_PALETTE,
  TreeCanopyVariant,
} from './living-valley-config';
import { applyOrganicDisplacement, seededUnit } from './organic-noise';

type TrunkTier = 'young' | 'mature' | 'old';

/**
 * Layer 3 — Midground Tree System.
 * Constructs master stylized low-poly tree templates and instances them along
 * track clearance corridors for optimal mobile performance. Trunk tier
 * (young/mature/old) is derived from each instance's configured `scale`, and
 * canopy silhouette (broad/narrow/windswept) is chosen explicitly per
 * instance — the two vary independently for a naturally varied grove.
 * All canopy variants share one material (only geometry differs), and all
 * trunk tiers share one bark-textured material, so material count and draw
 * calls stay flat regardless of silhouette variety.
 */
export class TreeSystem {
  private scene: Scene;
  private masterTrunkMeshes: Map<TrunkTier, Mesh> = new Map();
  private masterCanopyMeshes: Map<TreeCanopyVariant, Mesh> = new Map();

  private instances: InstancedMesh[] = [];

  private trunkMaterial: StandardMaterial;
  private canopyMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Bark Material — CC0 PBR albedo + normal (ambientCG Bark014), shared
    // across all trunk tiers.
    this.trunkMaterial = new StandardMaterial('treeTrunkMat', scene);
    this.trunkMaterial.diffuseTexture = new Texture(
      '/assets/worlds/living-valley/materials/bark/trunk_bark_albedo.png',
      scene
    );
    this.trunkMaterial.bumpTexture = new Texture(
      '/assets/worlds/living-valley/materials/bark/trunk_bark_normal.png',
      scene
    );
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
    // Trunk tiers: young (narrow, minimal taper), mature (balanced, pronounced
    // lean applied at instance time), old (heavy wide base suggesting deep roots).
    this.masterTrunkMeshes.set('young', this.buildTrunkTemplate('young', 6.5, 0.5, 0.9, 6));
    this.masterTrunkMeshes.set('mature', this.buildTrunkTemplate('mature', 8.5, 0.75, 1.6, 6));
    this.masterTrunkMeshes.set('old', this.buildTrunkTemplate('old', 10.0, 1.0, 2.3, 7));

    this.masterCanopyMeshes.set('broad', this.buildBroadCanopy());
    this.masterCanopyMeshes.set('narrow', this.buildNarrowCanopy());
    this.masterCanopyMeshes.set('windswept', this.buildWindsweptCanopy());
  }

  private buildTrunkTemplate(
    tier: TrunkTier,
    height: number,
    diameterTop: number,
    diameterBottom: number,
    tessellation: number
  ): Mesh {
    const mesh = MeshBuilder.CreateCylinder(
      `masterTreeTrunk_${tier}`,
      { height, diameterTop, diameterBottom, tessellation },
      this.scene
    );
    mesh.material = this.trunkMaterial;
    mesh.isPickable = false;
    mesh.isVisible = false;
    return mesh;
  }

  private resolveTrunkTier(scale: number): TrunkTier {
    if (scale < 1.05) return 'young';
    if (scale < 1.45) return 'mature';
    return 'old';
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
    this.applyOutwardCanopyNormals(mesh);
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
    this.applyOutwardCanopyNormals(mesh);
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
    this.applyOutwardCanopyNormals(mesh);
    return this.finalizeCanopyTemplate(mesh);
  }

  /**
   * Rewrites every canopy vertex normal to point directly outward from the
   * merged mesh's volumetric center, instead of the smooth-averaged normals
   * `createNormals()` produces at overlapping-sphere seams. Fixes the
   * "broccoli effect" — messy, high-frequency shadow noise where the merged
   * foliage lobes meet — with smooth, single-mass studio-style shading.
   */
  private applyOutwardCanopyNormals(mesh: Mesh): void {
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) return;

    let cx = 0;
    let cy = 0;
    let cz = 0;
    const vertexCount = positions.length / 3;
    for (let i = 0; i < positions.length; i += 3) {
      cx += positions[i];
      cy += positions[i + 1];
      cz += positions[i + 2];
    }
    cx /= vertexCount;
    cy /= vertexCount;
    cz /= vertexCount;

    const normals = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      const dx = positions[i] - cx;
      const dy = positions[i + 1] - cy;
      const dz = positions[i + 2] - cz;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      normals[i] = dx / len;
      normals[i + 1] = dy / len;
      normals[i + 2] = dz / len;
    }

    mesh.updateVerticesData(VertexBuffer.NormalKind, normals);
  }

  private finalizeCanopyTemplate(mesh: Mesh): Mesh {
    mesh.material = this.canopyMaterial;
    mesh.isPickable = false;
    mesh.isVisible = false;
    return mesh;
  }

  private instantiateTrees(path: FlowPath): void {
    const minClearance =
      LIVING_VALLEY_CONFIG.trackClearance.baseRadius +
      LIVING_VALLEY_CONFIG.trackClearance.cameraSafetyMargin;

    LIVING_VALLEY_CONFIG.trees.forEach((def) => {
      const canopyTemplate = this.masterCanopyMeshes.get(def.canopyVariant);
      const tier = this.resolveTrunkTier(def.scale);
      const trunkTemplate = this.masterTrunkMeshes.get(tier);
      if (!canopyTemplate || !trunkTemplate) return;

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

      // Tier-specific lean: mature trees get the most pronounced structural
      // lean (biased away from the nearest valley wall, toward the open
      // track), old trees lean moderately (heavier, more established).
      // Trunk and canopy share the same lean value so they tilt together.
      const leanMagnitude = tier === 'mature' ? 0.10 : tier === 'old' ? 0.05 : 0.025;
      let leanBiasX = -Math.sign(def.lateralOffset) * leanMagnitude * 0.6;

      // Young trees on a grove's outer edge lean further outward, away from
      // the grove's own lateral centroid, toward the nearest open clearing —
      // rather than toward/away from the valley wall like their elders.
      if (tier === 'young') {
        const groveMates = LIVING_VALLEY_CONFIG.trees.filter(
          (other) =>
            other.id !== def.id &&
            Math.sign(other.lateralOffset) === Math.sign(def.lateralOffset) &&
            Math.abs(other.progressAnchor - def.progressAnchor) < 0.03
        );
        if (groveMates.length > 0) {
          const centroidLateral =
            (def.lateralOffset + groveMates.reduce((sum, m) => sum + m.lateralOffset, 0)) /
            (groveMates.length + 1);
          const isOuterEdge = Math.abs(def.lateralOffset) > Math.abs(centroidLateral);
          if (isOuterEdge) {
            const outwardMagnitude = 0.07 + seededUnit(def.id, 5) * 0.03; // ~4-6 deg
            leanBiasX = Math.sign(def.lateralOffset) * outwardMagnitude;
          }
        }
      }

      const leanX = leanBiasX + (seededUnit(def.id, 1) - 0.5) * leanMagnitude * 0.8;
      const leanZ = (seededUnit(def.id, 2) - 0.5) * leanMagnitude * 0.6;

      // Instance Trunk
      const trunkInst = trunkTemplate.createInstance(`trunk_${def.id}`);
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

    this.masterTrunkMeshes.forEach((mesh) => mesh.dispose());
    this.masterTrunkMeshes.clear();
    this.masterCanopyMeshes.forEach((mesh) => mesh.dispose());
    this.masterCanopyMeshes.clear();

    this.trunkMaterial.dispose();
    this.canopyMaterial.dispose();
  }
}
