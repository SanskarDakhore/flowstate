/**
 * Represents the rendering stage within the FLOWSTATE graphics engine.
 */
export enum ShaderPipelineStage {
  BACKGROUND = 'BACKGROUND',
  TERRAIN_BASE = 'TERRAIN_BASE',
  TRACK_SURFACE = 'TRACK_SURFACE',
  KINETIC_GLOW = 'KINETIC_GLOW',
  POST_PROCESS = 'POST_PROCESS',
}

/**
 * Configuration contract for an individual material layer within a splat map.
 */
export interface SplatLayerConfig {
  id: string;
  name: string;
  textureUri: string;
  normalMapUri?: string;
  roughnessMapUri?: string;
  uvScale: [number, number];
  uvRotation: number;
  blendSharpness: number;
}

/**
 * Configuration contract for terrain splat maps controlling RGBA weight distributions.
 */
export interface TerrainSplatMapConfig {
  splatMapUri: string;
  resolution: [number, number];
  layers: {
    r: SplatLayerConfig;
    g: SplatLayerConfig;
    b: SplatLayerConfig;
    a: SplatLayerConfig;
  };
  triplanarExponent: number;
}

/**
 * Data layout for dynamic uniforms passed into the Splat Shader Material.
 * Structured to align with std140 uniform buffer layout constraints.
 */
export interface SplatMaterialUniforms {
  uTime: { value: number };
  uSplatMap: { value: any };
  uLayerBase: { value: any };
  uLayerSecondary: { value: any };
  uLayerDetailRock: { value: any };
  uLayerKineticGlow: { value: any };
  uTilingScales: { value: [number, number, number, number] };
  uTriplanarExponent: { value: number };
  uKineticPulseFrequency: { value: number };
  uKineticPulseIntensity: { value: number };
  uKineticGlowColor: { value: [number, number, number] };
  uLightDirection: { value: [number, number, number] };
  uLightColor: { value: [number, number, number] };
  uAmbientColor: { value: [number, number, number] };
  uMistDensity: { value: number };
  uMistColor: { value: [number, number, number] };
}
