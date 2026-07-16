import { Scene, ShaderMaterial, Color3, Vector3 } from '@babylonjs/core';

const VERTEX_SOURCE = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 world;
uniform mat4 worldViewProjection;
uniform float uTime;
uniform vec3 uPlayerPosition;
uniform float uEnvironmentInfluenceRadius;
uniform float uMaxBendingAngle;
uniform float uPetalVibrationScale;
uniform float uWindStrength;

varying vec3 vWorldNormal;
varying vec4 vVertexColor;

void main() {
  vec3 worldPos = (world * vec4(position, 1.0)).xyz;
  vec3 transformed = position;

  // Vertex color channels:
  // color.r = phase offset
  // color.g = tint variance
  // color.b = flower petal flag (1.0 = petal/flower node, 0.0 = stem/grass)
  // color.a = height flex mask (0.0 at root, 1.0 at tip)
  float phase = color.r * 6.2831853;
  float flexMask = color.a;
  float isFlowerPetal = color.b;

  // Baseline ambient wind sway
  float windWave = sin(uTime * 2.5 + phase) * cos(uTime * 1.1 + phase * 0.5);
  transformed.x += windWave * flexMask * uWindStrength;
  transformed.z += windWave * flexMask * uWindStrength * 0.6;

  // Proximity Vector Field Deformation
  vec3 rVec = worldPos - uPlayerPosition;
  float dist = length(rVec);
  float radius = max(uEnvironmentInfluenceRadius, 0.001);

  if (dist < radius && dist > 0.0001) {
    vec3 rHat = normalize(rVec);
    float normDist = dist / radius;
    float attenuation = pow(1.0 - normDist, 2.0);
    float bendAmount = uMaxBendingAngle * attenuation * flexMask;

    // Displace outward away from player
    transformed.x += rHat.x * bendAmount;
    transformed.y += rHat.y * bendAmount * 0.2;
    transformed.z += rHat.z * bendAmount;

    // High-frequency petal/flower node vibration accentuation
    if (isFlowerPetal > 0.5) {
      float vibWave = sin(uTime * 18.0 + phase) * uPetalVibrationScale * attenuation;
      transformed.x += vibWave;
      transformed.z += vibWave * 0.8;
    }
  }

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
  float ndotl = max(dot(N, normalize(-uLightDirection)), 0.5);

  float variance = 0.85 + vVertexColor.g * 0.3;
  vec3 albedo = uBaseColor * variance;
  vec3 lit = albedo * (uAmbientColor + uLightColor * ndotl);

  gl_FragColor = vec4(lit, 1.0);
}
`;

export interface InteractiveVegetationMaterialHandle {
  material: ShaderMaterial;
  setPlayerPosition: (x: number, y: number, z: number) => void;
  setInfluenceRadius: (radius: number) => void;
  setMaxBendingAngle: (angle: number) => void;
  setPetalVibrationScale: (scale: number) => void;
  setTime: (seconds: number) => void;
}

export function createInteractiveVegetationMaterial(
  name: string,
  scene: Scene,
  baseColor: Color3,
  lightDirection: Vector3,
  lightColor: Color3,
  ambientColor: Color3
): InteractiveVegetationMaterialHandle {
  const material = new ShaderMaterial(
    name,
    scene,
    { vertexSource: VERTEX_SOURCE, fragmentSource: FRAGMENT_SOURCE },
    {
      attributes: ['position', 'normal', 'color'],
      uniforms: [
        'world',
        'worldViewProjection',
        'uTime',
        'uPlayerPosition',
        'uEnvironmentInfluenceRadius',
        'uMaxBendingAngle',
        'uPetalVibrationScale',
        'uWindStrength',
        'uBaseColor',
        'uLightDirection',
        'uLightColor',
        'uAmbientColor',
      ],
      samplers: [],
    }
  );

  material.setFloat('uTime', 0);
  material.setVector3('uPlayerPosition', new Vector3(0, 0, 0));
  material.setFloat('uEnvironmentInfluenceRadius', 2.8);
  material.setFloat('uMaxBendingAngle', 0.65);
  material.setFloat('uPetalVibrationScale', 0.15);
  material.setFloat('uWindStrength', 0.18);
  material.setColor3('uBaseColor', baseColor);
  material.setVector3('uLightDirection', lightDirection);
  material.setColor3('uLightColor', lightColor);
  material.setColor3('uAmbientColor', ambientColor);
  material.backFaceCulling = false;

  return {
    material,
    setPlayerPosition: (x: number, y: number, z: number) =>
      material.setVector3('uPlayerPosition', new Vector3(x, y, z)),
    setInfluenceRadius: (radius: number) => material.setFloat('uEnvironmentInfluenceRadius', radius),
    setMaxBendingAngle: (angle: number) => material.setFloat('uMaxBendingAngle', angle),
    setPetalVibrationScale: (scale: number) => material.setFloat('uPetalVibrationScale', scale),
    setTime: (seconds: number) => material.setFloat('uTime', seconds),
  };
}
