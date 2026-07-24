export type SurfaceMaterialType =
  | 'GRASS_MUD'
  | 'STONE_MARBLE'
  | 'CRYSTAL_ICE'
  | 'KINETIC_BOOST_TRACK'
  | 'DEEP_SAND';

export interface SurfacePhysicalProperties {
  readonly materialType: SurfaceMaterialType;
  readonly staticFriction: number;      // mu_s [0.0 - 1.0]
  readonly dynamicFriction: number;     // mu_d [0.0 - 1.0]
  readonly rollingResistance: number;  // mu_r coefficient
  readonly speedScalar: number;         // Velocity multiplier
  readonly maxAdhesionAngleRad: number; // Max slope climb angle before sliding
}

export const SURFACE_MATERIAL_PRESETS: Record<SurfaceMaterialType, SurfacePhysicalProperties> = {
  STONE_MARBLE: {
    materialType: 'STONE_MARBLE',
    staticFriction: 0.90,
    dynamicFriction: 0.85,
    rollingResistance: 0.02,
    speedScalar: 1.0,
    maxAdhesionAngleRad: Math.PI / 3, // 60 deg
  },
  CRYSTAL_ICE: {
    materialType: 'CRYSTAL_ICE',
    staticFriction: 0.15,
    dynamicFriction: 0.10,
    rollingResistance: 0.005,
    speedScalar: 1.2, // High-speed slick glide
    maxAdhesionAngleRad: Math.PI / 8, // 22.5 deg
  },
  GRASS_MUD: {
    materialType: 'GRASS_MUD',
    staticFriction: 0.65,
    dynamicFriction: 0.55,
    rollingResistance: 0.08,
    speedScalar: 0.85,
    maxAdhesionAngleRad: Math.PI / 4, // 45 deg
  },
  KINETIC_BOOST_TRACK: {
    materialType: 'KINETIC_BOOST_TRACK',
    staticFriction: 1.0,
    dynamicFriction: 0.95,
    rollingResistance: 0.01,
    speedScalar: 1.5, // Energy boost surface
    maxAdhesionAngleRad: Math.PI / 2.5, // 72 deg
  },
  DEEP_SAND: {
    materialType: 'DEEP_SAND',
    staticFriction: 0.50,
    dynamicFriction: 0.40,
    rollingResistance: 0.18,
    speedScalar: 0.60,
    maxAdhesionAngleRad: Math.PI / 6, // 30 deg
  },
};

export interface SlopeInclineState {
  readonly slopeAngleRad: number;
  readonly isDownslope: boolean;
  readonly downslopeDirection: { x: number; y: number; z: number };
  readonly inclineGravityAccel: number; // m/s^2 along slope
}

export interface SurfaceFrictionResult {
  readonly effectiveFriction: number;
  readonly rollingResistanceForce: number;
  readonly downslopeAcceleration: { x: number; y: number; z: number };
  readonly isDrifting: boolean;
  readonly lateralGForce: number;
  readonly surfaceType: SurfaceMaterialType;
}
