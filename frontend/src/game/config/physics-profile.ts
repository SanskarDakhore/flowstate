export interface EnvironmentPhysicsProfile {
  readonly id: string;
  readonly name: string;
  readonly gravity: number;
  readonly airResistance: number;
  readonly surfaceDefaults: {
    readonly friction: number;
  };
}

export interface MovementResponseCurve {
  evaluate(input: number): number;
}

export class LinearCurve implements MovementResponseCurve {
  evaluate(t: number): number {
    return Math.max(0, Math.min(1, t));
  }
}

export class EaseOutCurve implements MovementResponseCurve {
  evaluate(t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 2);
  }
}

export class SineCurve implements MovementResponseCurve {
  evaluate(t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    return Math.sin((clamped * Math.PI) / 2);
  }
}

export interface MovementProfile {
  readonly id: string;
  readonly name: string;
  readonly maxHorizontalSpeed: number;
  readonly groundAcceleration: number;
  readonly groundDeceleration: number;
  readonly airAcceleration: number;
  readonly airControlAuthority: number;
  readonly turnResistance: number; // [0.0 - 1.0] higher = tighter steering, lower = drift
  readonly accelerationCurve: MovementResponseCurve;
  readonly decelerationCurve: MovementResponseCurve;
  readonly gravityPhaseScalars: {
    readonly ascending: number;
    readonly apex: number;
    readonly descending: number;
    readonly fastFallReady: number;
  };
  readonly apexVelocityThreshold: number;
  readonly terminalVerticalVelocity: number;
}

export const DEFAULT_ENVIRONMENT_PROFILE: EnvironmentPhysicsProfile = {
  id: 'terrestrial-ground',
  name: 'Terrestrial Ground',
  gravity: -28.0,
  airResistance: 0.1,
  surfaceDefaults: {
    friction: 0.85,
  },
};

export const LOW_GRAVITY_ENVIRONMENT_PROFILE: EnvironmentPhysicsProfile = {
  id: 'floating-isles',
  name: 'Floating Isles Low Gravity',
  gravity: -14.0,
  airResistance: 0.05,
  surfaceDefaults: {
    friction: 0.9,
  },
};

export const WIND_ENVIRONMENT_PROFILE: EnvironmentPhysicsProfile = {
  id: 'storm-peaks',
  name: 'Storm Peaks Atmospheric Drag',
  gravity: -30.0,
  airResistance: 0.35,
  surfaceDefaults: {
    friction: 0.7,
  },
};

export const DEFAULT_MOVEMENT_PROFILE: MovementProfile = {
  id: 'default-responsive',
  name: 'Default Responsive Feel',
  maxHorizontalSpeed: 20.0,
  groundAcceleration: 40.0,
  groundDeceleration: 50.0,
  airAcceleration: 25.0,
  airControlAuthority: 0.6,
  turnResistance: 0.75,
  accelerationCurve: new EaseOutCurve(),
  decelerationCurve: new LinearCurve(),
  gravityPhaseScalars: {
    ascending: 1.0,
    apex: 0.5,
    descending: 1.25,
    fastFallReady: 2.0,
  },
  apexVelocityThreshold: 2.5,
  terminalVerticalVelocity: -40.0,
};
