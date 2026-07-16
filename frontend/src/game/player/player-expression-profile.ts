export interface PulseProfile {
  readonly frequency: number; // Cycles per second (Hz)
  readonly amplitude: number;
  readonly waveform: 'SINE' | 'HEARTBEAT' | 'TRIANGLE' | 'ORGANIC';
}

export interface PlayerExpressionProfile {
  readonly id: string;
  readonly name: string;
  readonly expressionIntensity: number; // [0.0 - 1.0] global tuning scale

  // Deformation & Settling Parameters
  readonly maxHorizontalStretch: number;  // Peak forward stretch ratio
  readonly jumpLaunchCompression: number; // Instant vertical compression on launch
  readonly landingElasticity: number;     // Spring stiffness [k]
  readonly landingDamping: number;        // Spring damping [c]
  readonly settlingTimeMs: number;        // Target recovery duration (ms)

  // Shading Parameters
  readonly baseEmissiveIntensity: number;
  readonly peakMomentumEmissiveScale: number;
  readonly idlePulse: PulseProfile;
  readonly fresnelGlowPower: number;

  // Filament Trail Dynamics
  readonly baseTrailWidth: number;
  readonly maxTrailLength: number;
  readonly trailVelocitySensitivity: number;
}

export interface ExpressionInputs {
  readonly spatial: {
    readonly position: { x: number; y: number; z: number };
  };
  readonly motion: {
    readonly velocity: { x: number; y: number; z: number };
    readonly speed: number;
    readonly airborneHeight: number;
    readonly verticalVelocity: number;
    readonly isGrounded: boolean;
  };
  readonly presentationHints: {
    readonly movementEnergy: number; // [0.0 - 1.0] High-level kinetic energy metric
    readonly landingImpact: number;
    readonly gravityPhase: number;
  };
  readonly events: {
    readonly jumpEventCounter: number;
    readonly lastJumpIndex: number;
    readonly justLanded: boolean;
  };
}

export interface ExpressionBlendState {
  readonly idleBlend: number;         // 0.0 to 1.0 (1.0 when stationary)
  readonly speedBlend: number;        // 0.0 to 1.0
  readonly airborneBlend: number;     // -1.0 (descending) to 1.0 (ascending), 0.0 at apex
  readonly landingBlend: number;      // 0.0 to 1.0 decaying spring impact
  readonly accelerationBlend: number; // 0.0 to 1.0
}

export interface MaterialExpression {
  readonly emissiveIntensity: number;
  readonly glowAlpha: number;
  readonly pulsePhase: number;
  readonly rimPower: number;
  readonly surfaceOpacity: number;
}

export interface TrailExpression {
  readonly opacity: number;
  readonly length: number;
  readonly width: number;
  readonly intensity: number;
}

export interface VisualExpressionState {
  readonly blendState: ExpressionBlendState;
  readonly scaleTransform: { x: number; y: number; z: number };
  readonly material: MaterialExpression;
  readonly trail: TrailExpression;
  readonly activeProfileId: string;
}

export interface ExpressionHooks {
  // Extensibility placeholder interface for cosmetics, accessibility, and environmental modifiers
}

export const DEFAULT_PLAYER_EXPRESSION_PROFILE: PlayerExpressionProfile = {
  id: 'default-resonance-droplet',
  name: 'Default Resonance Droplet',
  expressionIntensity: 1.0,
  maxHorizontalStretch: 0.25,
  jumpLaunchCompression: 0.78,
  landingElasticity: 160.0,
  landingDamping: 14.0,
  settlingTimeMs: 120,
  baseEmissiveIntensity: 0.65,
  peakMomentumEmissiveScale: 0.35,
  idlePulse: {
    frequency: 1.2,
    amplitude: 0.04,
    waveform: 'ORGANIC',
  },
  fresnelGlowPower: 2.5,
  baseTrailWidth: 0.3,
  maxTrailLength: 12.0,
  trailVelocitySensitivity: 0.8,
};
