import { Scene, ShaderMaterial, Texture, Vector3, Color3 } from '@babylonjs/core';

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
varying vec2 vUV;
varying vec4 vVertexColor;
varying float vGroundInjection;

void main() {
  vWorldNormal = normalize((world * vec4(normal, 0.0)).xyz);
  vUV = uv;
  vVertexColor = color;
  vGroundInjection = groundInjection;
  gl_Position = worldViewProjection * vec4(position, 1.0);
}
`;

const FRAGMENT_SOURCE = `
precision highp float;

varying vec3 vWorldNormal;
varying vec2 vUV;
varying vec4 vVertexColor;
varying float vGroundInjection;

uniform sampler2D uMeadowTex;
uniform sampler2D uEarthTex;
uniform sampler2D uStoneTex;

uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;

// Cheap per-pixel hash for anti-tiling UV jitter (mirrors the CPU-side hash
// noise already used in organic-noise.ts, kept consistent across the codebase).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 N = normalize(vWorldNormal);

  // Slope factor: 0 = flat ground, 1 = vertical wall face.
  float slope = 1.0 - clamp(dot(N, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
  float stoneMix = smoothstep(0.35, 0.65, slope);

  // Anti-tiling: blend a detail-scale sample with a macro-scale sample
  // offset by a low-frequency hash so the repeating grid doesn't line up
  // across the terrain's 480-unit width.
  vec2 jitter = (vec2(hash(floor(vUV * 6.0)), hash(floor(vUV * 6.0) + 17.0)) - 0.5) * 0.12;
  vec4 meadowDetail = texture2D(uMeadowTex, vUV * 18.0);
  vec4 meadowMacro = texture2D(uMeadowTex, vUV * 3.0 + jitter);
  vec4 meadow = mix(meadowDetail, meadowMacro, 0.5);

  vec4 earth = texture2D(uEarthTex, vUV * 14.0 + jitter * 0.5);
  vec4 stone = texture2D(uStoneTex, vUV * 10.0);

  // vVertexColor.a carries the precise floor->rim rise curve computed in
  // createValleyFloor() (Checkpoint A) - reused here as the meadow/earth
  // macro-zone control instead of re-deriving it from world position.
  float riseCurve = vVertexColor.a;
  // vGroundInjection (Checkpoint C): baked per-vertex by nearby rocks/trees at
  // world-build time (see computeGroundInjectionPoints in
  // living-valley-composition.ts) - locally overrides the meadow/earth split
  // so exposed dirt reads under canopies and around rock fragments, at zero
  // extra runtime cost (no per-pixel object lookups).
  float earthMix = max(smoothstep(0.15, 0.55, riseCurve), vGroundInjection);
  vec4 groundBlend = mix(meadow, earth, earthMix);
  vec3 albedo = mix(groundBlend.rgb, stone.rgb, stoneMix);

  // Basic Lambertian lighting: this material bypasses Babylon's automatic
  // light binding, so ambient + one directional term are computed manually
  // to stay visually consistent with the rest of the (StandardMaterial-lit) scene.
  float ndotl = max(dot(N, normalize(-uLightDirection)), 0.0);
  vec3 lit = albedo * (uAmbientColor + uLightColor * ndotl);

  // Checkpoint A boundary concealment: only the outermost rim fades toward
  // vVertexColor.rgb (which is itself the sage->bluff->fog gradient), so
  // textures stay fully readable near the track and dissolve into the same
  // atmospheric haze color at the world's edge as before.
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

/**
 * Custom ground-splat ShaderMaterial: blends meadow/earth/stone CC0 albedo
 * textures using the terrain's own vertex color (Checkpoint A's rise-curve
 * and rim-fade data) plus a slope-driven stone override for steep faces.
 * Bypasses Babylon's StandardMaterial entirely, so lighting is replicated
 * manually (single directional term + ambient) to match the rest of the scene.
 */
export function createTerrainSplatMaterial(
  name: string,
  scene: Scene,
  textures: TerrainSplatTextures,
  lightDirection: Vector3,
  lightColor: Color3,
  ambientColor: Color3
): ShaderMaterial {
  const material = new ShaderMaterial(
    name,
    scene,
    { vertexSource: VERTEX_SOURCE, fragmentSource: FRAGMENT_SOURCE },
    {
      attributes: ['position', 'normal', 'uv', 'color', 'groundInjection'],
      uniforms: ['world', 'worldViewProjection', 'uLightDirection', 'uLightColor', 'uAmbientColor'],
      samplers: ['uMeadowTex', 'uEarthTex', 'uStoneTex'],
    }
  );

  const meadowTex = new Texture(textures.meadowAlbedo, scene);
  const earthTex = new Texture(textures.earthAlbedo, scene);
  const stoneTex = new Texture(textures.stoneAlbedo, scene);
  meadowTex.uScale = meadowTex.vScale = 1;
  earthTex.uScale = earthTex.vScale = 1;
  stoneTex.uScale = stoneTex.vScale = 1;

  material.setTexture('uMeadowTex', meadowTex);
  material.setTexture('uEarthTex', earthTex);
  material.setTexture('uStoneTex', stoneTex);
  material.setVector3('uLightDirection', lightDirection);
  material.setColor3('uLightColor', lightColor);
  material.setColor3('uAmbientColor', ambientColor);
  material.backFaceCulling = true;

  return material;
}
