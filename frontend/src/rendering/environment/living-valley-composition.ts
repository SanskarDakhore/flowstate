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
  LandformDefinition,
  MountainLayerConfig,
} from './living-valley-config';
import { TreeSystem } from './tree-system';
import { VegetationScatter } from './vegetation-scatter';
import { AmbientParticleSystem } from './ambient-particle-system';
import { applyOrganicDisplacement, seedFromId, sampleNoise3D } from './organic-noise';

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
  // Landform materials are split by role so the 11 bluffs/cliffs/ridges don't
  // read as one repeated flat-colored shape: cliffs stay darker/sharper,
  // bluffs read warmer/sunlit, rolling ridges sit at a mid-tone between them.
  private landformMaterialCliff: StandardMaterial;
  private landformMaterialBluff: StandardMaterial;
  private landformMaterialRidge: StandardMaterial;
  private mountainMaterials: Map<string, StandardMaterial> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;

    // Subsystem initialization
    this.treeSystem = new TreeSystem(scene);
    this.vegetationScatter = new VegetationScatter(scene);
    this.ambientParticles = new AmbientParticleSystem(scene);

    // 1. Terrain Base Material — white diffuse so the per-vertex color gradient
    // (sage floor -> bluff slope -> fog rim, computed in createValleyFloor) reads
    // at full range under normal directional/hemispheric lighting. Unlike the sky
    // dome, lighting stays enabled here since the terrain must read as a grounded,
    // lit surface rather than a self-illuminated backdrop.
    this.terrainMaterial = new StandardMaterial('valleyTerrainMat', scene);
    this.terrainMaterial.diffuseColor = new Color3(1, 1, 1);
    this.terrainMaterial.specularColor = new Color3(0.02, 0.03, 0.02);
    this.terrainMaterial.emissiveColor = new Color3(0.03, 0.03, 0.02);

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
   *
   * The lateral contour rises into asymmetric valley walls near the outer
   * edges of the ribbon (rather than sinking away, which used to expose the
   * mesh's true boundary against open sky — read as a "floating platform").
   * The walls stay gentle near the track and climb steeply only near the rim,
   * where a vertex-color gradient toward the fog color helps the boundary
   * dissolve into atmospheric haze instead of silhouetting.
   */
  private createValleyFloor(path: FlowPath): void {
    const { width, subdivisionsX, subdivisionsZ, baseDepth } = LIVING_VALLEY_CONFIG.terrain;

    const paths: Vector3[][] = [];
    const colors: number[] = [];
    const halfWidth = width * 0.5;

    const floorColor = GOLDEN_HOUR_VALLEY_PALETTE.sage;
    const slopeColor = GOLDEN_HOUR_VALLEY_PALETTE.landformBluff;
    const rimColor = GOLDEN_HOUR_VALLEY_PALETTE.fog;

    for (let r = 0; r <= subdivisionsX; r++) {
      const rowPath: Vector3[] = [];
      const u = r / subdivisionsX; // 0..1 across lateral width
      const offsetFactor = (u - 0.5) * 2; // -1..+1
      const t = Math.min(1, Math.abs(offsetFactor)); // 0 at track center -> 1 at outer rim
      const isRight = offsetFactor >= 0;

      // Eased rise: gentle near the track, climbing steeply only near the rim.
      const riseCurve = Math.pow(t, 2.1);
      // Right/left walls use different max heights so the valley isn't a mirror bowl.
      const maxWallHeight = isRight ? 95 : 78;
      const wallRise = riseCurve * maxWallHeight;

      for (let c = 0; c <= subdivisionsZ; c++) {
        const progress = c / subdivisionsZ;
        const trackPoint = path.getPosition(progress);
        const trackFrame = path.getTrackFrame(progress);

        // Section depth variation (Opening Expanse drops deeper)
        const sectionDepth = Math.sin(progress * Math.PI * 2) * 6;
        // Low-amplitude crest undulation, confined to the outer band, so the
        // rim isn't a perfectly straight ridge line (one-time build cost only).
        const wallUndulation =
          (sampleNoise3D(progress * 6.0 + (isRight ? 31.7 : 4.3), 0, offsetFactor * 2.0) - 0.5) * 14 * t;

        const vx = trackPoint.x + trackFrame.right.x * (offsetFactor * halfWidth);
        const vy = Math.min(trackPoint.y - 12.0, baseDepth) + wallRise + wallUndulation + sectionDepth;
        const vz = trackPoint.z + trackFrame.right.z * (offsetFactor * halfWidth);

        rowPath.push(new Vector3(vx, vy, vz));

        // Terrain material color: valley floor -> rising slope -> rim (fades toward fog haze)
        let cr: number, cg: number, cb: number;
        if (riseCurve < 0.45) {
          const f = riseCurve / 0.45;
          cr = floorColor.r + (slopeColor.r - floorColor.r) * f;
          cg = floorColor.g + (slopeColor.g - floorColor.g) * f;
          cb = floorColor.b + (slopeColor.b - floorColor.b) * f;
        } else {
          const f = (riseCurve - 0.45) / 0.55;
          cr = slopeColor.r + (rimColor.r - slopeColor.r) * f;
          cg = slopeColor.g + (rimColor.g - slopeColor.g) * f;
          cb = slopeColor.b + (rimColor.b - slopeColor.b) * f;
        }

        // Restrained low-frequency brightness breakup (large soft regions, not surface noise)
        const breakup = (sampleNoise3D(vx * 0.012, 0, vz * 0.012) - 0.5) * 0.16;
        colors.push(
          Math.max(0, Math.min(1, cr + breakup)),
          Math.max(0, Math.min(1, cg + breakup)),
          Math.max(0, Math.min(1, cb + breakup)),
          1.0
        );
      }
      paths.push(rowPath);
    }

    // FRONTSIDE only (was DOUBLESIDE): the valley floor is always viewed from
    // above/outside, and DOUBLESIDE duplicates the vertex buffer internally,
    // which would silently desync it from the single-sided `colors` array below.
    this.valleyFloorMesh = MeshBuilder.CreateRibbon(
      'valleyFloor',
      {
        pathArray: paths,
      },
      this.scene
    );
    this.valleyFloorMesh.setVerticesData('color', colors);
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
      let material: StandardMaterial;
      // Noise amplitude/frequency ratios tuned per variant so cliffs keep sharp,
      // readable planes while rounded bluffs/ridges get a fuller sculpted look —
      // preserving the intended silhouette contrast between "hard rock" and
      // "soft earth" shape language instead of applying one uniform treatment.
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
        noiseAmplitudeRatio = 0.035; // keep cliff faces sharp and planar
        noiseFrequency = 0.03;
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
        material = this.landformMaterialRidge;
        noiseAmplitudeRatio = 0.10;
        noiseFrequency = 0.045;
      }

      // Break up the primitive silhouette into a softer, sculpted landform.
      // Amplitude scales with the mesh's smallest dimension so small bluffs
      // don't get spiky and large ridges still read as gently eroded.
      const minDimension = Math.min(def.scale[0], def.scale[1], def.scale[2]);
      applyOrganicDisplacement(mesh, {
        amplitude: minDimension * noiseAmplitudeRatio,
        frequency: noiseFrequency,
        seed: seedFromId(def.id),
      });

      mesh.position = worldPos;
      mesh.rotation.y = def.rotationY;
      mesh.rotation.z = Math.sign(effectiveLateralOffset) * -0.15; // Subtle tilt into valley
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
    this.landformMaterialCliff.dispose();
    this.landformMaterialBluff.dispose();
    this.landformMaterialRidge.dispose();
    this.mountainMaterials.forEach((mat) => mat.dispose());
    this.mountainMaterials.clear();
  }
}
