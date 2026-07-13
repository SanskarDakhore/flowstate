import { Scene, MeshBuilder, Mesh, StandardMaterial, Color3, Color4 } from '@babylonjs/core';
import { WorldPresentation } from './world-presentation';
import { GameplayLighting } from '../lighting/gameplay-lighting';
import { RibbonPathView } from './ribbon-path-view';
import { WorldEnvironmentProps } from './world-props';

export class EnvironmentView implements WorldPresentation {
  private scene: Scene;
  private groundMesh: Mesh;
  private groundMat: StandardMaterial;
  private skyDome: Mesh;
  private skyMat: StandardMaterial;
  private lighting: GameplayLighting;
  public readonly ribbonPath: RibbonPathView;
  public readonly worldProps: WorldEnvironmentProps;
  private currentHarmony = 0.0;

  // Atmosphere palette base colors (Deep navy -> Indigo/Purple)
  private readonly baseFogColor = new Color3(0.02, 0.03, 0.08);
  private readonly baseSkyColor = new Color3(0.04, 0.06, 0.16);

  constructor(scene: Scene, lighting: GameplayLighting) {
    this.scene = scene;
    this.lighting = lighting;

    // 1. Atmosphere Fog setup
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = this.baseFogColor.clone();
    this.scene.fogDensity = 0.005;

    // 2. Atmospheric Sky Dome (Inverted sphere wrapping visual volume)
    this.skyDome = MeshBuilder.CreateSphere(
      'skyDome',
      { diameter: 1200, segments: 16, sideOrientation: Mesh.BACKSIDE },
      scene
    );
    this.skyMat = new StandardMaterial('skyMat', scene);
    this.skyMat.backFaceCulling = false;
    this.skyMat.disableLighting = true;
    this.skyMat.emissiveColor = this.baseSkyColor.clone();
    this.skyDome.material = this.skyMat;

    // 3. Ground Mesh
    this.groundMesh = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 4 }, scene);
    this.groundMat = new StandardMaterial('groundMat', scene);
    this.groundMat.diffuseColor = new Color3(0.06, 0.08, 0.12);
    this.groundMat.specularColor = new Color3(0.02, 0.02, 0.04);
    this.groundMesh.material = this.groundMat;

    // 4. Elevated 3D Ribbon Path Visual Surface
    this.ribbonPath = new RibbonPathView(scene);

    // 5. Environmental Props (Floating Islands & Crystals)
    this.worldProps = new WorldEnvironmentProps(scene);

    this.applyHarmonyVisuals(0.0);
  }

  public setHarmonyLevel(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.currentHarmony = clamped;
    this.applyHarmonyVisuals(clamped);
  }

  public getHarmonyLevel(): number {
    return this.currentHarmony;
  }

  public update(deltaTimeSeconds: number): void {
    this.worldProps.update(deltaTimeSeconds);
  }

  private applyHarmonyVisuals(val: number): void {
    // 0.0 (Fragmented/Muted Indigo) -> 1.0 (Harmonious/Vibrant Deep Cyan-Indigo)
    const fogR = 0.02 + val * 0.03;
    const fogG = 0.03 + val * 0.08;
    const fogB = 0.08 + val * 0.15;

    const fogColor = new Color3(fogR, fogG, fogB);
    this.scene.fogColor = fogColor;
    this.scene.clearColor = new Color4(fogR, fogG, fogB, 1.0);

    const skyR = 0.04 + val * 0.05;
    const skyG = 0.06 + val * 0.12;
    const skyB = 0.16 + val * 0.20;
    this.skyMat.emissiveColor = new Color3(skyR, skyG, skyB);

    this.groundMat.diffuseColor = new Color3(0.06 + val * 0.1, 0.08 + val * 0.2, 0.12 + val * 0.3);
    this.ribbonPath.setGlowIntensity(val);
    this.worldProps.setHarmonyVisuals(val);
    this.lighting.setHarmonyIntensity(val);
  }

  public dispose(): void {
    this.worldProps.dispose();
    this.ribbonPath.dispose();
    this.skyDome.dispose();
    this.groundMesh.dispose();
  }
}
