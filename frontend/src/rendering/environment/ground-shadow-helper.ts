import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
  DynamicTexture,
  Vector3,
} from '@babylonjs/core';

/**
 * Reusable GroundShadow presentation helper.
 * Generates a soft radial contact shadow plane with zero per-frame garbage allocations.
 * Kept strictly inside the rendering presentation layer.
 */
export class GroundShadowHelper {
  private shadowMesh: Mesh;
  private shadowMaterial: StandardMaterial;
  private shadowTexture: DynamicTexture;

  constructor(scene: Scene, id: string = 'playerGroundShadow', diameter: number = 1.8) {
    // 1. Create flat horizontal plane mesh
    this.shadowMesh = MeshBuilder.CreatePlane(id, { size: diameter }, scene);
    this.shadowMesh.rotation.x = Math.PI / 2; // Flat on XZ plane
    this.shadowMesh.isPickable = false;

    // 2. Procedural soft radial gradient opacity texture (256x256)
    const textureSize = 256;
    this.shadowTexture = new DynamicTexture(
      `${id}_texture`,
      { width: textureSize, height: textureSize },
      scene,
      false
    );

    const ctx = this.shadowTexture.getContext();
    if (ctx) {
      const half = textureSize / 2;

      ctx.clearRect(0, 0, textureSize, textureSize);
      const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(0.70, 'rgba(255, 255, 255, 0.25)');
      gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(half, half, half, 0, Math.PI * 2);
      ctx.fill();
      this.shadowTexture.update();
    }

    this.shadowTexture.hasAlpha = true;
    this.shadowTexture.getAlphaFromRGB = true;

    // 3. Ground Shadow Material
    this.shadowMaterial = new StandardMaterial(`${id}_mat`, scene);
    this.shadowMaterial.diffuseColor = Color3.FromHexString('#2A1D16'); // Warm umber shadow tone
    this.shadowMaterial.emissiveColor = new Color3(0, 0, 0);
    this.shadowMaterial.specularColor = new Color3(0, 0, 0);
    this.shadowMaterial.opacityTexture = this.shadowTexture;
    this.shadowMaterial.alpha = 0.35;
    this.shadowMaterial.backFaceCulling = false;
    this.shadowMaterial.zOffset = -2; // Mitigate z-fighting over terrain ribbon

    this.shadowMesh.material = this.shadowMaterial;
  }

  /**
   * Updates contact shadow position (snapped slightly above track/terrain Y offset).
   */
  public updatePosition(x: number, groundY: number, z: number): void {
    this.shadowMesh.position.set(x, groundY + 0.04, z);
  }

  public setAlpha(alpha: number): void {
    this.shadowMaterial.alpha = Math.max(0, Math.min(1, alpha));
  }

  public setVisible(visible: boolean): void {
    this.shadowMesh.isVisible = visible;
  }

  public dispose(): void {
    this.shadowTexture.dispose();
    this.shadowMaterial.dispose();
    this.shadowMesh.dispose();
  }
}
