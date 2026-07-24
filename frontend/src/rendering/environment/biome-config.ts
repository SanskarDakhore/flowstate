import { Color3 } from '@babylonjs/core';
import { GOLDEN_HOUR_VALLEY_PALETTE } from './living-valley-config';

export interface TerrainLayer {
  id: string;
  diffuseMap: string;
  normalMap?: string;
  roughnessMap?: string;
  heightMap?: string;
  scale: number;
}

export interface BiomeConfig {
  id: string;
  name: string;
  layers: {
    base: TerrainLayer;    // Dirt / Soil
    primary: TerrainLayer; // Grass / Meadow
    accent: TerrainLayer;  // Moss / Damp Earth
    steep: TerrainLayer;   // Rock / Crag Face
  };
  elevation: {
    heightScale: number;
    noiseScale: number;
    valleyDepth: number;
    riverbedWidth: number;
  };
  macroColor: {
    highTint: Color3;
    lowTint: Color3;
    noiseScale: number;
  };
  splatThresholds: {
    slopeThreshold: number;  // Slope ratio where rock face begins
    slopeTransition: number; // Transition smoothness zone
    heightThreshold: number; // Height threshold where accent transitions
  };
}

export const LIVING_VALLEY_BIOME_CONFIG: BiomeConfig = {
  id: 'living_valley',
  name: 'The Living Valley',
  layers: {
    base: {
      id: 'dirt_soil',
      diffuseMap: '/assets/worlds/living-valley/materials/ground/earth_albedo.png',
      scale: 14.0,
    },
    primary: {
      id: 'sunlit_meadow',
      diffuseMap: '/assets/worlds/living-valley/materials/ground/meadow_albedo.png',
      scale: 18.0,
    },
    accent: {
      id: 'damp_moss',
      diffuseMap: '/assets/worlds/living-valley/materials/ground/earth_albedo.png',
      scale: 12.0,
    },
    steep: {
      id: 'stone_crag',
      diffuseMap: '/assets/worlds/living-valley/materials/rocks/stone_crag_albedo.png',
      scale: 10.0,
    },
  },
  elevation: {
    heightScale: 25.0,
    noiseScale: 0.05,
    valleyDepth: -22.0,
    riverbedWidth: 40.0,
  },
  macroColor: {
    highTint: GOLDEN_HOUR_VALLEY_PALETTE.sage,
    lowTint: GOLDEN_HOUR_VALLEY_PALETTE.slateShadow,
    noiseScale: 0.005,
  },
  splatThresholds: {
    slopeThreshold: 0.5,
    slopeTransition: 0.15,
    heightThreshold: 15.0,
  },
};
