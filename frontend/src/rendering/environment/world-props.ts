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

  private islandMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Dark Rocky Island Material
    this.islandMaterial = new StandardMaterial('islandMat', scene);
    this.islandMaterial.diffuseColor = new Color3(0.05, 0.07, 0.12);
    this.islandMaterial.specularColor = new Color3(0.08, 0.1, 0.16);
  }

  /**
   * Generates low-poly floating islands positioned along the FlowPath volume.
   * Unused today (islandCount defaults to 0 and no call site passes a value) —
   * kept as inert scaffolding for a possible future floating-rock feature.
   */
  public generateEnvironmentProps(path: FlowPath, islandCount: number = 0): void {
    this.dispose();

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
  }

  public update(deltaTimeSeconds: number): void {
    // No-op today: retained as the presentation-layer update hook for
    // whatever future prop set replaces the removed legacy crystals.
  }

  public setHarmonyVisuals(harmony: number): void {
    // No-op today: retained as the presentation-layer harmony hook for
    // whatever future prop set replaces the removed legacy crystals.
  }

  public dispose(): void {
    this.islands.forEach((m) => m.dispose());
    this.islands = [];
  }
}
