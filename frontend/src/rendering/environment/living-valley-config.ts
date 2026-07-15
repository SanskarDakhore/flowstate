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

export type TreeCanopyVariant = 'broad' | 'narrow' | 'windswept';

export interface TreeInstanceDefinition {
  id: string;
  progressAnchor: number;
  lateralOffset: number;
  verticalOffset: number;
  scale: number;
  rotationY: number;
  /** Which canopy silhouette template this instance uses. */
  canopyVariant: TreeCanopyVariant;
}

/**
 * Authored placement patch: a small cluster of scatter props (grass tuft /
 * stone / flower) grouped around a progress+lateral zone, rather than one
 * globally-uniform scatter formula. `side` biases which side of the track
 * the whole patch sits on ('both' picks per-item via seeded jitter).
 */
export interface ScatterPatchDefinition {
  id: string;
  progressCenter: number;
  progressSpread: number;
  side: 'left' | 'right' | 'both';
  lateralMin: number;
  lateralMax: number;
  count: number;
}

export interface VegetationScatterConfig {
  grassPatches: ScatterPatchDefinition[];
  stoneClusters: ScatterPatchDefinition[];
  flowerPatches: ScatterPatchDefinition[];
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
 * Authoritative color palette for World 01 — Visual Foundation v0.2 (Golden Hour / Established).
 * A warm, low-angle sunset lighting mood: grounded and peaceful rather than abstract-dark.
 * Player-signal colors (bioluminescence, playerCore) stay cyan for gameplay legibility/contrast
 * against the warm backdrop; every other entry is the "world" half of the palette.
 * Utilizes Color3.FromHexString for single-source-of-truth accuracy.
 */
export const GOLDEN_HOUR_VALLEY_PALETTE = {
  fog: Color3.FromHexString('#D99A72'),          // Warm golden-amber atmospheric haze
  sage: Color3.FromHexString('#8CA05F'),         // Sunlit olive-green meadow terrain
  slateShadow: Color3.FromHexString('#7A5B45'),  // Cliff-wall rock: darker, sharper, shadowed
  landformBluff: Color3.FromHexString('#8A6F52'),// Smooth-bluff rock: warmer, sunlit, softer
  landformRidge: Color3.FromHexString('#7C6350'),// Rolling-shoulder/ridge-mound: mid-tone blend
  skyZenith: Color3.FromHexString('#33456B'),    // Deep dusk-blue zenith
  skyMid: Color3.FromHexString('#C97D63'),       // Warm coral-rose transition band
  skyHorizon: Color3.FromHexString('#F4A85E'),   // Golden amber horizon glow
  sunlightKey: Color3.FromHexString('#FFC077'),  // Low-angle warm golden sun key
  ambientSky: Color3.FromHexString('#C4886B'),   // Warm sky ambient bounce
  ambientGround: Color3.FromHexString('#3A2A22'),// Warm umber ground bounce
  treeTrunk: Color3.FromHexString('#5C4433'),    // Warm bark brown
  treeCanopy: Color3.FromHexString('#7E9150'),   // Sunlit olive-green canopy
  stone: Color3.FromHexString('#8C7860'),        // Warm tan-grey river stone
  flowerBud: Color3.FromHexString('#E8956B'),    // Warm peach blossom
  sporeParticle: Color3.FromHexString('#FFDFA8'),// Warm golden drifting motes
  bioluminescence: Color3.FromHexString('#2FC9E8'),// Kinetic cyan rail accent (gameplay signal)
  playerCore: Color3.FromHexString('#99F2FF'),   // Crisp cyan player anchor (gameplay signal)
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
    width: 480,
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
      scale: [34, 34, 56],
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
      scale: [38, 36, 62],
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
      scale: [40, 38, 66],
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
      colorHex: '#5E4636',
    },
    {
      id: 'mid-mountain-ridge',
      distanceZ: 920,
      baseY: -20,
      heightScale: 140,
      lateralSpan: 750,
      asymmetryOffset: 60,
      peakCount: 9,
      colorHex: '#8C6B52',
    },
    {
      id: 'far-mountain-massif',
      distanceZ: 1200,
      baseY: 0,
      heightScale: 210,
      lateralSpan: 1100,
      asymmetryOffset: -80,
      peakCount: 12,
      colorHex: '#D19B72',
    },
  ],
  trees: [
    // Zone A — Opening Expanse: kept open. Two solitary trees only, wide apart.
    { id: 'tree_a1', progressAnchor: 0.06, lateralOffset: -30, verticalOffset: -9, scale: 1.3, rotationY: 0.35, canopyVariant: 'broad' },
    { id: 'tree_a2', progressAnchor: 0.16, lateralOffset: 34, verticalOffset: -11, scale: 1.1, rotationY: -0.5, canopyVariant: 'windswept' },

    // Zone B — Valley Embrace: a left-side grove (hero + two companions) plus a right-side pair.
    { id: 'tree_b1', progressAnchor: 0.27, lateralOffset: -27, verticalOffset: -5, scale: 1.5, rotationY: 0.2, canopyVariant: 'broad' },
    { id: 'tree_b2', progressAnchor: 0.285, lateralOffset: -33, verticalOffset: -6, scale: 1.0, rotationY: -0.6, canopyVariant: 'narrow' },
    { id: 'tree_b3', progressAnchor: 0.30, lateralOffset: -25, verticalOffset: -4, scale: 0.85, rotationY: 0.8, canopyVariant: 'windswept' },
    { id: 'tree_b4', progressAnchor: 0.40, lateralOffset: 30, verticalOffset: -5, scale: 1.3, rotationY: -0.3, canopyVariant: 'broad' },
    { id: 'tree_b5', progressAnchor: 0.415, lateralOffset: 36, verticalOffset: -6, scale: 0.95, rotationY: 0.5, canopyVariant: 'narrow' },

    // Zone C — Framed Passage: sparse, lets the cliff/ridge landforms dominate the framing.
    { id: 'tree_c1', progressAnchor: 0.58, lateralOffset: -32, verticalOffset: -1, scale: 1.4, rotationY: -0.4, canopyVariant: 'broad' },
    { id: 'tree_c2', progressAnchor: 0.60, lateralOffset: -38, verticalOffset: -2, scale: 1.0, rotationY: 0.3, canopyVariant: 'windswept' },
    { id: 'tree_c3', progressAnchor: 0.68, lateralOffset: 29, verticalOffset: -6, scale: 1.2, rotationY: -0.2, canopyVariant: 'broad' },

    // Zone D — Grand Reopening: a right-side grove near the start, then a solitary pair opening toward the finish.
    { id: 'tree_d1', progressAnchor: 0.80, lateralOffset: 40, verticalOffset: -6, scale: 1.6, rotationY: 0.9, canopyVariant: 'broad' },
    { id: 'tree_d2', progressAnchor: 0.815, lateralOffset: 47, verticalOffset: -7, scale: 1.1, rotationY: -0.4, canopyVariant: 'narrow' },
    { id: 'tree_d3', progressAnchor: 0.83, lateralOffset: 36, verticalOffset: -5, scale: 0.9, rotationY: 0.6, canopyVariant: 'windswept' },
    { id: 'tree_d4', progressAnchor: 0.90, lateralOffset: 50, verticalOffset: -9, scale: 1.2, rotationY: 0.2, canopyVariant: 'narrow' },
    { id: 'tree_d5', progressAnchor: 0.95, lateralOffset: -44, verticalOffset: -10, scale: 1.5, rotationY: -0.7, canopyVariant: 'broad' },
  ],
  vegetation: {
    grassPatches: [
      { id: 'grass_open_a', progressCenter: 0.06, progressSpread: 0.02, side: 'left', lateralMin: 13, lateralMax: 19, count: 6 },
      { id: 'grass_open_b', progressCenter: 0.11, progressSpread: 0.015, side: 'right', lateralMin: 12, lateralMax: 17, count: 5 },
      { id: 'grass_open_c', progressCenter: 0.17, progressSpread: 0.02, side: 'left', lateralMin: 14, lateralMax: 20, count: 4 },
      { id: 'grass_embrace_grove', progressCenter: 0.285, progressSpread: 0.025, side: 'left', lateralMin: 12, lateralMax: 22, count: 6 },
      { id: 'grass_embrace_b', progressCenter: 0.34, progressSpread: 0.02, side: 'right', lateralMin: 13, lateralMax: 18, count: 5 },
      { id: 'grass_embrace_c', progressCenter: 0.415, progressSpread: 0.02, side: 'both', lateralMin: 12, lateralMax: 19, count: 5 },
      { id: 'grass_passage_edge_a', progressCenter: 0.49, progressSpread: 0.015, side: 'right', lateralMin: 13, lateralMax: 17, count: 3 },
      { id: 'grass_passage_edge_b', progressCenter: 0.71, progressSpread: 0.015, side: 'left', lateralMin: 13, lateralMax: 17, count: 3 },
      { id: 'grass_reopen_grove', progressCenter: 0.81, progressSpread: 0.02, side: 'right', lateralMin: 14, lateralMax: 22, count: 5 },
      { id: 'grass_reopen_end', progressCenter: 0.93, progressSpread: 0.02, side: 'left', lateralMin: 13, lateralMax: 20, count: 5 },
    ],
    stoneClusters: [
      { id: 'stone_open', progressCenter: 0.09, progressSpread: 0.015, side: 'right', lateralMin: 14, lateralMax: 22, count: 3 },
      { id: 'stone_embrace_a', progressCenter: 0.26, progressSpread: 0.02, side: 'right', lateralMin: 14, lateralMax: 24, count: 4 },
      { id: 'stone_embrace_b', progressCenter: 0.44, progressSpread: 0.015, side: 'left', lateralMin: 14, lateralMax: 22, count: 3 },
      { id: 'stone_passage', progressCenter: 0.62, progressSpread: 0.02, side: 'right', lateralMin: 15, lateralMax: 24, count: 4 },
      { id: 'stone_reopen_a', progressCenter: 0.78, progressSpread: 0.015, side: 'left', lateralMin: 14, lateralMax: 22, count: 3 },
      { id: 'stone_reopen_b', progressCenter: 0.96, progressSpread: 0.015, side: 'right', lateralMin: 14, lateralMax: 23, count: 3 },
    ],
    flowerPatches: [
      { id: 'flower_embrace_grove', progressCenter: 0.29, progressSpread: 0.015, side: 'left', lateralMin: 12, lateralMax: 16, count: 5 },
      { id: 'flower_embrace_mid', progressCenter: 0.42, progressSpread: 0.015, side: 'both', lateralMin: 12, lateralMax: 17, count: 4 },
      { id: 'flower_passage_moment', progressCenter: 0.66, progressSpread: 0.012, side: 'left', lateralMin: 12, lateralMax: 16, count: 3 },
      { id: 'flower_reopen_grove', progressCenter: 0.815, progressSpread: 0.015, side: 'right', lateralMin: 13, lateralMax: 18, count: 5 },
      { id: 'flower_finale', progressCenter: 0.95, progressSpread: 0.012, side: 'left', lateralMin: 12, lateralMax: 16, count: 3 },
    ],
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
