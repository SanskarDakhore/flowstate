import { Color3 } from '@babylonjs/core';

export type LandformRole =
  | 'frame'
  | 'guide'
  | 'reveal'
  | 'occlude-empty-space'
  | 'establish-scale'
  | 'create-depth-overlap';

export interface LandformDefinition {
  id: string;
  role: LandformRole;
  section: 'opening-expanse' | 'valley-embrace' | 'framed-passage' | 'grand-reopening';
  /** Normalized progress along path [0..1] around which this landform is positioned */
  progressAnchor: number;
  /** Lateral offset from ribbon (positive = right, negative = left) */
  lateralOffset: number;
  /** Vertical offset relative to track surface height */
  verticalOffset: number;
  /** Scale [width/X, height/Y, depth/Z] */
  scale: [number, number, number];
  /** Y-axis rotation in radians */
  rotationY: number;
  /** Primitive variant type */
  variant: 'smooth-bluff' | 'rolling-shoulder' | 'cliff-wall' | 'ridge-mound';
}

export interface MountainLayerConfig {
  id: string;
  distanceZ: number;
  baseY: number;
  heightScale: number;
  lateralSpan: number;
  asymmetryOffset: number;
  peakCount: number;
  colorHex: string;
}

export interface TreeInstanceDefinition {
  id: string;
  progressAnchor: number;
  lateralOffset: number;
  verticalOffset: number;
  scale: number;
  rotationY: number;
}

export interface VegetationScatterConfig {
  grassClumpCount: number;
  stoneClusterCount: number;
  flowerBudCount: number;
  minLateralDistance: number;
  maxLateralDistance: number;
}

export interface AmbientParticleConfig {
  maxParticles: number;
  emissionRate: number;
  colorHex: string;
  minSize: number;
  maxSize: number;
  speed: number;
}

/**
 * Authoritative color palette for World 01 — Dormant / Early Awakening State.
 * Utilizes Color3.FromHexString for single-source-of-truth accuracy.
 */
export const DORMANT_VALLEY_PALETTE = {
  fog: Color3.FromHexString('#A3B5C0'),         // Slate Blue-Grey atmosphere
  sage: Color3.FromHexString('#8AA38B'),        // Muted Sage valley floor / terrain
  lavender: Color3.FromHexString('#B8B0C8'),    // Pale Lavender horizon haze
  slateShadow: Color3.FromHexString('#5C6B73'),  // Deep Slate midground shadow tint
  skyEmissive: Color3.FromHexString('#8A9BA8'),  // Soft overcast sky dome emission
  treeTrunk: Color3.FromHexString('#4A5859'),    // Muted Dark Slate Wood
  treeCanopy: Color3.FromHexString('#6B8E72'),   // Dormant Muted Foliage Green
  stone: Color3.FromHexString('#7A8B99'),        // Smooth Slate Stone
  flowerBud: Color3.FromHexString('#C4A8D1'),    // Unopened Soft Lavender Blossom
  sporeParticle: Color3.FromHexString('#D8E5DB'),// Soft Floating Pollen Spore
};

export interface LivingValleyConfig {
  trackClearance: {
    baseRadius: number;         // Base minimum clearance from ribbon center
    cameraSafetyMargin: number; // Extra clearance behind/above camera frustum
  };
  terrain: {
    width: number;
    length: number;
    subdivisionsX: number;
    subdivisionsZ: number;
    baseDepth: number; // Base depth below track (Y-offset)
  };
  landforms: LandformDefinition[];
  mountainLayers: MountainLayerConfig[];
  trees: TreeInstanceDefinition[];
  vegetation: VegetationScatterConfig;
  particles: AmbientParticleConfig;
}

export const LIVING_VALLEY_CONFIG: LivingValleyConfig = {
  trackClearance: {
    baseRadius: 18.0,
    cameraSafetyMargin: 6.0,
  },
  terrain: {
    width: 320,
    length: 800,
    subdivisionsX: 24,
    subdivisionsZ: 48,
    baseDepth: -22,
  },
  landforms: [
    // Section A: Opening Expanse (Z = 0 -> 120m, progress ~ 0.0 -> 0.20)
    {
      id: 'opening-east-slope',
      role: 'establish-scale',
      section: 'opening-expanse',
      progressAnchor: 0.08,
      lateralOffset: 48,
      verticalOffset: -12,
      scale: [40, 16, 60],
      rotationY: 0.2,
      variant: 'rolling-shoulder',
    },
    {
      id: 'opening-west-knoll',
      role: 'guide',
      section: 'opening-expanse',
      progressAnchor: 0.15,
      lateralOffset: -42,
      verticalOffset: -14,
      scale: [32, 12, 50],
      rotationY: -0.3,
      variant: 'smooth-bluff',
    },

    // Section B: Valley Embrace (Z = 120 -> 280m, progress ~ 0.20 -> 0.46)
    {
      id: 'embrace-east-shoulder',
      role: 'frame',
      section: 'valley-embrace',
      progressAnchor: 0.28,
      lateralOffset: 38,
      verticalOffset: -4,
      scale: [45, 22, 75],
      rotationY: 0.15,
      variant: 'rolling-shoulder',
    },
    {
      id: 'embrace-west-ridge',
      role: 'create-depth-overlap',
      section: 'valley-embrace',
      progressAnchor: 0.36,
      lateralOffset: -44,
      verticalOffset: -2,
      scale: [50, 26, 80],
      rotationY: -0.25,
      variant: 'ridge-mound',
    },
    {
      id: 'embrace-low-bluff',
      role: 'occlude-empty-space',
      section: 'valley-embrace',
      progressAnchor: 0.42,
      lateralOffset: 34,
      verticalOffset: -8,
      scale: [35, 18, 55],
      rotationY: 0.4,
      variant: 'smooth-bluff',
    },

    // Section C: Framed Passage (Z = 280 -> 440m, progress ~ 0.46 -> 0.73)
    {
      id: 'passage-west-bluff',
      role: 'frame',
      section: 'framed-passage',
      progressAnchor: 0.54,
      lateralOffset: -32,
      verticalOffset: 2,
      scale: [55, 34, 90],
      rotationY: -0.1,
      variant: 'cliff-wall',
    },
    {
      id: 'passage-east-counter-ridge',
      role: 'create-depth-overlap',
      section: 'framed-passage',
      progressAnchor: 0.65,
      lateralOffset: 42,
      verticalOffset: 6,
      scale: [48, 30, 85],
      rotationY: 0.3,
      variant: 'ridge-mound',
    },
    {
      id: 'passage-mid-reveal-knoll',
      role: 'reveal',
      section: 'framed-passage',
      progressAnchor: 0.70,
      lateralOffset: -38,
      verticalOffset: -6,
      scale: [38, 20, 60],
      rotationY: -0.4,
      variant: 'smooth-bluff',
    },

    // Section D: Grand Reopening (Z = 440 -> 600m+, progress ~ 0.73 -> 1.0)
    {
      id: 'reopening-west-sentinel',
      role: 'establish-scale',
      section: 'grand-reopening',
      progressAnchor: 0.82,
      lateralOffset: -52,
      verticalOffset: -4,
      scale: [60, 38, 100],
      rotationY: -0.2,
      variant: 'cliff-wall',
    },
    {
      id: 'reopening-east-flank',
      role: 'reveal',
      section: 'grand-reopening',
      progressAnchor: 0.90,
      lateralOffset: 58,
      verticalOffset: -8,
      scale: [65, 32, 110],
      rotationY: 0.25,
      variant: 'rolling-shoulder',
    },
    {
      id: 'reopening-basin-mound',
      role: 'occlude-empty-space',
      section: 'grand-reopening',
      progressAnchor: 0.96,
      lateralOffset: -60,
      verticalOffset: -12,
      scale: [70, 28, 120],
      rotationY: -0.15,
      variant: 'ridge-mound',
    },
  ],
  mountainLayers: [
    {
      id: 'near-mountain-ridge',
      distanceZ: 680,
      baseY: -30,
      heightScale: 90,
      lateralSpan: 500,
      asymmetryOffset: -40,
      peakCount: 7,
      colorHex: '#6E818F',
    },
    {
      id: 'mid-mountain-ridge',
      distanceZ: 920,
      baseY: -20,
      heightScale: 140,
      lateralSpan: 750,
      asymmetryOffset: 60,
      peakCount: 9,
      colorHex: '#8CA1AF',
    },
    {
      id: 'far-mountain-massif',
      distanceZ: 1200,
      baseY: 0,
      heightScale: 210,
      lateralSpan: 1100,
      asymmetryOffset: -80,
      peakCount: 12,
      colorHex: '#B0C0CC',
    },
  ],
  trees: [
    // Section A
    { id: 'tree_a1', progressAnchor: 0.05, lateralOffset: -26, verticalOffset: -8, scale: 1.2, rotationY: 0.4 },
    { id: 'tree_a2', progressAnchor: 0.12, lateralOffset: 28, verticalOffset: -10, scale: 1.0, rotationY: -0.2 },
    { id: 'tree_a3', progressAnchor: 0.18, lateralOffset: -30, verticalOffset: -12, scale: 1.4, rotationY: 0.8 },

    // Section B
    { id: 'tree_b1', progressAnchor: 0.24, lateralOffset: 25, verticalOffset: -6, scale: 1.1, rotationY: -0.5 },
    { id: 'tree_b2', progressAnchor: 0.30, lateralOffset: -28, verticalOffset: -4, scale: 1.5, rotationY: 0.3 },
    { id: 'tree_b3', progressAnchor: 0.38, lateralOffset: 32, verticalOffset: -5, scale: 1.3, rotationY: 0.7 },
    { id: 'tree_b4', progressAnchor: 0.44, lateralOffset: -26, verticalOffset: -7, scale: 1.0, rotationY: -0.6 },

    // Section C
    { id: 'tree_c1', progressAnchor: 0.50, lateralOffset: 27, verticalOffset: -3, scale: 1.4, rotationY: 0.2 },
    { id: 'tree_c2', progressAnchor: 0.58, lateralOffset: -34, verticalOffset: -2, scale: 1.6, rotationY: -0.4 },
    { id: 'tree_c3', progressAnchor: 0.64, lateralOffset: 30, verticalOffset: -1, scale: 1.2, rotationY: 0.5 },
    { id: 'tree_c4', progressAnchor: 0.72, lateralOffset: -29, verticalOffset: -4, scale: 1.3, rotationY: -0.1 },

    // Section D
    { id: 'tree_d1', progressAnchor: 0.78, lateralOffset: 35, verticalOffset: -5, scale: 1.5, rotationY: 0.9 },
    { id: 'tree_d2', progressAnchor: 0.85, lateralOffset: -38, verticalOffset: -6, scale: 1.7, rotationY: -0.3 },
    { id: 'tree_d3', progressAnchor: 0.92, lateralOffset: 40, verticalOffset: -8, scale: 1.4, rotationY: 0.4 },
    { id: 'tree_d4', progressAnchor: 0.97, lateralOffset: -42, verticalOffset: -10, scale: 1.6, rotationY: -0.7 },
  ],
  vegetation: {
    grassClumpCount: 45,
    stoneClusterCount: 20,
    flowerBudCount: 25,
    minLateralDistance: 12.0,
    maxLateralDistance: 24.0,
  },
  particles: {
    maxParticles: 120,
    emissionRate: 15,
    colorHex: '#D8E5DB',
    minSize: 0.15,
    maxSize: 0.35,
    speed: 1.2,
  },
};
