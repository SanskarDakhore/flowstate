import { Scene, HemisphericLight, DirectionalLight, Vector3, Color3 } from '@babylonjs/core';

export class GameplayLighting {
  private hemiLight: HemisphericLight;
  private dirLight: DirectionalLight;

  constructor(scene: Scene) {
    this.hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    this.hemiLight.intensity = 0.4;
    this.hemiLight.groundColor = new Color3(0.05, 0.05, 0.1);

    this.dirLight = new DirectionalLight('dirLight', new Vector3(-1, -2, 1), scene);
    this.dirLight.intensity = 0.6;
  }

  public setHarmonyIntensity(normalizedHarmony: number): void {
    const clamped = Math.max(0, Math.min(1, normalizedHarmony));
    this.hemiLight.intensity = 0.3 + clamped * 0.5;
    this.dirLight.intensity = 0.5 + clamped * 0.7;
  }

  public dispose(): void {
    this.hemiLight.dispose();
    this.dirLight.dispose();
  }
}
