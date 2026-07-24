import { Scene, Mesh, InstancedMesh, TransformNode, Matrix, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

export class InstancedVegetationManager {
  private scene: Scene;
  private grassRoot: TransformNode;
  private flowerRoot: TransformNode;
  private treeRoot: TransformNode;

  private grassInstances: InstancedMesh[] = [];
  private flowerInstances: InstancedMesh[] = [];
  private treeInstances: InstancedMesh[] = [];

  private grassCapacity: number;
  private flowerCapacity: number;
  private treeCapacity: number;

  constructor(
    scene: Scene,
    grassCount: number = 1200,
    flowerCount: number = 350,
    treeCount: number = 120
  ) {
    this.scene = scene;
    this.grassCapacity = grassCount;
    this.flowerCapacity = flowerCount;
    this.treeCapacity = treeCount;

    this.grassRoot = new TransformNode('grass_root', scene);
    this.flowerRoot = new TransformNode('flower_root', scene);
    this.treeRoot = new TransformNode('tree_root', scene);

    this.initializeVegetationMeshes();
  }

  private initializeVegetationMeshes(): void {
    // 1. Base Grass Template Mesh
    const baseGrass = MeshBuilder.CreatePlane('baseGrass', { width: 0.3, height: 0.8 }, this.scene);
    const grassMat = new StandardMaterial('grassMat', this.scene);
    grassMat.diffuseColor = new Color3(0.1, 0.7, 0.3);
    grassMat.specularColor = new Color3(0, 0, 0);
    baseGrass.material = grassMat;
    baseGrass.isVisible = false;

    for (let i = 0; i < this.grassCapacity; i++) {
      const inst = baseGrass.createInstance(`grass_${i}`);
      inst.parent = this.grassRoot;
      inst.isVisible = false;
      this.grassInstances.push(inst);
    }

    // 2. Base Wildflower Template Mesh
    const baseFlower = MeshBuilder.CreateDisc('baseFlower', { radius: 0.25, tessellation: 6 }, this.scene);
    const flowerMat = new StandardMaterial('flowerMat', this.scene);
    flowerMat.diffuseColor = new Color3(0.9, 0.3, 0.7);
    baseFlower.material = flowerMat;
    baseFlower.isVisible = false;

    for (let i = 0; i < this.flowerCapacity; i++) {
      const inst = baseFlower.createInstance(`flower_${i}`);
      inst.parent = this.flowerRoot;
      inst.isVisible = false;
      this.flowerInstances.push(inst);
    }

    // 3. Base Tree Template Mesh
    const baseTree = MeshBuilder.CreateCylinder('baseTree', { height: 3.5, diameterTop: 0.2, diameterBottom: 0.6 }, this.scene);
    const treeMat = new StandardMaterial('treeMat', this.scene);
    treeMat.diffuseColor = new Color3(0.4, 0.25, 0.15);
    baseTree.material = treeMat;
    baseTree.isVisible = false;

    for (let i = 0; i < this.treeCapacity; i++) {
      const inst = baseTree.createInstance(`tree_${i}`);
      inst.parent = this.treeRoot;
      inst.isVisible = false;
      this.treeInstances.push(inst);
    }
  }

  public populateVegetationAlongPath(
    pathPoints: Vector3[],
    ecosystemHealth: number // [0, 100]
  ): void {
    const healthRatio = Math.max(0, Math.min(1.0, ecosystemHealth / 100.0));
    const activeGrassCount = Math.floor(this.grassCapacity * Math.min(1.0, healthRatio * 1.2));
    const activeFlowerCount = Math.floor(this.flowerCapacity * Math.max(0, (healthRatio - 0.2) / 0.8));
    const activeTreeCount = Math.floor(this.treeCapacity * Math.max(0, (healthRatio - 0.4) / 0.6));

    const pathLength = pathPoints.length;
    if (pathLength < 2) return;

    // Distribute Grass
    for (let i = 0; i < this.grassCapacity; i++) {
      const inst = this.grassInstances[i];
      if (i < activeGrassCount) {
        const pointIdx = (i * 3) % pathLength;
        const pt = pathPoints[pointIdx];
        const offset = (Math.sin(i * 1.7) * 8.0) * (i % 2 === 0 ? 1 : -1);
        inst.position.set(pt.x + offset, pt.y, pt.z + (i % 5));
        inst.scaling.setAll(0.8 + Math.sin(i) * 0.4);
        inst.isVisible = true;
      } else {
        inst.isVisible = false;
      }
    }

    // Distribute Wildflowers
    for (let i = 0; i < this.flowerCapacity; i++) {
      const inst = this.flowerInstances[i];
      if (i < activeFlowerCount) {
        const pointIdx = (i * 5) % pathLength;
        const pt = pathPoints[pointIdx];
        const offset = (Math.cos(i * 2.3) * 6.0) * (i % 2 === 0 ? 1 : -1);
        inst.position.set(pt.x + offset, pt.y + 0.2, pt.z + (i % 7));
        inst.scaling.setAll(0.6 + Math.cos(i) * 0.3);
        inst.isVisible = true;
      } else {
        inst.isVisible = false;
      }
    }

    // Distribute Trees
    for (let i = 0; i < this.treeCapacity; i++) {
      const inst = this.treeInstances[i];
      if (i < activeTreeCount) {
        const pointIdx = (i * 7) % pathLength;
        const pt = pathPoints[pointIdx];
        const offset = (12.0 + Math.sin(i * 0.9) * 6.0) * (i % 2 === 0 ? 1 : -1);
        inst.position.set(pt.x + offset, pt.y + 1.75, pt.z + (i % 11));
        inst.scaling.set(1.0, 1.2 + Math.sin(i) * 0.5, 1.0);
        inst.isVisible = true;
      } else {
        inst.isVisible = false;
      }
    }
  }

  public dispose(): void {
    this.grassRoot.dispose();
    this.flowerRoot.dispose();
    this.treeRoot.dispose();
  }
}
