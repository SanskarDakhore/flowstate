import { Scene, MeshBuilder, Mesh, StandardMaterial, Color3, Color4 } from '@babylonjs/core';
import { WorldPresentation } from './world-presentation';
import { GameplayLighting } from '../lighting/gameplay-lighting';
import { RibbonPathView } from './ribbon-path-view';
import { WorldEnvironmentProps } from './world-props';
import { LivingValleyComposition } from './living-valley-composition';
import { DORMANT_VALLEY_PALETTE } from './living-valley-config';
import { FlowPath } from '../../game/movement/flow-path';

export class EnvironmentView implements WorldPresentation {
  private scene: Scene;
  private groundMesh: Mesh;
  private groundMat: StandardMaterial;
  private skyDome: Mesh;
  private skyMat: StandardMaterial;
  private lighting: GameplayLighting;
  public readonly ribbonPath: RibbonPathView;
  public readonly worldProps: WorldEnvironmentProps;
  public readonly livingValleyComposition: LivingValleyComposition;
  private currentHarmony = 0.0;

  constructor(scene: Scene, lighting: GameplayLighting) {
    this.scene = scene;
    this.lighting = lighting;

    // 1. Atmosphere Fog setup using authoritative Dormant Valley palette
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = DORMANT_VALLEY_PALETTE.fog.clone();
    this.scene.fogDensity = 0.0022; // Soft atmospheric depth over 1200m expanse

    // 2. Atmospheric Sky Dome (Inverted sphere wrapping visual volume)
    this.skyDome = MeshBuilder.CreateSphere(
      'skyDome',
      { diameter: 2800, segments: 16, sideOrientation: Mesh.BACKSIDE },
      scene
    );
    this.skyMat = new StandardMaterial('skyMat', scene);
    this.skyMat.backFaceCulling = false;
    this.skyMat.disableLighting = true;
    this.skyMat.emissiveColor = DORMANT_VALLEY_PALETTE.skyEmissive.clone();
    this.skyDome.material = this.skyMat;

    // 3. Ground Mesh (Disabled in favor of contoured continuous valley floor ribbon)
    this.groundMesh = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 4 }, scene);
    this.groundMat = new StandardMaterial('groundMat', scene);
    this.groundMat.diffuseColor = DORMANT_VALLEY_PALETTE.sage;
    this.groundMesh.material = this.groundMat;
    this.groundMesh.isVisible = false; // Contoured Valley Floor replaces flat ground plane

    // 4. Elevated 3D Ribbon Path Visual Surface
    this.ribbonPath = new RibbonPathView(scene);

    // 5. Macro World Composition Engine (The Living Valley)
    this.livingValleyComposition = new LivingValleyComposition(scene);

    // 6. Legacy Environmental Props
    this.worldProps = new WorldEnvironmentProps(scene);

    this.applyHarmonyVisuals(0.0);
  }

  /**
   * Initializes the macro world composition (Valley Floor, Midground Landforms, Mountain Horizon)
   * around the active playable FlowPath.
   */
  public initLivingValley(path: FlowPath): void {
    this.livingValleyComposition.buildComposition(path);
  }

  public setHarmonyLevel(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.currentHarmony = clamped;
    this.applyHarmonyVisuals(clamped);
  }

  public getHarmonyLevel(): number {
    return this.currentHarmony;
  }

  public update(deltaTimeSeconds: number, playerPosition?: { x: number; y: number; z: number }): void {
    this.worldProps.update(deltaTimeSeconds);
    this.livingValleyComposition.update(deltaTimeSeconds, playerPosition);
  }

  private applyHarmonyVisuals(val: number): void {
    // Dormant base slate/sage -> Gentle harmony color boost
    const baseFog = DORMANT_VALLEY_PALETTE.fog;
    const fogR = baseFog.r + val * 0.04;
    const fogG = baseFog.g + val * 0.08;
    const fogB = baseFog.b + val * 0.12;

    const fogColor = new Color3(fogR, fogG, fogB);
    this.scene.fogColor = fogColor;
    this.scene.clearColor = new Color4(fogR, fogG, fogB, 1.0);

    const baseSky = DORMANT_VALLEY_PALETTE.skyEmissive;
    const skyR = baseSky.r + val * 0.05;
    const skyG = baseSky.g + val * 0.10;
    const skyB = baseSky.b + val * 0.15;
    this.skyMat.emissiveColor = new Color3(skyR, skyG, skyB);

    this.ribbonPath.setGlowIntensity(val);
    this.worldProps.setHarmonyVisuals(val);
    this.lighting.setHarmonyIntensity(val);
  }

  public dispose(): void {
    this.livingValleyComposition.dispose();
    this.worldProps.dispose();
    this.ribbonPath.dispose();
    this.skyDome.dispose();
    this.groundMesh.dispose();
  }
}
