export interface ParticleFieldShaderState {
  readonly maxParticleCount: number;
  readonly activeParticleCount: number;
  readonly flowSpeedMultiplier: number;
  readonly kineticTurbulence: number;
  readonly particleColorHex: string;
  readonly fieldEmitterRadius: number;
}

export function createDefaultParticleFieldShaderState(): ParticleFieldShaderState {
  return {
    maxParticleCount: 50000,
    activeParticleCount: 1000,
    flowSpeedMultiplier: 1.0,
    kineticTurbulence: 0.2,
    particleColorHex: '#00f0ff',
    fieldEmitterRadius: 30.0,
  };
}
