import { Vector3State } from '../movement/movement-types';

export enum EnvironmentResponseType {
  Vegetation = 'Vegetation',
  Surface = 'Surface',
  Water = 'Water',
  Atmosphere = 'Atmosphere',
}

export enum EnvironmentResponsePriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
}

export enum SurfaceMaterial {
  Grass = 'GRASS',
  Mud = 'MUD',
  Stone = 'STONE',
  Sand = 'SAND',
  Water = 'WATER',
  Snow = 'SNOW',
  Crystal = 'CRYSTAL',
  Moss = 'MOSS',
}

export type ResponseDurationMode = 'Immediate' | 'Persistent';

/**
 * Immutable snapshot isolating MovementState implementation details from Environmental Response Subsystems
 */
export interface EnvironmentIntent {
  readonly playerPosition: Vector3State;
  readonly playerVelocity: Vector3State;
  readonly speed: number;
  readonly movementEnergy: number;
  readonly landingImpact: number;
  readonly surfaceMaterialTag: SurfaceMaterial;
  readonly isGrounded: boolean;
}

/**
 * Common lifecycle state contract across transient visual response instances
 */
export interface EnvironmentResponseInstance {
  active: boolean;
  id: number;
  age: number;
  duration: number;
  normalizedLife: number; // age / duration (0.0 to 1.0)
  priority: EnvironmentResponsePriority;
}

export interface VegetationEcosystemConfig {
  readonly environmentInfluenceRadius: number;    // Radial distance (in units) where deformation initiates
  readonly maxBendingAngle: number;              // Maximum angular sway (in radians) away from the player
  readonly elasticRecoveryStiffness: number;     // Spring tension factor controlling return-to-rest speed
  readonly detailedPetalVibrationScale: number;  // Amplitude of structural shake applied to flowers
}

export interface SurfaceResponseConfig {
  readonly defaultSurfaceMaterial: SurfaceMaterial;
  readonly activeResponseRadius: number;         // Visual boundary radius for localized response emission
  readonly maxPooledDebrisInstances: number;     // Allocation ceiling for the static structural sprite pool
  readonly emissionProbability: number;          // Likelihood [0.0 - 1.0] of spawning an instance per tick
}

export interface AtmosphericEcosystemConfig {
  readonly ambientWindBaseVector: { x: number; z: number };
  readonly windWakeForceScale: number;          // Amplitude of turbulence vector left behind the player
}

export interface WaterEcosystemConfig {
  readonly baseRippleSpeed: number;             // Propagation rate of simple ripple rings
  readonly dynamicAmplitudeScalar: number;       // Velocity-to-wave-amplitude translation coefficient
}

export interface EnvironmentProfile {
  readonly id: string;
  readonly name: string;
  readonly responseIntensity: number;           // Master multiplier for ecosystem responsiveness (0.3 - 1.5)
  readonly vegetation: VegetationEcosystemConfig;
  readonly surface: SurfaceResponseConfig;
  readonly atmosphere: AtmosphericEcosystemConfig;
  readonly water: WaterEcosystemConfig;
  readonly lighting: {
    readonly ambientIntensity: number;
    readonly color: { r: number; g: number; b: number };
  };
}

export interface AmbientExpressionState {
  readonly activeProfileId: string;
  readonly activeVegetation: number;
  readonly activeRipples: number;
  readonly activeSurfaceResponses: number;
  readonly currentActiveResponseRadius: number;  // Derived value from environmentInfluenceRadius
  readonly activeVegetationUniformsBound: number;
  readonly liveSurfaceResponsePoolUsage: number;
  readonly inactivePoolCapacity: number;
  readonly largestPoolUsage: number;
  readonly frameTimeMs: number;                   // Tracking current frame CPU execution time (< 0.5ms target)
  readonly peakFrameTimeMs: number;               // High-water mark execution time
}

export const LIVING_VALLEY_PROFILE: EnvironmentProfile = {
  id: 'LIVING_VALLEY',
  name: 'Living Valley',
  responseIntensity: 0.7, // Soft, gentle meadow responsiveness
  vegetation: {
    environmentInfluenceRadius: 2.8,
    maxBendingAngle: 0.65,
    elasticRecoveryStiffness: 4.5,
    detailedPetalVibrationScale: 0.15,
  },
  surface: {
    defaultSurfaceMaterial: SurfaceMaterial.Grass,
    activeResponseRadius: 2.0,
    maxPooledDebrisInstances: 64,
    emissionProbability: 0.2,
  },
  atmosphere: {
    ambientWindBaseVector: { x: 0.5, z: 0.8 },
    windWakeForceScale: 1.2,
  },
  water: {
    baseRippleSpeed: 4.0,
    dynamicAmplitudeScalar: 0.18,
  },
  lighting: {
    ambientIntensity: 0.85,
    color: { r: 0.92, g: 0.98, b: 0.95 },
  },
};

export const CRYSTAL_CAVERNS_PROFILE: EnvironmentProfile = {
  id: 'CRYSTAL_CAVERNS',
  name: 'Crystal Caverns',
  responseIntensity: 1.2, // Sharp, resonant cavern responsiveness
  vegetation: {
    environmentInfluenceRadius: 1.5,
    maxBendingAngle: 0.15,
    elasticRecoveryStiffness: 12.0,
    detailedPetalVibrationScale: 0.05,
  },
  surface: {
    defaultSurfaceMaterial: SurfaceMaterial.Crystal,
    activeResponseRadius: 1.2,
    maxPooledDebrisInstances: 32,
    emissionProbability: 0.1,
  },
  atmosphere: {
    ambientWindBaseVector: { x: 0.1, z: 0.1 },
    windWakeForceScale: 0.4,
  },
  water: {
    baseRippleSpeed: 2.0,
    dynamicAmplitudeScalar: 0.08,
  },
  lighting: {
    ambientIntensity: 0.45,
    color: { r: 0.6, g: 0.8, b: 1.0 },
  },
};

export const DEFAULT_ENVIRONMENT_PROFILE = LIVING_VALLEY_PROFILE;
