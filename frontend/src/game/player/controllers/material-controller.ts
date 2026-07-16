import { ExpressionInputs, MaterialExpression, PlayerExpressionProfile } from '../player-expression-profile';

export class MaterialController {
  private profile: PlayerExpressionProfile;
  private currentPulseTime: number = 0;

  constructor(profile: PlayerExpressionProfile) {
    this.profile = profile;
  }

  public setProfile(profile: PlayerExpressionProfile): void {
    this.profile = profile;
  }

  private evaluatePulseWaveform(time: number, profile: PlayerExpressionProfile['idlePulse']): number {
    const t = (time * profile.frequency) % 1.0;
    switch (profile.waveform) {
      case 'HEARTBEAT': {
        if (t < 0.2) return Math.sin((t / 0.2) * Math.PI) * profile.amplitude;
        if (t > 0.3 && t < 0.5) return Math.sin(((t - 0.3) / 0.2) * Math.PI) * profile.amplitude * 0.6;
        return 0;
      }
      case 'TRIANGLE': {
        const tri = t < 0.5 ? t * 4.0 - 1.0 : 3.0 - t * 4.0;
        return tri * profile.amplitude;
      }
      case 'ORGANIC': {
        const wave1 = Math.sin(time * profile.frequency);
        const wave2 = Math.sin(time * profile.frequency * 2.3 + 0.5) * 0.4;
        return (wave1 + wave2) * profile.amplitude;
      }
      case 'SINE':
      default:
        return Math.sin(time * profile.frequency * Math.PI * 2) * profile.amplitude;
    }
  }

  public update(inputs: ExpressionInputs, dt: number): MaterialExpression {
    const clampedDt = Math.max(0, dt);
    this.currentPulseTime += clampedDt;

    const intensity = this.profile.expressionIntensity;
    const energy = inputs.presentationHints.movementEnergy;

    // Organic base pulse + momentum coupled emissive boost
    const pulseOffset = this.evaluatePulseWaveform(this.currentPulseTime, this.profile.idlePulse);
    const baseEmissive = this.profile.baseEmissiveIntensity;
    const momentumEmissive = energy * this.profile.peakMomentumEmissiveScale;

    const totalEmissive = (baseEmissive + pulseOffset + momentumEmissive) * intensity;
    const glowAlpha = Math.min(1.0, (0.22 + pulseOffset * 0.5 + energy * 0.25) * intensity);
    const rimPower = this.profile.fresnelGlowPower * (1.0 + energy * 0.5);

    return {
      emissiveIntensity: Math.max(0.1, totalEmissive),
      glowAlpha: Math.max(0, glowAlpha),
      pulsePhase: this.currentPulseTime,
      rimPower,
      surfaceOpacity: 0.85 + energy * 0.15,
    };
  }

  public reset(): void {
    this.currentPulseTime = 0;
  }
}
