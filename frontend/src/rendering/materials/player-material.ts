import { Scene, StandardMaterial, Color3 } from '@babylonjs/core';

export class PlayerMaterialFactory {
  public static createPlayerMaterial(name: string, scene: Scene): StandardMaterial {
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = new Color3(0.2, 0.8, 1.0);
    mat.emissiveColor = new Color3(0.1, 0.6, 0.9);
    mat.specularColor = new Color3(1.0, 1.0, 1.0);
    return mat;
  }
}
