import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
  Vector3,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';

export class WorldEnvironmentProps {
  private scene: Scene;
  private islands: Mesh[] = [];
  private crystals: Mesh[] = [];

  private islandMaterial: StandardMaterial;
  private crystalMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Dark Rocky Island Material
    this.islandMaterial = new StandardMaterial('islandMat', scene);
    this.islandMaterial.diffuseColor = new Color3(0.05, 0.07, 0.12);
    this.islandMaterial.specularColor = new Color3(0.08, 0.1, 0.16);

    // 2. Luminous Faceted Crystal Material (Magenta/Violet Emissive)
    this.crystalMaterial = new StandardMaterial('crystalMat', scene);
    this.crystalMaterial.diffuseColor = new Color3(0.6, 0.1, 0.8);
    this.crystalMaterial.emissiveColor = new Color3(0.7, 0.15, 0.9); // Luminous magenta
    this.crystalMaterial.specularColor = new Color3(1.0, 1.0, 1.0);
  }

  /**
   * Generates low-poly floating islands and landmark crystals positioned along the FlowPath volume.
   */
  public generateEnvironmentProps(path: FlowPath, islandCount: number = 0): void {
    this.dispose();

    const totalLength = path.getTotalLength();

    // Generate Floating Islands along track volume
    for (let i = 1; i <= islandCount; i++) {
      const progress = i / (islandCount + 1);
      const center = path.getPosition(progress);
      const frame = path.getFrame(progress);

      const side = i % 2 === 0 ? 1 : -1;
      const distFromPath = 18 + (i % 5) * 8; // Offset 18 - 50 units away from path

      const islandPos = new Vector3(
        center.x + frame.normal.x * side * distFromPath,
        center.y + (i % 3 === 0 ? -6 : i % 2 === 0 ? -12 : -18),
        center.z + (i % 4 - 2) * 5
      );

      const scaleX = 4 + (i % 4) * 3;
      const scaleY = 2 + (i % 3) * 2;
      const scaleZ = 5 + (i % 5) * 3;

      // Base Island Mesh (Box primitive stretched into low-poly rock slab)
      const island = MeshBuilder.CreateBox(
        `island_${i}`,
        { width: scaleX, height: scaleY, depth: scaleZ },
        this.scene
      );
      island.position = islandPos;
      island.rotation.y = (i * 0.7) % Math.PI;
      island.rotation.x = ((i % 3) - 1) * 0.1;
      island.material = this.islandMaterial;

      this.islands.push(island);
    }

    // Legacy Magenta Crystals disabled for World 01 to eliminate visual color clash
    // Custom natural resonance stone set-pieces will be designed in a future environmental pass.
    /*
    const crystalPositions = [0.15, 0.35, 0.6, 0.82];
    crystalPositions.forEach((prog, index) => {
      const pos = path.getPosition(prog);
      const frame = path.getFrame(prog);
      const side = index % 2 === 0 ? 1 : -1;

      const crystalMesh = MeshBuilder.CreatePolyhedron(
        `crystal_${index}`,
        { type: 1, size: 2.2 },
        this.scene
      );

      crystalMesh.position.set(
        pos.x + frame.normal.x * side * 14,
        pos.y + 4.0,
        pos.z
      );
      crystalMesh.material = this.crystalMaterial;
      this.crystals.push(crystalMesh);
    });
    */
  }

  public update(deltaTimeSeconds: number): void {
    // Slow rotation animation for landmark crystals
    const rotSpeed = 0.6 * deltaTimeSeconds;
    for (const crystal of this.crystals) {
      crystal.rotation.y += rotSpeed;
      crystal.rotation.x += rotSpeed * 0.5;
    }
  }

  public setHarmonyVisuals(harmony: number): void {
    const val = Math.max(0, Math.min(1, harmony));
    // Dynamic magenta crystal glow scaling with harmony progress
    this.crystalMaterial.emissiveColor = new Color3(
      0.7 + val * 0.3,
      0.15 + val * 0.3,
      0.9 + val * 0.1
    );
  }

  public dispose(): void {
    this.islands.forEach((m) => m.dispose());
    this.islands = [];
    this.crystals.forEach((m) => m.dispose());
    this.crystals = [];
  }
}
