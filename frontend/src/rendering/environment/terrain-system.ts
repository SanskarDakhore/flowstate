import { Scene, Mesh, Vector3, Color3 } from '@babylonjs/core';
import { BiomeConfig, LIVING_VALLEY_BIOME_CONFIG } from './biome-config';
import { TerrainGeometry, GroundInjectionPoint } from './terrain-geometry';
import { TerrainSplatMaterial } from './terrain-splat-material';
import { FlowPath } from '../../game/movement/flow-path';
import { LIVING_VALLEY_CONFIG } from './living-valley-config';

export class TerrainSystem {
  private scene: Scene;
  private config: BiomeConfig;
  private terrainMesh: Mesh | null = null;
  private splatMaterial: TerrainSplatMaterial;

  constructor(
    scene: Scene,
    config: BiomeConfig = LIVING_VALLEY_BIOME_CONFIG,
    lightDirection?: Vector3,
    lightColor?: Color3,
    ambientColor?: Color3
  ) {
    this.scene = scene;
    this.config = config;

    this.splatMaterial = new TerrainSplatMaterial(
      'terrainSplatMat',
      scene,
      config,
      lightDirection,
      lightColor,
      ambientColor
    );
  }

  /**
   * Generates or regenerates terrain mesh topology integrated with the active track spline.
   */
  public buildTerrain(flowPath?: FlowPath, injectionPoints: GroundInjectionPoint[] = []): Mesh {
    if (this.terrainMesh) {
      this.terrainMesh.dispose();
      this.terrainMesh = null;
    }

    const { width, length, subdivisionsX, subdivisionsZ, baseDepth } = LIVING_VALLEY_CONFIG.terrain;

    this.terrainMesh = TerrainGeometry.createTerrainMesh(
      'terrainSystemMesh',
      this.scene,
      width,
      length,
      subdivisionsX,
      subdivisionsZ,
      baseDepth,
      this.config,
      flowPath,
      injectionPoints
    );

    this.terrainMesh.material = this.splatMaterial;
    return this.terrainMesh;
  }

  /**
   * Hot-swaps biome configuration seamlessly on the fly.
   */
  public updateBiome(newConfig: BiomeConfig): void {
    this.config = newConfig;
    this.splatMaterial.applyBiomeConfig(newConfig);
  }

  public setLighting(lightDirection: Vector3, lightColor: Color3, ambientColor: Color3): void {
    this.splatMaterial.setVector3('uLightDirection', lightDirection);
    this.splatMaterial.setColor3('uLightColor', lightColor);
    this.splatMaterial.setColor3('uAmbientColor', ambientColor);
  }

  public getMesh(): Mesh | null {
    return this.terrainMesh;
  }

  public getMaterial(): TerrainSplatMaterial {
    return this.splatMaterial;
  }

  public dispose(): void {
    if (this.terrainMesh) {
      this.terrainMesh.dispose();
      this.terrainMesh = null;
    }
    this.splatMaterial.dispose(true, true);
  }
}
