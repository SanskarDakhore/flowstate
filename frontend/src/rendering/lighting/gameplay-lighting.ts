import { Scene, HemisphericLight, DirectionalLight, Vector3, Color3 } from '@babylonjs/core';
import { GOLDEN_HOUR_VALLEY_PALETTE } from '../environment/living-valley-config';

export class GameplayLighting {
  private hemiLight: HemisphericLight;
  private dirLight: DirectionalLight;

  constructor(scene: Scene) {
    // 1. Warm Golden-Hour Ambient Sky & Umber Ground Fill
    this.hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    this.hemiLight.intensity = 0.40;
    this.hemiLight.diffuse = GOLDEN_HOUR_VALLEY_PALETTE.ambientSky.clone();
    this.hemiLight.groundColor = GOLDEN_HOUR_VALLEY_PALETTE.ambientGround.clone();

    // 2. Low-angle Warm Golden Sun Directional Raking Key Light (-0.6, -0.35, 0.7)
    this.dirLight = new DirectionalLight('dirLight', new Vector3(-0.6, -0.35, 0.7), scene);
    this.dirLight.intensity = 0.60;
    this.dirLight.diffuse = GOLDEN_HOUR_VALLEY_PALETTE.sunlightKey.clone();
  }

  public setHarmonyIntensity(normalizedHarmony: number): void {
    const clamped = Math.max(0, Math.min(1, normalizedHarmony));
    this.hemiLight.intensity = 0.40 + clamped * 0.20;
    this.dirLight.intensity = 0.60 + clamped * 0.55;
  }

  public dispose(): void {
    this.hemiLight.dispose();
    this.dirLight.dispose();
  }
}
