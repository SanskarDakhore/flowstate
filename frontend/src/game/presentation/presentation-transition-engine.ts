import { UnifiedPresentationProfile } from './presentation-profile';

export interface TransitionState {
  readonly isTransitioning: boolean;
  readonly progress: number; // 0.0 to 1.0
  readonly blendedProfile: UnifiedPresentationProfile;
}

export class PresentationTransitionEngine {
  private sourceProfile: UnifiedPresentationProfile | null = null;
  private targetProfile: UnifiedPresentationProfile | null = null;
  private transitionDurationMs: number = 0;
  private elapsedTimeMs: number = 0;
  private isTransitioning: boolean = false;

  public startTransition(
    fromProfile: UnifiedPresentationProfile,
    toProfile: UnifiedPresentationProfile,
    durationMs?: number
  ): void {
    if (fromProfile.id === toProfile.id) {
      this.isTransitioning = false;
      this.sourceProfile = toProfile;
      this.targetProfile = toProfile;
      return;
    }

    this.sourceProfile = fromProfile;
    this.targetProfile = toProfile;
    this.transitionDurationMs = durationMs ?? toProfile.global.transitionDurationMs ?? 800;
    this.elapsedTimeMs = 0;
    this.isTransitioning = true;
  }

  public update(deltaTimeMs: number, currentBaseProfile: UnifiedPresentationProfile): TransitionState {
    if (!this.isTransitioning || !this.sourceProfile || !this.targetProfile) {
      return {
        isTransitioning: false,
        progress: 1.0,
        blendedProfile: currentBaseProfile,
      };
    }

    this.elapsedTimeMs += deltaTimeMs;
    const duration = Math.max(1, this.transitionDurationMs);
    const alpha = Math.min(1.0, Math.max(0.0, this.elapsedTimeMs / duration));

    const blendedProfile = this.blendProfiles(this.sourceProfile, this.targetProfile, alpha);

    if (alpha >= 1.0) {
      this.isTransitioning = false;
    }

    return {
      isTransitioning: this.isTransitioning,
      progress: alpha,
      blendedProfile,
    };
  }

  private blendProfiles(
    a: UnifiedPresentationProfile,
    b: UnifiedPresentationProfile,
    alpha: number
  ): UnifiedPresentationProfile {
    const lerp = (v1: number, v2: number) => v1 + (v2 - v1) * alpha;

    return {
      id: alpha >= 0.5 ? b.id : a.id,
      name: `${a.name} -> ${b.name}`,
      mood: alpha >= 0.5 ? b.mood : a.mood,
      player: {
        id: alpha >= 0.5 ? b.player.id : a.player.id,
        name: alpha >= 0.5 ? b.player.name : a.player.name,
        expressionIntensity: lerp(a.player.expressionIntensity, b.player.expressionIntensity),
        maxHorizontalStretch: lerp(a.player.maxHorizontalStretch, b.player.maxHorizontalStretch),
        jumpLaunchCompression: lerp(a.player.jumpLaunchCompression, b.player.jumpLaunchCompression),
        landingElasticity: lerp(a.player.landingElasticity, b.player.landingElasticity),
        landingDamping: lerp(a.player.landingDamping, b.player.landingDamping),
        settlingTimeMs: lerp(a.player.settlingTimeMs, b.player.settlingTimeMs),
        baseEmissiveIntensity: lerp(a.player.baseEmissiveIntensity, b.player.baseEmissiveIntensity),
        peakMomentumEmissiveScale: lerp(a.player.peakMomentumEmissiveScale, b.player.peakMomentumEmissiveScale),
        idlePulse: {
          frequency: lerp(a.player.idlePulse.frequency, b.player.idlePulse.frequency),
          amplitude: lerp(a.player.idlePulse.amplitude, b.player.idlePulse.amplitude),
          waveform: alpha >= 0.5 ? b.player.idlePulse.waveform : a.player.idlePulse.waveform,
        },
        fresnelGlowPower: lerp(a.player.fresnelGlowPower, b.player.fresnelGlowPower),
        baseTrailWidth: lerp(a.player.baseTrailWidth, b.player.baseTrailWidth),
        maxTrailLength: lerp(a.player.maxTrailLength, b.player.maxTrailLength),
        trailVelocitySensitivity: lerp(a.player.trailVelocitySensitivity, b.player.trailVelocitySensitivity),
      },
      camera: {
        follow: {
          followStiffness: lerp(a.camera.follow.followStiffness, b.camera.follow.followStiffness),
        },
        lookAhead: {
          lookAheadFactor: lerp(a.camera.lookAhead.lookAheadFactor, b.camera.lookAhead.lookAheadFactor),
          maxDistance: lerp(a.camera.lookAhead.maxDistance, b.camera.lookAhead.maxDistance),
        },
        jump: {
          verticalFramingBias: lerp(a.camera.jump.verticalFramingBias, b.camera.jump.verticalFramingBias),
        },
        landing: {
          landingCushionAbsorption: lerp(a.camera.landing.landingCushionAbsorption, b.camera.landing.landingCushionAbsorption),
          cushionRecoveryMs: lerp(a.camera.landing.cushionRecoveryMs, b.camera.landing.cushionRecoveryMs),
        },
        fov: {
          baseFov: lerp(a.camera.fov.baseFov, b.camera.fov.baseFov),
          maxFovSpeedExpansion: lerp(a.camera.fov.maxFovSpeedExpansion, b.camera.fov.maxFovSpeedExpansion),
        },
      },
      environment: {
        id: alpha >= 0.5 ? b.environment.id : a.environment.id,
        name: alpha >= 0.5 ? b.environment.name : a.environment.name,
        responseIntensity: lerp(a.environment.responseIntensity, b.environment.responseIntensity),
        vegetation: {
          environmentInfluenceRadius: lerp(a.environment.vegetation.environmentInfluenceRadius, b.environment.vegetation.environmentInfluenceRadius),
          maxBendingAngle: lerp(a.environment.vegetation.maxBendingAngle, b.environment.vegetation.maxBendingAngle),
          elasticRecoveryStiffness: lerp(a.environment.vegetation.elasticRecoveryStiffness, b.environment.vegetation.elasticRecoveryStiffness),
          detailedPetalVibrationScale: lerp(a.environment.vegetation.detailedPetalVibrationScale, b.environment.vegetation.detailedPetalVibrationScale),
        },
        surface: {
          defaultSurfaceMaterial: alpha >= 0.5 ? b.environment.surface.defaultSurfaceMaterial : a.environment.surface.defaultSurfaceMaterial,
          activeResponseRadius: lerp(a.environment.surface.activeResponseRadius, b.environment.surface.activeResponseRadius),
          maxPooledDebrisInstances: Math.round(lerp(a.environment.surface.maxPooledDebrisInstances, b.environment.surface.maxPooledDebrisInstances)),
          emissionProbability: lerp(a.environment.surface.emissionProbability, b.environment.surface.emissionProbability),
        },
        atmosphere: {
          ambientWindBaseVector: {
            x: lerp(a.environment.atmosphere.ambientWindBaseVector.x, b.environment.atmosphere.ambientWindBaseVector.x),
            z: lerp(a.environment.atmosphere.ambientWindBaseVector.z, b.environment.atmosphere.ambientWindBaseVector.z),
          },
          windWakeForceScale: lerp(a.environment.atmosphere.windWakeForceScale, b.environment.atmosphere.windWakeForceScale),
        },
        water: {
          baseRippleSpeed: lerp(a.environment.water.baseRippleSpeed, b.environment.water.baseRippleSpeed),
          dynamicAmplitudeScalar: lerp(a.environment.water.dynamicAmplitudeScalar, b.environment.water.dynamicAmplitudeScalar),
        },
        lighting: {
          ambientIntensity: lerp(a.environment.lighting.ambientIntensity, b.environment.lighting.ambientIntensity),
          color: {
            r: lerp(a.environment.lighting.color.r, b.environment.lighting.color.r),
            g: lerp(a.environment.lighting.color.g, b.environment.lighting.color.g),
            b: lerp(a.environment.lighting.color.b, b.environment.lighting.color.b),
          },
        },
      },
      global: {
        presentationIntensity: lerp(a.global.presentationIntensity, b.global.presentationIntensity),
        transitionDurationMs: lerp(a.global.transitionDurationMs, b.global.transitionDurationMs),
        environmentalResonanceScale: lerp(a.global.environmentalResonanceScale, b.global.environmentalResonanceScale),
        colorTemperature: lerp(a.global.colorTemperature, b.global.colorTemperature),
      },
    };
  }

  public reset(): void {
    this.sourceProfile = null;
    this.targetProfile = null;
    this.isTransitioning = false;
    this.elapsedTimeMs = 0;
  }
}
