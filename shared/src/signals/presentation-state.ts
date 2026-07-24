import { AudioState, createDefaultAudioState } from './audio-state';
import { PresentationWeatherState, createDefaultPresentationWeatherState } from './weather-state';
import { PresentationWildlifeState, createDefaultPresentationWildlifeState } from './wildlife-state';
import { PresentationEventState, createDefaultPresentationEventState } from './event-state';
import { PresentationBiomeState, createDefaultPresentationBiomeState } from './biome-state';
import { VolumetricLightingState, createDefaultVolumetricLightingState } from './atmosphere-volumetrics-state';
import { InstancedVegetationShaderState, createDefaultInstancedVegetationShaderState } from './instanced-vegetation-state';
import { ParticleFieldShaderState, createDefaultParticleFieldShaderState } from './particle-field-state';

export interface RenderFrameContext {
  readonly deltaTime: number;
  readonly frameIndex: number;
  readonly qualityTier: 'low' | 'medium' | 'high';
}

export interface LightingState {
  readonly sunIntensity: number;
  readonly ambientColorHex: string;
  readonly colorTemperature: number;
}

export interface SkyState {
  readonly skyBlend: number;
  readonly starOpacity: number;
  readonly cloudBlend: number;
}

export interface TerrainState {
  readonly colorGrading: number;
  readonly wetness: number;
}

export interface VegetationState {
  readonly grassDensity: number;
  readonly grassColorHex: string;
  readonly windStrength: number;
  readonly flowerDensity: number;
  readonly leafDensity: number;
  readonly grassHeight: number;
  readonly treeVitality: number;
  readonly colorVariation: number;
}

export interface AtmosphereState {
  readonly fogDensity: number;
  readonly bloomIntensity: number;
  readonly exposure: number;
}

export interface ParticleState {
  readonly emissionRate: number;
}

export interface CameraState {
  readonly cameraMood: string;
}

export interface PresentationSnapshot {
  readonly lighting: LightingState;
  readonly sky: SkyState;
  readonly terrain: TerrainState;
  readonly vegetation: VegetationState;
  readonly atmosphere: AtmosphereState;
  readonly particles: ParticleState;
  readonly audio: AudioState;
  readonly weather: PresentationWeatherState;
  readonly wildlife: PresentationWildlifeState;
  readonly event: PresentationEventState;
  readonly biome: PresentationBiomeState;
  readonly volumetricLighting: VolumetricLightingState;
  readonly instancedVegetation: InstancedVegetationShaderState;
  readonly particleField: ParticleFieldShaderState;
  readonly camera: CameraState;
  readonly timestamp: number;
}

export function createDefaultPresentationSnapshot(): PresentationSnapshot {
  return {
    lighting: {
      sunIntensity: 0.5,
      ambientColorHex: '#0f172a',
      colorTemperature: 5500,
    },
    sky: {
      skyBlend: 0,
      starOpacity: 0.5,
      cloudBlend: 0.2,
    },
    terrain: {
      colorGrading: 0,
      wetness: 0,
    },
    vegetation: {
      grassDensity: 0,
      grassColorHex: '#00f0ff',
      windStrength: 0.1,
      flowerDensity: 0.0,
      leafDensity: 0.3,
      grassHeight: 0.3,
      treeVitality: 0.5,
      colorVariation: 0.0,
    },
    atmosphere: {
      fogDensity: 0.02,
      bloomIntensity: 0.2,
      exposure: 1.0,
    },
    particles: {
      emissionRate: 0,
    },
    audio: createDefaultAudioState(),
    weather: createDefaultPresentationWeatherState(),
    wildlife: createDefaultPresentationWildlifeState(),
    event: createDefaultPresentationEventState(),
    biome: createDefaultPresentationBiomeState(),
    volumetricLighting: createDefaultVolumetricLightingState(),
    instancedVegetation: createDefaultInstancedVegetationShaderState(),
    particleField: createDefaultParticleFieldShaderState(),
    camera: {
      cameraMood: 'default',
    },
    timestamp: Date.now(),
  };
}








