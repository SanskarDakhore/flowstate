import { SplatMaterialUniforms, TerrainSplatMapConfig } from '@flowstate/shared';

/**
 * Custom GLSL Vertex Shader for FLOWSTATE Terrain Pipeline.
 * Computes world-space positions and normals required for triplanar UV projection.
 */
export const splatVertexShader = /* glsl */ `
  precision highp float;

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    // Compute transformation matrix for normals to handle non-uniform scaling
    mat3 normalMatrixWorld = mat3(modelMatrix);
    vWorldNormal = normalize(normalMatrixWorld * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

/**
 * Custom GLSL Fragment Shader for FLOWSTATE Terrain Pipeline.
 * Implements 4-layer RGBA splat map blending, triplanar UV mapping, and dynamic kinetic glow pulsing.
 */
export const splatFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform sampler2D uSplatMap;
  uniform sampler2D uLayerBase;
  uniform sampler2D uLayerSecondary;
  uniform sampler2D uLayerDetailRock;
  uniform sampler2D uLayerKineticGlow;

  uniform vec4 uTilingScales; // (base, secondary, rock, glow)
  uniform float uTriplanarExponent;
  uniform float uKineticPulseFrequency;
  uniform float uKineticPulseIntensity;
  uniform vec3 uKineticGlowColor;

  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientColor;
  uniform float uMistDensity;
  uniform vec3 uMistColor;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  /**
   * Calculates triplanar blend weights based on normal alignment and power exponent.
   */
  vec3 getTriplanarWeights(vec3 normal, float exponent) {
    vec3 absNorm = abs(normal);
    vec3 weights = pow(absNorm, vec3(exponent));
    float weightSum = weights.x + weights.y + weights.z;
    return weights / max(weightSum, 0.00001);
  }

  /**
   * Samples a texture using orthogonal triplanar projection along world axes.
   */
  vec4 sampleTriplanar(sampler2D tex, vec3 worldPos, vec3 weights, float scale) {
    vec2 uvYZ = worldPos.zy * scale; // Projection on X-axis
    vec2 uvXZ = worldPos.xz * scale; // Projection on Y-axis
    vec2 uvXY = worldPos.xy * scale; // Projection on Z-axis

    vec4 colorX = texture2D(tex, uvYZ);
    vec4 colorY = texture2D(tex, uvXZ);
    vec4 colorZ = texture2D(tex, uvXY);

    return colorX * weights.x + colorY * weights.y + colorZ * weights.z;
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 triWeights = getTriplanarWeights(normal, uTriplanarExponent);

    // 1. Sample RGBA Splat Map to obtain layer coverage weights
    vec4 splatWeights = texture2D(uSplatMap, vUv);
    float weightSum = splatWeights.r + splatWeights.g + splatWeights.b + splatWeights.a;
    if (weightSum > 0.0) {
      splatWeights /= weightSum; // Enforce strict weight normalization
    } else {
      splatWeights = vec4(1.0, 0.0, 0.0, 0.0);
    }

    // 2. Perform Triplanar Texture Sampling for all material layers
    vec4 colBase = sampleTriplanar(uLayerBase, vWorldPosition, triWeights, uTilingScales.x);
    vec4 colSecondary = sampleTriplanar(uLayerSecondary, vWorldPosition, triWeights, uTilingScales.y);
    vec4 colDetailRock = sampleTriplanar(uLayerDetailRock, vWorldPosition, triWeights, uTilingScales.z);
    vec4 colKineticGlow = sampleTriplanar(uLayerKineticGlow, vWorldPosition, triWeights, uTilingScales.w);

    // 3. Composite Surface Diffuse Color from RGBA Splat Layer Weights
    vec3 diffuseComposite = colBase.rgb * splatWeights.r +
                            colSecondary.rgb * splatWeights.g +
                            colDetailRock.rgb * splatWeights.b;

    // 4. Calculate Dynamic Kinetic Energy Glow Emission
    float pulseSine = sin(uTime * uKineticPulseFrequency);
    float pulseHarmonic = sin(uTime * uKineticPulseFrequency * 3.0) * 0.2;
    float pulseFactor = uKineticPulseIntensity * (0.5 + 0.5 * pulseSine + pulseHarmonic);
    vec3 kineticEmission = colKineticGlow.rgb * uKineticGlowColor * splatWeights.a * pulseFactor;

    // 5. Evaluate Directional Shading and Lighting
    vec3 lightDir = normalize(-uLightDirection);
    float NdotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuseLighting = diffuseComposite * (uLightColor * NdotL + uAmbientColor);

    vec3 illuminatedColor = diffuseLighting + kineticEmission;

    // 6. Apply Atmospheric Fog Absorption and Scattering
    float viewDistance = length(vWorldPosition);
    float mistFactor = 1.0 - exp(-viewDistance * uMistDensity);
    mistFactor = clamp(mistFactor, 0.0, 1.0);

    vec3 finalColor = mix(illuminatedColor, uMistColor, mistFactor);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/**
 * Controller class managing the Splat Shader Material instance and dynamic uniform updates.
 */
export class SplatShaderMaterial {
  private typedUniforms: SplatMaterialUniforms;
  public readonly vertexShader: string = splatVertexShader;
  public readonly fragmentShader: string = splatFragmentShader;

  constructor(config?: Partial<TerrainSplatMapConfig>) {
    this.typedUniforms = {
      uTime: { value: 0.0 },
      uSplatMap: { value: null },
      uLayerBase: { value: null },
      uLayerSecondary: { value: null },
      uLayerDetailRock: { value: null },
      uLayerKineticGlow: { value: null },
      uTilingScales: { value: [0.05, 0.05, 0.1, 0.05] },
      uTriplanarExponent: { value: config?.triplanarExponent ?? 4.0 },
      uKineticPulseFrequency: { value: 2.5 },
      uKineticPulseIntensity: { value: 1.5 },
      uKineticGlowColor: { value: [0.0, 0.8, 1.0] },
      uLightDirection: { value: [-0.5, -1.0, -0.5] },
      uLightColor: { value: [1.0, 0.95, 0.8] },
      uAmbientColor: { value: [0.15, 0.18, 0.25] },
      uMistDensity: { value: 0.0025 },
      uMistColor: { value: [0.6, 0.7, 0.8] },
    };
  }

  public get uniforms(): SplatMaterialUniforms {
    return this.typedUniforms;
  }

  /**
   * Updates dynamic uniforms per frame tick.
   * Mutates existing object properties directly to prevent WebGL program re-compilation.
   */
  public updateFrame(
    deltaTime: number,
    absoluteTime: number,
    pulseFreq?: number,
    pulseIntensity?: number
  ): void {
    this.typedUniforms.uTime.value = absoluteTime;

    if (pulseFreq !== undefined) {
      this.typedUniforms.uKineticPulseFrequency.value = pulseFreq;
    }
    if (pulseIntensity !== undefined) {
      this.typedUniforms.uKineticPulseIntensity.value = pulseIntensity;
    }
  }

  /**
   * Dynamically updates directional lighting vectors without invalidating material state.
   */
  public updateLighting(direction: [number, number, number], color: [number, number, number]): void {
    this.typedUniforms.uLightDirection.value[0] = direction[0];
    this.typedUniforms.uLightDirection.value[1] = direction[1];
    this.typedUniforms.uLightDirection.value[2] = direction[2];

    this.typedUniforms.uLightColor.value[0] = color[0];
    this.typedUniforms.uLightColor.value[1] = color[1];
    this.typedUniforms.uLightColor.value[2] = color[2];
  }

  /**
   * Binds underlying WebGL texture instances to splat map material layers.
   */
  public setLayerTextures(
    splatMap: any,
    base: any,
    secondary: any,
    rock: any,
    glow: any
  ): void {
    this.typedUniforms.uSplatMap.value = splatMap;
    this.typedUniforms.uLayerBase.value = base;
    this.typedUniforms.uLayerSecondary.value = secondary;
    this.typedUniforms.uLayerDetailRock.value = rock;
    this.typedUniforms.uLayerKineticGlow.value = glow;
  }

  public dispose(): void {
    this.typedUniforms.uSplatMap.value = null;
    this.typedUniforms.uLayerBase.value = null;
    this.typedUniforms.uLayerSecondary.value = null;
    this.typedUniforms.uLayerDetailRock.value = null;
    this.typedUniforms.uLayerKineticGlow.value = null;
  }
}
