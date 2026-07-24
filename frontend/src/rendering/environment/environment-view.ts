import { Scene, MeshBuilder, Mesh, StandardMaterial, Color3, Color4 } from '@babylonjs/core';
import { WorldPresentation } from './world-presentation';
import { GameplayLighting } from '../lighting/gameplay-lighting';
import { RibbonPathView } from './ribbon-path-view';
import { WorldEnvironmentProps } from './world-props';
import { LivingValleyComposition } from './living-valley-composition';
import { GOLDEN_HOUR_VALLEY_PALETTE } from './living-valley-config';
import { PresentationSnapshot } from '@flowstate/shared';
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

    // 1. Atmosphere Fog setup synchronized to warm golden-hour horizon glow
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = GOLDEN_HOUR_VALLEY_PALETTE.skyHorizon.clone();
    this.scene.fogDensity = 0.0016; // Calibrated soft atmospheric depth over 1200m expanse

    // 2. Atmospheric Sky Dome with 3-stop vertical height gradient (Horizon -> Mid -> Zenith)
    this.skyDome = MeshBuilder.CreateSphere(
      'skyDome',
      { diameter: 2800, segments: 24, sideOrientation: Mesh.BACKSIDE },
      scene
    );

    // Compute 3-stop vertical height vertex colors: Golden Horizon -> Coral Mid -> Deep Blue Zenith
    const positions = this.skyDome.getVerticesData('position');
    if (positions) {
      const colors: number[] = [];
      const zenith = GOLDEN_HOUR_VALLEY_PALETTE.skyZenith;   // Deep dusk-blue
      const mid = GOLDEN_HOUR_VALLEY_PALETTE.skyMid;         // Warm coral-rose transition
      const horizon = GOLDEN_HOUR_VALLEY_PALETTE.skyHorizon; // Golden amber glow

      for (let i = 0; i < positions.length; i += 3) {
        const y = positions[i + 1]; // Local Y coordinate
        // Normalize height ratio: y ranging from -1400 (bottom) to +1400 (zenith)
        const t = Math.max(0, Math.min(1, (y + 300) / 1700)); // Horizon seam sits low around dome

        let r: number, g: number, b: number;
        if (t < 0.35) {
          // Lower band: Golden Amber Horizon -> Warm Coral-Rose
          const factor = t / 0.35;
          r = horizon.r + (mid.r - horizon.r) * factor;
          g = horizon.g + (mid.g - horizon.g) * factor;
          b = horizon.b + (mid.b - horizon.b) * factor;
        } else {
          // Upper band: Warm Coral-Rose -> Deep Dusk-Blue Zenith
          const factor = (t - 0.35) / 0.65;
          r = mid.r + (zenith.r - mid.r) * factor;
          g = mid.g + (zenith.g - mid.g) * factor;
          b = mid.b + (zenith.b - mid.b) * factor;
        }

        colors.push(r, g, b, 1.0);
      }
      this.skyDome.setVerticesData('color', colors);
    }

    this.skyMat = new StandardMaterial('skyMat', scene);
    this.skyMat.backFaceCulling = false;
    this.skyMat.disableLighting = true;
    this.skyMat.emissiveColor = new Color3(1, 1, 1);
    this.skyDome.material = this.skyMat;

    // 3. Ground Mesh (Disabled in favor of contoured continuous valley floor ribbon)
    this.groundMesh = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 4 }, scene);
    this.groundMat = new StandardMaterial('groundMat', scene);
    this.groundMat.diffuseColor = GOLDEN_HOUR_VALLEY_PALETTE.sage;
    this.groundMesh.material = this.groundMat;
    this.groundMesh.isVisible = false; // Contoured Valley Floor replaces flat ground plane

    // 4. Elevated 3D Ribbon Path Visual Surface
    this.ribbonPath = new RibbonPathView(scene);

    // 5. Macro World Composition Engine (The Living Valley with TerrainSystem 2.0)
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
    const terrainMesh = this.livingValleyComposition.terrainSystem.getMesh();
    if (terrainMesh) {
      terrainMesh.receiveShadows = true;
    }
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
    // Golden-hour horizon base -> Gentle harmony color boost
    const baseHorizon = GOLDEN_HOUR_VALLEY_PALETTE.skyHorizon;
    const fogR = baseHorizon.r + val * 0.04;
    const fogG = baseHorizon.g + val * 0.08;
    const fogB = baseHorizon.b + val * 0.12;

    const fogColor = new Color3(fogR, fogG, fogB);
    this.scene.fogColor = fogColor;
    this.scene.clearColor = new Color4(fogR, fogG, fogB, 1.0);

    const baseSky = GOLDEN_HOUR_VALLEY_PALETTE.skyHorizon;
    const skyR = baseSky.r + val * 0.05;
    const skyG = baseSky.g + val * 0.10;
    const skyB = baseSky.b + val * 0.15;
    this.skyMat.emissiveColor = new Color3(skyR, skyG, skyB);

    this.ribbonPath.setGlowIntensity(val);
    this.worldProps.setHarmonyVisuals(val);
    this.lighting.setHarmonyIntensity(val);
  }

  public updateFromPresentation(snapshot: Readonly<PresentationSnapshot>): void {
    if (this.scene.fogDensity !== undefined) {
      this.scene.fogDensity = snapshot.atmosphere.fogDensity;
    }
    this.applyHarmonyVisuals(snapshot.sky.skyBlend);
  }

  public dispose(): void {
    this.livingValleyComposition.dispose();
    this.worldProps.dispose();
    this.ribbonPath.dispose();
    this.skyDome.dispose();
    this.groundMesh.dispose();
  }
}
