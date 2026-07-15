import { Scene, ShaderMaterial, Color3, Vector3 } from '@babylonjs/core';

const VERTEX_SOURCE = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 world;
uniform mat4 worldViewProjection;
uniform float uTime;
uniform float uWindStrength;

varying vec3 vWorldNormal;
varying vec4 vVertexColor;

void main() {
  vec3 transformed = position;

  // color.r = per-blade phase offset (0..1 -> 0..2*PI), color.a = height flex
  // mask (0 at base, 1 at tip) - only the upper part of each blade sways.
  float phase = color.r * 6.2831853;
  float flexMask = color.a;

  float wave = sin(uTime * 2.5 + phase) * cos(uTime * 1.1 + phase * 0.5);
  transformed.x += wave * flexMask * uWindStrength;
  transformed.z += wave * flexMask * uWindStrength * 0.6;

  vWorldNormal = normalize((world * vec4(normal, 0.0)).xyz);
  vVertexColor = color;
  gl_Position = worldViewProjection * vec4(transformed, 1.0);
}
`;

const FRAGMENT_SOURCE = `
precision highp float;

varying vec3 vWorldNormal;
varying vec4 vVertexColor;

uniform vec3 uBaseColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;

void main() {
  vec3 N = normalize(vWorldNormal);
  // Thin single-sided-quad geometry reads harshly with pure Lambertian
  // shading (near-black at grazing angles), so lighting is floored at 0.5.
  float ndotl = max(dot(N, normalize(-uLightDirection)), 0.5);

  // color.g = per-clump tint variance so identical blades don't look pasted.
  float variance = 0.85 + vVertexColor.g * 0.3;
  vec3 albedo = uBaseColor * variance;
  vec3 lit = albedo * (uAmbientColor + uLightColor * ndotl);

  gl_FragColor = vec4(lit, 1.0);
}
`;

export interface GrassWindMaterialHandle {
  material: ShaderMaterial;
  setTime: (seconds: number) => void;
}

/**
 * Custom wind-animated ShaderMaterial for grass blade clumps. Bypasses
 * StandardMaterial/automatic light binding entirely, so lighting is
 * replicated manually (ambient + one directional term) to stay visually
 * consistent with the rest of the scene, same approach as the terrain splat
 * material. `backFaceCulling` is off since each blade is a single flat quad.
 */
export function createGrassWindMaterial(
  name: string,
  scene: Scene,
  baseColor: Color3,
  lightDirection: Vector3,
  lightColor: Color3,
  ambientColor: Color3
): GrassWindMaterialHandle {
  const material = new ShaderMaterial(
    name,
    scene,
    { vertexSource: VERTEX_SOURCE, fragmentSource: FRAGMENT_SOURCE },
    {
      attributes: ['position', 'normal', 'color'],
      uniforms: ['world', 'worldViewProjection', 'uTime', 'uWindStrength', 'uBaseColor', 'uLightDirection', 'uLightColor', 'uAmbientColor'],
      samplers: [],
    }
  );

  material.setFloat('uTime', 0);
  material.setFloat('uWindStrength', 0.18);
  material.setColor3('uBaseColor', baseColor);
  material.setVector3('uLightDirection', lightDirection);
  material.setColor3('uLightColor', lightColor);
  material.setColor3('uAmbientColor', ambientColor);
  material.backFaceCulling = false;

  return {
    material,
    setTime: (seconds: number) => material.setFloat('uTime', seconds),
  };
}
