import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
  Vector3,
} from '@babylonjs/core';
import { FlowPath } from '../../game/movement/flow-path';
import { GOLDEN_HOUR_VALLEY_PALETTE } from './living-valley-config';

export class RibbonPathView {
  private scene: Scene;
  private roadMesh: Mesh | null = null;
  private leftBorderMesh: Mesh | null = null;
  private rightBorderMesh: Mesh | null = null;

  private roadMaterial: StandardMaterial;
  private borderMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;

    // 1. Dark Slate Reflective Road Surface Material
    this.roadMaterial = new StandardMaterial('roadMat', scene);
    this.roadMaterial.diffuseColor = new Color3(0.04, 0.05, 0.09);
    this.roadMaterial.specularColor = new Color3(0.12, 0.15, 0.22);
    this.roadMaterial.backFaceCulling = false;

    // 2. Bioluminescent Cyan Emissive Border Rail Material
    this.borderMaterial = new StandardMaterial('borderMat', scene);
    this.borderMaterial.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.bioluminescence.scale(0.8);
    this.borderMaterial.emissiveColor = GOLDEN_HOUR_VALLEY_PALETTE.bioluminescence.clone(); // Calibrated bioluminescent cyan
    this.borderMaterial.specularColor = new Color3(0.8, 0.9, 1.0);
    this.borderMaterial.backFaceCulling = false;
  }

  /**
   * Constructs the elevated 3D ribbon mesh by sampling frames directly from the active FlowPath.
   * Single Source of Truth invariant: Geometry is strictly generated from FlowPath math.
   */
  public buildPathMesh(path: FlowPath, segments: number = 400): void {
    this.dispose();

    const leftPaths: Vector3[] = [];
    const rightPaths: Vector3[] = [];
    const leftBorderPoints: Vector3[] = [];
    const rightBorderPoints: Vector3[] = [];

    const totalLength = path.getTotalLength();

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const center = path.getPosition(progress);
      const frame = path.getFrame(progress);

      // Organic width variation along track progression
      const baseWidth = 6.0;
      const widthVariation = Math.sin(progress * Math.PI * 8) * 1.2;
      const currentHalfWidth = (baseWidth + widthVariation) * 0.5;

      // Calculate 3D vertex coordinates along path normal vector
      const lx = center.x - frame.normal.x * currentHalfWidth;
      const ly = center.y - frame.normal.y * currentHalfWidth - 0.05; // Slightly below surface
      const lz = center.z - frame.normal.z * currentHalfWidth;

      const rx = center.x + frame.normal.x * currentHalfWidth;
      const ry = center.y + frame.normal.y * currentHalfWidth - 0.05;
      const rz = center.z + frame.normal.z * currentHalfWidth;

      const leftPt = new Vector3(lx, ly, lz);
      const rightPt = new Vector3(rx, ry, rz);

      leftPaths.push(leftPt);
      rightPaths.push(rightPt);

      // Elevated Border Rail points
      const borderHalfWidth = currentHalfWidth + 0.15;
      const lbx = center.x - frame.normal.x * borderHalfWidth;
      const lby = center.y - frame.normal.y * borderHalfWidth + 0.12; // Raised emissive rail
      const lbz = center.z - frame.normal.z * borderHalfWidth;

      const rbx = center.x + frame.normal.x * borderHalfWidth;
      const rby = center.y + frame.normal.y * borderHalfWidth + 0.12;
      const rbz = center.z + frame.normal.z * borderHalfWidth;

      leftBorderPoints.push(new Vector3(lbx, lby, lbz));
      rightBorderPoints.push(new Vector3(rbx, rby, rbz));
    }

    // 1. Create Road Ribbon Geometry
    this.roadMesh = MeshBuilder.CreateRibbon(
      'roadRibbon',
      {
        pathArray: [leftPaths, rightPaths],
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    this.roadMesh.material = this.roadMaterial;

    // 2. Create Left and Right Emissive Border Tubes
    this.leftBorderMesh = MeshBuilder.CreateTube(
      'leftBorderTube',
      {
        path: leftBorderPoints,
        radius: 0.18,
        tessellation: 8,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    this.leftBorderMesh.material = this.borderMaterial;

    this.rightBorderMesh = MeshBuilder.CreateTube(
      'rightBorderTube',
      {
        path: rightBorderPoints,
        radius: 0.18,
        tessellation: 8,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    this.rightBorderMesh.material = this.borderMaterial;
  }

  public setGlowIntensity(harmony: number): void {
    const val = Math.max(0, Math.min(1, harmony));

    // Dynamic border rail awakening (Dormant muted indigo -> Vibrant kinetic cyan)
    const bR = 0.10 + val * 0.25;
    const bG = 0.45 + val * 0.50;
    const bB = 0.65 + val * 0.35;
    this.borderMaterial.emissiveColor = new Color3(bR, bG, bB);

    // Dynamic track surface awakening (Dormant dark slate -> Luminous deep energy ribbon)
    const sR = 0.02 + val * 0.06;
    const sG = 0.04 + val * 0.18;
    const sB = 0.08 + val * 0.30;
    this.roadMaterial.emissiveColor = new Color3(sR, sG, sB);
  }

  public dispose(): void {
    if (this.roadMesh) {
      this.roadMesh.dispose();
      this.roadMesh = null;
    }
    if (this.leftBorderMesh) {
      this.leftBorderMesh.dispose();
      this.leftBorderMesh = null;
    }
    if (this.rightBorderMesh) {
      this.rightBorderMesh.dispose();
      this.rightBorderMesh = null;
    }
  }
}
