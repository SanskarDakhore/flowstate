import { PresentationSnapshot, WorldStateEnum, WorldStateSnapshot, createDefaultAudioState, createDefaultPresentationWeatherState, createDefaultPresentationWildlifeState, createDefaultPresentationEventState, createDefaultPresentationBiomeState, createDefaultVolumetricLightingState, createDefaultInstancedVegetationShaderState, createDefaultParticleFieldShaderState } from '@flowstate/shared';

export class PresentationResolver {
  private lastSnapshot: PresentationSnapshot = {
    lighting: { sunIntensity: 0.5, ambientColorHex: '#0f172a', colorTemperature: 5500 },
    sky: { skyBlend: 0, starOpacity: 0.5, cloudBlend: 0.2 },
    terrain: { colorGrading: 0, wetness: 0 },
    vegetation: {
      grassDensity: 0,
      grassColorHex: '#00f0ff',
      windStrength: 0.1,
      flowerDensity: 0,
      leafDensity: 0.3,
      grassHeight: 0.3,
      treeVitality: 0.5,
      colorVariation: 0,
    },
    atmosphere: { fogDensity: 0.02, bloomIntensity: 0.2, exposure: 1.0 },
    particles: { emissionRate: 0 },
    audio: createDefaultAudioState(),
    weather: createDefaultPresentationWeatherState(),
    wildlife: createDefaultPresentationWildlifeState(),
    event: createDefaultPresentationEventState(),
    biome: createDefaultPresentationBiomeState(),
    volumetricLighting: createDefaultVolumetricLightingState(),
    instancedVegetation: createDefaultInstancedVegetationShaderState(),
    particleField: createDefaultParticleFieldShaderState(),
    camera: { cameraMood: 'default' },
    timestamp: Date.now(),
  };

  /**
   * Pure deterministic resolver translating WorldStateSnapshot
   * into composed PresentationSnapshot hierarchy.
   * 0-byte frame allocations per tick.
   */
  public resolve(worldState: Readonly<WorldStateSnapshot>): Readonly<PresentationSnapshot> {
    const energyNorm = Math.min(1.0, Math.max(0.0, worldState.energyBuffer / 100.0));

    let mood = 'default';
    if (worldState.currentState >= WorldStateEnum.THRIVING) {
      mood = 'kinetic-flow';
    } else if (worldState.currentState >= WorldStateEnum.GROWING) {
      mood = 'awakened';
    }

    // Audio parameters calculation
    const musicIntensity = energyNorm;
    const filterCutoff = 2000 + (energyNorm * 18000);
    const windVol = 0.2 + (energyNorm * 0.4);
    const birdsVol = Math.max(0.0, (energyNorm - 0.2) * 1.25);
    const hapticIntensity = worldState.currentState >= WorldStateEnum.BLOOMING ? energyNorm * 0.8 : 0.0;

    // Weather presentation translation
    const weatherState = worldState.weatherState;
    const cloudOpacity = weatherState.cloudCoverage * 0.7;
    const fogDensity = 0.005 + (weatherState.mistDensity * 0.025);
    const windAnimationStrength = 0.1 + (weatherState.windSpeed / 50.0);
    const sunVisibility = Math.max(0.1, 1.0 - weatherState.cloudCoverage);

    this.lastSnapshot = {
      lighting: {
        sunIntensity: (0.5 + (energyNorm * 0.8)) * sunVisibility,
        ambientColorHex: energyNorm > 0.5 ? '#1e293b' : '#0f172a',
        colorTemperature: 5500 + Math.floor(energyNorm * 1000),
      },
      sky: {
        skyBlend: Math.min(1.0, energyNorm * 1.1),
        starOpacity: Math.max(0.0, 0.5 - (energyNorm * 0.4)),
        cloudBlend: weatherState.cloudCoverage,
      },
      terrain: {
        colorGrading: energyNorm,
        wetness: Math.min(1.0, weatherState.humidity * 0.8),
      },
      vegetation: {
        grassDensity: worldState.vegetationWeight,
        grassColorHex: energyNorm > 0.7 ? '#10b981' : '#00f0ff',
        windStrength: windAnimationStrength,
        flowerDensity: worldState.vegetationState.flowerDensity,
        leafDensity: worldState.vegetationState.leafDensity,
        grassHeight: worldState.vegetationState.grassHeight,
        treeVitality: worldState.vegetationState.treeVitality,
        colorVariation: worldState.vegetationState.colorVariation,
      },
      atmosphere: {
        fogDensity,
        bloomIntensity: 0.2 + (energyNorm * 0.6),
        exposure: 1.0 + (energyNorm * 0.2),
      },
      particles: {
        emissionRate: Math.min(100, Math.floor(energyNorm * 100)),
      },
      audio: {
        music: {
          volume: 0.8,
          crossfade: energyNorm,
          eqFrequency: 1000 + (energyNorm * 2000),
          reverbLevel: 0.2 + (energyNorm * 0.3),
          intensity: musicIntensity,
          filterCutoff,
        },
        ambient: {
          windVolume: windVol,
          birdsVolume: Math.min(1.0, birdsVol),
          leavesVolume: Math.min(1.0, energyNorm * 0.7),
          waterVolume: 0.2,
          insectsVolume: Math.min(1.0, energyNorm * 0.5),
          distantAmbienceVolume: Math.max(0.1, 0.5 - (energyNorm * 0.3)),
        },
        sfx: {
          sfxVolume: 1.0,
          spatialBlend: 0.8,
        },
        haptics: {
          intensity: hapticIntensity,
          durationMs: hapticIntensity > 0 ? 50 : 0,
          frequencyHz: 60 + Math.floor(energyNorm * 60),
          style: energyNorm > 0.8 ? 'heavy' : energyNorm > 0.4 ? 'medium' : 'light',
        },
      },
      weather: {
        cloudOpacity,
        skyBlend: Math.min(1.0, energyNorm * 1.1),
        fogDensity,
        windAnimationStrength,
        sunVisibility,
        ambientTintHex: energyNorm > 0.5 ? '#1e293b' : '#0f172a',
      },
      wildlife: {
        creatureDensity: worldState.wildlifeState.populationDensity,
        flockCohesion: worldState.wildlifeState.flockCohesion,
        activityLevel: worldState.wildlifeState.activityLevel,
        spiritAuraIntensity: Math.max(0.0, (worldState.wildlifeState.populationDensity - 0.5) * 2.0),
      },
      event: {
        activeEvent: worldState.eventState.activeEvent,
        pulseIntensity: worldState.eventState.intensity,
        screenGlowHex: worldState.eventState.activeEvent !== 0 ? '#00f0ff' : '#000000',
      },
      biome: {
        activeBiome: 0,
        blendRatio: 1.0,
        colorGradingHex: energyNorm > 0.5 ? '#10b981' : '#047857',
        splatWeights: [0.6, 0.2, 0.2, 0.0],
      },
      volumetricLighting: {
        sunshaftIntensity: Math.max(0.1, sunVisibility * 0.9),
        mieScatteringFactor: 0.75,
        fogHeightFalloff: 25.0 - (energyNorm * 5.0),
        lightShaftDensity: weatherState.mistDensity * 0.8,
        ambientGlowColorHex: energyNorm > 0.6 ? '#38bdf8' : '#1e293b',
      },
      instancedVegetation: {
        instanceCount: Math.floor(worldState.vegetationState.growth * 10000),
        windPhaseOffset: 0.0,
        swayFrequencyHz: 1.0 + (windAnimationStrength * 2.0),
        swayAmplitudeMeters: 0.1 + (windAnimationStrength * 0.4),
        bendingStiffness: 2.0,
        foliageColorTintHex: energyNorm > 0.7 ? '#10b981' : '#00f0ff',
      },
      particleField: {
        maxParticleCount: 50000,
        activeParticleCount: Math.min(50000, Math.floor(energyNorm * 50000)),
        flowSpeedMultiplier: 1.0 + (energyNorm * 2.0),
        kineticTurbulence: 0.1 + (energyNorm * 0.4),
        particleColorHex: energyNorm > 0.8 ? '#00f0ff' : '#10b981',
        fieldEmitterRadius: 30.0,
      },
      camera: {
        cameraMood: mood,
      },
      timestamp: Date.now(),
    };

    return this.lastSnapshot;
  }

  public getLastSnapshot(): Readonly<PresentationSnapshot> {
    return this.lastSnapshot;
  }
}
