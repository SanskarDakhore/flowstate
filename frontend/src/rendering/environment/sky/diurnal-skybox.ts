import { Scene, Color3, Vector3, DirectionalLight, HemisphericLight } from '@babylonjs/core';

export interface DiurnalSkyState {
  readonly sunElevationDeg: number;
  readonly zenithColor: Color3;
  readonly horizonColor: Color3;
  readonly fogDensity: number;
  readonly sunVector: Vector3;
}

export class DiurnalSkybox {
  private scene: Scene;
  private sunLight: DirectionalLight | null = null;
  private ambientLight: HemisphericLight | null = null;
  private timeOfDaySeconds: number = 0;
  private dayDurationSeconds: number = 300; // 5-minute day/night cycle

  constructor(scene: Scene) {
    this.scene = scene;
    this.setupAtmosphericLighting();
  }

  private setupAtmosphericLighting(): void {
    // 1. Scene Fog Setup
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.005;
    this.scene.fogColor = new Color3(0.6, 0.7, 0.8);

    // 2. Direct Sun Light
    this.sunLight = new DirectionalLight('sunLight', new Vector3(-0.4, -0.8, -0.4), this.scene);
    this.sunLight.intensity = 1.2;

    // 3. Ambient Hemisphere Light
    this.ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
    this.ambientLight.intensity = 0.6;
    this.ambientLight.groundColor = new Color3(0.2, 0.2, 0.25);
  }

  public update(deltaTimeSeconds: number, ecosystemHealth: number): DiurnalSkyState {
    this.timeOfDaySeconds = (this.timeOfDaySeconds + deltaTimeSeconds) % this.dayDurationSeconds;
    const dayProgress = this.timeOfDaySeconds / this.dayDurationSeconds; // [0, 1]
    const sunAngleRad = dayProgress * Math.PI * 2.0;

    const sunElevationDeg = Math.sin(sunAngleRad) * 90.0;
    const isDay = sunElevationDeg > 0;

    // Calculate Sun Vector
    const sunX = Math.cos(sunAngleRad) * 0.5;
    const sunY = Math.sin(sunAngleRad);
    const sunZ = 0.5;
    const sunDir = new Vector3(-sunX, -Math.max(0.1, sunY), -sunZ).normalize();

    if (this.sunLight) {
      this.sunLight.direction = sunDir;
      this.sunLight.intensity = isDay ? 1.0 + Math.sin(sunAngleRad) * 0.5 : 0.2;
    }

    // Ecosystem Health Modifiers
    const healthRatio = Math.max(0, Math.min(1.0, ecosystemHealth / 100.0));

    // Dynamic Zenith & Horizon Colors
    let zenithColor: Color3;
    let horizonColor: Color3;

    if (isDay) {
      // Golden Hour vs Azure Noon
      const zenithBlend = Math.sin(sunAngleRad);
      zenithColor = Color3.Lerp(
        new Color3(0.35, 0.55, 0.85), // Azure
        new Color3(0.15, 0.45, 0.80), // Deep Sky
        zenithBlend
      );

      // Horizon shifts from muted grey to vibrant warm sunset/emerald horizon
      horizonColor = Color3.Lerp(
        new Color3(0.4, 0.45, 0.5), // Dormant Grey Horizon
        new Color3(0.2 + healthRatio * 0.3, 0.8, 0.6), // Vibrant Emerald Horizon
        healthRatio
      );
    } else {
      // Night Sky
      zenithColor = new Color3(0.04, 0.06, 0.12);
      horizonColor = new Color3(0.08, 0.12, 0.20);
    }

    // Clear fog as ecosystem health improves
    const baseFog = isDay ? 0.008 : 0.015;
    const targetFogDensity = Math.max(0.002, baseFog * (1.0 - healthRatio * 0.6));
    this.scene.fogDensity = targetFogDensity;
    this.scene.fogColor = horizonColor;
    this.scene.clearColor = zenithColor.toColor4(1.0);

    return {
      sunElevationDeg,
      zenithColor,
      horizonColor,
      fogDensity: targetFogDensity,
      sunVector: sunDir,
    };
  }

  public dispose(): void {
    if (this.sunLight) this.sunLight.dispose();
    if (this.ambientLight) this.ambientLight.dispose();
  }
}
