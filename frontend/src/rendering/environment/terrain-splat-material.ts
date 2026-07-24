import { Scene, ShaderMaterial, Texture, Vector3, Color3, Vector4 } from '@babylonjs/core';
import { BiomeConfig } from './biome-config';

const VERTEX_SOURCE = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 color;
attribute float groundInjection;

uniform mat4 world;
uniform mat4 worldViewProjection;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUV;
varying vec4 vVertexColor;
varying float vGroundInjection;
varying float vSlope;

void main() {
  vec4 wPos = world * vec4(position, 1.0);
  vWorldPosition = wPos.xyz;
  vWorldNormal = normalize((world * vec4(normal, 0.0)).xyz);
  vUV = uv;
  vVertexColor = color;
  vGroundInjection = groundInjection;

  // Slope factor: 0 = flat ground, 1 = vertical wall face
  vSlope = 1.0 - clamp(dot(vWorldNormal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

  gl_Position = worldViewProjection * vec4(position, 1.0);
}
`;

const FRAGMENT_SOURCE = `
precision highp float;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUV;
varying vec4 vVertexColor;
varying float vGroundInjection;
varying float vSlope;

uniform sampler2D tBaseDiffuse;
uniform sampler2D tPrimaryDiffuse;
uniform sampler2D tAccentDiffuse;
uniform sampler2D tSteepDiffuse;

uniform vec4 uScales;
uniform vec3 uMacroHighTint;
uniform vec3 uMacroLowTint;
uniform float uMacroScale;
uniform float uSlopeThreshold;
uniform float uSlopeTransition;

uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;

// Per-pixel 2D value noise for macro color variation & anti-tiling jitter
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float perlinNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y
  );
}

// Height-contrast blending between two texture samples
vec4 heightBlend(vec4 col1, float h1, vec4 col2, float h2, float blendFactor) {
  float heightContrast = 0.2;
  float ma = max(h1 + (1.0 - blendFactor), h2 + blendFactor) - heightContrast;
  float b1 = max(h1 + (1.0 - blendFactor) - ma, 0.0);
  float b2 = max(h2 + blendFactor - ma, 0.0);
  return (col1 * b1 + col2 * b2) / max(b1 + b2, 0.0001);
}

void main() {
  vec3 N = normalize(vWorldNormal);
  vec2 uvBase = vWorldPosition.xz;

  // Anti-tiling jitter offset
  vec2 jitter = (vec2(hash(floor(vUV * 6.0)), hash(floor(vUV * 6.0) + 17.0)) - 0.5) * 0.12;

  // 1. Base Layer (Dirt / Soil)
  vec4 cBase = texture2D(tBaseDiffuse, vUV * uScales.x + jitter * 0.5);
  float hBase = cBase.a > 0.01 ? cBase.a : cBase.r;

  // 2. Primary Layer (Meadow Grass)
  vec4 cPrimaryDetail = texture2D(tPrimaryDiffuse, vUV * uScales.y);
  vec4 cPrimaryMacro  = texture2D(tPrimaryDiffuse, vUV * (uScales.y * 0.2) + jitter);
  vec4 cPrimary = mix(cPrimaryDetail, cPrimaryMacro, 0.4);
  float hPrimary = cPrimary.a > 0.01 ? cPrimary.a : cPrimary.r;

  // 3. Accent Layer (Moss / Damp Earth)
  vec4 cAccent = texture2D(tAccentDiffuse, vUV * uScales.z + jitter * 0.3);
  float hAccent = cAccent.a > 0.01 ? cAccent.a : cAccent.r;

  // 4. Steep Layer (Crag Rock)
  vec4 cSteep = texture2D(tSteepDiffuse, vUV * uScales.w);
  float hSteep = cSteep.a > 0.01 ? cSteep.a : cSteep.r;

  // Blend Primary (Grass) onto Base (Dirt) using riseCurve & groundInjection
  float riseCurve = vVertexColor.a;
  float earthMix = max(smoothstep(0.15, 0.55, riseCurve), vGroundInjection);
  vec4 blendedGround = heightBlend(cPrimary, hPrimary, cBase, hBase, earthMix);

  // Accent blending (Moss/Damp Earth in mid-height micro-noise areas)
  float accentWeight = smoothstep(0.3, 0.7, perlinNoise(uvBase * 0.08));
  blendedGround = heightBlend(blendedGround, hPrimary, cAccent, hAccent, accentWeight * 0.4);

  // Slope Blending for Cliffs (Steep Crag Rock)
  float cliffFactor = smoothstep(uSlopeThreshold - uSlopeTransition, uSlopeThreshold + uSlopeTransition, vSlope);
  vec4 finalAlbedo = heightBlend(blendedGround, 0.5, cSteep, hSteep, cliffFactor);

  // Macro Color Variation across terrain expanse
  float macroNoise = perlinNoise(uvBase * uMacroScale);
  vec3 tint = mix(uMacroLowTint, uMacroHighTint, macroNoise);
  finalAlbedo.rgb *= tint;

  // Lighting computation (Lambertian key light + sky ambient)
  float ndotl = max(dot(N, normalize(-uLightDirection)), 0.0);
  vec3 lit = finalAlbedo.rgb * (uAmbientColor + uLightColor * ndotl);

  // Atmospheric horizon rim fade (Checkpoint A boundary concealment)
  float rimFade = smoothstep(0.55, 1.0, riseCurve);
  lit = mix(lit, vVertexColor.rgb, rimFade);

  gl_FragColor = vec4(lit, 1.0);
}
`;

export interface TerrainSplatTextures {
  meadowAlbedo: string;
  earthAlbedo: string;
  stoneAlbedo: string;
}

export class TerrainSplatMaterial extends ShaderMaterial {
  constructor(
    name: string,
    scene: Scene,
    config: BiomeConfig,
    lightDirection: Vector3 = new Vector3(-0.6, -0.35, 0.7),
    lightColor: Color3 = new Color3(1.0, 0.85, 0.65),
    ambientColor: Color3 = new Color3(0.3, 0.35, 0.4)
  ) {
    super(
      name,
      scene,
      { vertexSource: VERTEX_SOURCE, fragmentSource: FRAGMENT_SOURCE },
      {
        attributes: ['position', 'normal', 'uv', 'color', 'groundInjection'],
        uniforms: [
          'world',
          'worldViewProjection',
          'uScales',
          'uMacroHighTint',
          'uMacroLowTint',
          'uMacroScale',
          'uSlopeThreshold',
          'uSlopeTransition',
          'uLightDirection',
          'uLightColor',
          'uAmbientColor',
        ],
        samplers: ['tBaseDiffuse', 'tPrimaryDiffuse', 'tAccentDiffuse', 'tSteepDiffuse'],
      }
    );

    this.applyBiomeConfig(config, lightDirection, lightColor, ambientColor);
  }

  public applyBiomeConfig(
    config: BiomeConfig,
    lightDirection: Vector3 = new Vector3(-0.6, -0.35, 0.7),
    lightColor: Color3 = new Color3(1.0, 0.85, 0.65),
    ambientColor: Color3 = new Color3(0.3, 0.35, 0.4)
  ): void {
    const scene = this.getScene();

    const baseTex = new Texture(config.layers.base.diffuseMap, scene);
    const primaryTex = new Texture(config.layers.primary.diffuseMap, scene);
    const accentTex = new Texture(config.layers.accent.diffuseMap, scene);
    const steepTex = new Texture(config.layers.steep.diffuseMap, scene);

    baseTex.uScale = baseTex.vScale = 1;
    primaryTex.uScale = primaryTex.vScale = 1;
    accentTex.uScale = accentTex.vScale = 1;
    steepTex.uScale = steepTex.vScale = 1;

    this.setTexture('tBaseDiffuse', baseTex);
    this.setTexture('tPrimaryDiffuse', primaryTex);
    this.setTexture('tAccentDiffuse', accentTex);
    this.setTexture('tSteepDiffuse', steepTex);

    this.setVector4(
      'uScales',
      new Vector4(
        config.layers.base.scale,
        config.layers.primary.scale,
        config.layers.accent.scale,
        config.layers.steep.scale
      )
    );

    this.setColor3('uMacroHighTint', config.macroColor.highTint);
    this.setColor3('uMacroLowTint', config.macroColor.lowTint);
    this.setFloat('uMacroScale', config.macroColor.noiseScale);
    this.setFloat('uSlopeThreshold', config.splatThresholds.slopeThreshold);
    this.setFloat('uSlopeTransition', config.splatThresholds.slopeTransition);

    this.setVector3('uLightDirection', lightDirection);
    this.setColor3('uLightColor', lightColor);
    this.setColor3('uAmbientColor', ambientColor);
    this.backFaceCulling = true;
  }
}

/**
 * Factory helper maintaining backward compatibility for existing callers.
 */
export function createTerrainSplatMaterial(
  name: string,
  scene: Scene,
  textures: TerrainSplatTextures,
  lightDirection: Vector3,
  lightColor: Color3,
  ambientColor: Color3
): ShaderMaterial {
  // Construct a default BiomeConfig using the provided texture paths
  const config: BiomeConfig = {
    id: 'legacy_terrain',
    name: 'Legacy Terrain',
    layers: {
      base: { id: 'earth', diffuseMap: textures.earthAlbedo, scale: 14.0 },
      primary: { id: 'meadow', diffuseMap: textures.meadowAlbedo, scale: 18.0 },
      accent: { id: 'moss', diffuseMap: textures.earthAlbedo, scale: 12.0 },
      steep: { id: 'stone', diffuseMap: textures.stoneAlbedo, scale: 10.0 },
    },
    elevation: { heightScale: 25, noiseScale: 0.05, valleyDepth: -22, riverbedWidth: 40 },
    macroColor: {
      highTint: new Color3(1.0, 1.0, 1.0),
      lowTint: new Color3(0.85, 0.85, 0.85),
      noiseScale: 0.005,
    },
    splatThresholds: { slopeThreshold: 0.5, slopeTransition: 0.15, heightThreshold: 15.0 },
  };

  return new TerrainSplatMaterial(name, scene, config, lightDirection, lightColor, ambientColor);
}
