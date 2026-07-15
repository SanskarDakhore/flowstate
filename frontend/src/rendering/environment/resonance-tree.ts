import { Scene, MeshBuilder, Mesh, StandardMaterial, Texture, Color3, VertexBuffer } from '@babylonjs/core';
import { GOLDEN_HOUR_VALLEY_PALETTE } from './living-valley-config';
import { applyOrganicDisplacement, seededUnit } from './organic-noise';

/**
 * World 01's signature landmark — a single hero tree roughly 3.5x a mature
 * valley tree's height, with a flared root base and a large multi-lobe
 * canopy. Deliberately dormant/muted: no emissive glow, no particles — its
 * visual slots stay reserved for a future harmony-driven transformation
 * pass. Scaled to exceed the tallest midground landform (38 units) so it
 * reads as the valley's dominant grounded silhouette without approaching
 * mountain scale.
 */
export class ResonanceTree {
  private scene: Scene;
  private trunkMaterial: StandardMaterial;
  private canopyMaterial: StandardMaterial;
  private stoneMaterial: StandardMaterial;
  private meshes: Mesh[] = [];

  constructor(scene: Scene) {
    this.scene = scene;

    this.trunkMaterial = new StandardMaterial('resonanceTreeTrunkMat', scene);
    this.trunkMaterial.diffuseTexture = new Texture(
      '/assets/worlds/living-valley/materials/bark/trunk_bark_albedo.png',
      scene
    );
    this.trunkMaterial.bumpTexture = new Texture(
      '/assets/worlds/living-valley/materials/bark/trunk_bark_normal.png',
      scene
    );
    // Slightly darker/more muted than ordinary trunks — ancient, dormant, grounded.
    this.trunkMaterial.diffuseColor = new Color3(0.75, 0.72, 0.7);
    this.trunkMaterial.specularColor = new Color3(0.02, 0.02, 0.02);

    this.canopyMaterial = new StandardMaterial('resonanceTreeCanopyMat', scene);
    this.canopyMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.treeCanopy.scale(0.75);
    this.canopyMaterial.specularColor = new Color3(0.03, 0.04, 0.03);
    // No emissive — dormant presentation, no glow/particle systems. Harmony-driven
    // bloom is an explicitly deferred future pass, not part of this landmark.

    this.stoneMaterial = new StandardMaterial('resonanceTreeStoneMat', scene);
    this.stoneMaterial.diffuseTexture = new Texture(
      '/assets/worlds/living-valley/materials/rocks/stone_crag_albedo.png',
      scene
    );
    this.stoneMaterial.specularColor = new Color3(0.05, 0.05, 0.06);
  }

  public build(worldPos: { x: number; y: number; z: number }): void {
    this.dispose();

    // Flared root base — a short, wide frustum suggesting sprawling roots
    // locking into the terrain, without individual root geometry.
    const roots = MeshBuilder.CreateCylinder(
      'resonanceTreeRoots',
      { height: 4, diameterBottom: 13, diameterTop: 6.8, tessellation: 10 },
      this.scene
    );
    applyOrganicDisplacement(roots, { amplitude: 0.6, frequency: 0.12, seed: 61.3 });
    roots.position.set(worldPos.x, worldPos.y + 2, worldPos.z);
    roots.material = this.trunkMaterial;
    this.meshes.push(roots);

    // Main trunk — tapered, roughly 2.5x an 'old' tier standard tree
    const trunk = MeshBuilder.CreateCylinder(
      'resonanceTreeTrunk',
      { height: 22, diameterBottom: 6.5, diameterTop: 2.0, tessellation: 10 },
      this.scene
    );
    applyOrganicDisplacement(trunk, { amplitude: 0.35, frequency: 0.1, seed: 22.7 });
    trunk.position.set(worldPos.x, worldPos.y + 4 + 11, worldPos.z);
    trunk.material = this.trunkMaterial;
    this.meshes.push(trunk);

    // Large multi-lobe canopy (5 overlapping masses) — same outward-normal
    // technique as ordinary trees, scaled up for a complex hero silhouette.
    const canopyY = worldPos.y + 4 + 22;
    const lobes = [
      { d: 13.0, x: 0, y: 6.5, z: 0 },
      { d: 10.5, x: 3.5, y: 4.5, z: 1.5 },
      { d: 10.0, x: -3.2, y: 5.5, z: -1.2 },
      { d: 8.5, x: 1.0, y: 9.5, z: -2.0 },
      { d: 8.0, x: -2.0, y: 9.0, z: 2.2 },
    ];
    const lobeMeshes = lobes.map((l, i) => {
      const m = MeshBuilder.CreateSphere(`resonanceCanopyLobe_${i}`, { segments: 7, diameter: l.d }, this.scene);
      m.position.set(l.x, l.y, l.z);
      return m;
    });
    const canopy = Mesh.MergeMeshes(lobeMeshes, true, true, undefined, false, true)!;
    applyOrganicDisplacement(canopy, { amplitude: 0.9, frequency: 0.14, seed: 33.9 });
    this.applyOutwardNormals(canopy);
    canopy.position.set(worldPos.x, canopyY, worldPos.z);
    canopy.material = this.canopyMaterial;
    this.meshes.push(canopy);

    // Low-contrast stones settled near the root base
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + seededUnit('resonance-stone', i) * 0.8;
      const dist = 9 + seededUnit('resonance-stone', i + 10) * 4;
      const scale = 0.9 + seededUnit('resonance-stone', i + 20) * 0.6;
      const stone = MeshBuilder.CreatePolyhedron(
        `resonanceTreeStone_${i}`,
        { type: i % 2, sizeX: 1.4 * scale, sizeY: 0.9 * scale, sizeZ: 1.6 * scale, flat: true },
        this.scene
      );
      stone.position.set(
        worldPos.x + Math.cos(angle) * dist,
        worldPos.y - 0.3,
        worldPos.z + Math.sin(angle) * dist
      );
      stone.rotation.y = seededUnit('resonance-stone', i + 30) * Math.PI;
      stone.material = this.stoneMaterial;
      this.meshes.push(stone);
    }
  }

  /** Same "broccoli effect" fix used for ordinary tree canopies — see tree-system.ts. */
  private applyOutwardNormals(mesh: Mesh): void {
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) return;

    let cx = 0, cy = 0, cz = 0;
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

  public dispose(): void {
    this.meshes.forEach((m) => m.dispose());
    this.meshes = [];
  }

  public disposeMaterials(): void {
    this.trunkMaterial.dispose();
    this.canopyMaterial.dispose();
    this.stoneMaterial.dispose();
  }
}
