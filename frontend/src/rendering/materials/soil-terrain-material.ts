import { Scene, ShaderMaterial, Color3, Effect } from '@babylonjs/core';

export class SoilTerrainMaterial {
  private material: ShaderMaterial;
  private currentEcosystemHealth: number = 0;

  private static readonly DEAD_ASH_COLOR = new Color3(0.29, 0.33, 0.38); // #4b5563
  private static readonly EMERALD_SOIL_COLOR = new Color3(0.02, 0.59, 0.41); // #059669

  constructor(name: string, scene: Scene) {
    this.registerShaders();

    this.material = new ShaderMaterial(
      name,
      scene,
      {
        vertex: 'soilTerrain',
        fragment: 'soilTerrain',
      },
      {
        attributes: ['position', 'normal', 'uv'],
        uniforms: ['world', 'worldViewProjection', 'view', 'projection', 'vDeadColor', 'vEmeraldColor', 'uEcosystemHealth'],
      }
    );

    this.material.setColor3('vDeadColor', SoilTerrainMaterial.DEAD_ASH_COLOR);
    this.material.setColor3('vEmeraldColor', SoilTerrainMaterial.EMERALD_SOIL_COLOR);
    this.material.setFloat('uEcosystemHealth', 0.0);
  }

  private registerShaders(): void {
    if (Effect.ShadersStore['soilTerrainVertexShader']) return;

    Effect.ShadersStore['soilTerrainVertexShader'] = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 worldViewProjection;
      uniform mat4 world;

      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec2 vUV;

      void main(void) {
        vec4 outPosition = worldViewProjection * vec4(position, 1.0);
        vPositionW = vec3(world * vec4(position, 1.0));
        vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
        vUV = uv;
        gl_Position = outPosition;
      }
    `;

    Effect.ShadersStore['soilTerrainPixelShader'] = `
      precision highp float;

      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec2 vUV;

      uniform vec3 vDeadColor;
      uniform vec3 vEmeraldColor;
      uniform float uEcosystemHealth; // [0.0, 1.0]

      void main(void) {
        vec3 lightDir = normalize(vec3(0.4, 0.8, -0.4));
        float ndl = max(0.2, dot(vNormalW, lightDir));

        // Smooth transition from Ash Grey to Emerald Soil
        vec3 baseColor = mix(vDeadColor, vEmeraldColor, clamp(uEcosystemHealth, 0.0, 1.0));
        vec3 finalColor = baseColor * ndl;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }

  public setEcosystemHealth(health: number): void {
    const normHealth = Math.max(0, Math.min(1.0, health / 100.0));
    this.currentEcosystemHealth = normHealth;
    this.material.setFloat('uEcosystemHealth', normHealth);
  }

  public getMaterial(): ShaderMaterial {
    return this.material;
  }

  public dispose(): void {
    this.material.dispose();
  }
}
