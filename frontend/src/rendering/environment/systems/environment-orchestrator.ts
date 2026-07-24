import { PresentationSnapshot, RenderFrameContext } from '@flowstate/shared';
import { LightingSystem } from './lighting-system';
import { SkySystem } from './sky-system';
import { TerrainRenderer } from './terrain-renderer';
import { VegetationSystem } from './vegetation-system';
import { AtmosphereSystem } from './atmosphere-system';
import { ParticleSystem } from './particle-system';
import { WeatherRenderer } from '../weather/weather-renderer';
import { WildlifeRenderer } from '../wildlife/wildlife-renderer';
import { EventRenderer } from '../events/event-renderer';
import { BiomeRenderer } from '../biome/biome-renderer';
import { VolumetricRenderer } from '../volumetrics/volumetric-renderer';
import { InstancedVegetationRenderer } from '../vegetation/instanced-vegetation-renderer';
import { ParticleFieldRenderer } from '../particles/particle-field-renderer';
import { EnvironmentSubsystem } from './environment-subsystem';

export interface EnvironmentOrchestratorDependencies {
  lighting: EnvironmentSubsystem<any>;
  sky: EnvironmentSubsystem<any>;
  terrain: EnvironmentSubsystem<any>;
  vegetation: EnvironmentSubsystem<any>;
  atmosphere: EnvironmentSubsystem<any>;
  particles: EnvironmentSubsystem<any>;
  weather: EnvironmentSubsystem<any>;
  wildlife: EnvironmentSubsystem<any>;
  event: EnvironmentSubsystem<any>;
  biome: EnvironmentSubsystem<any>;
  volumetricLighting: EnvironmentSubsystem<any>;
  instancedVegetation: EnvironmentSubsystem<any>;
  particleField: EnvironmentSubsystem<any>;
}

export class EnvironmentOrchestrator {
  private deps: EnvironmentOrchestratorDependencies;
  private frameIndex: number = 0;

  constructor(deps?: Partial<EnvironmentOrchestratorDependencies>) {
    this.deps = {
      lighting: deps?.lighting ?? new LightingSystem(),
      sky: deps?.sky ?? new SkySystem(),
      terrain: deps?.terrain ?? new TerrainRenderer(),
      vegetation: deps?.vegetation ?? new VegetationSystem(),
      atmosphere: deps?.atmosphere ?? new AtmosphereSystem(),
      particles: deps?.particles ?? new ParticleSystem(),
      weather: deps?.weather ?? new WeatherRenderer(),
      wildlife: deps?.wildlife ?? new WildlifeRenderer(),
      event: deps?.event ?? new EventRenderer(),
      biome: deps?.biome ?? new BiomeRenderer(),
      volumetricLighting: deps?.volumetricLighting ?? new VolumetricRenderer(),
      instancedVegetation: deps?.instancedVegetation ?? new InstancedVegetationRenderer(),
      particleField: deps?.particleField ?? new ParticleFieldRenderer(),
    };
  }

  public update(snapshot: Readonly<PresentationSnapshot>, deltaTime: number = 0.016): void {
    this.frameIndex++;
    const context: RenderFrameContext = {
      deltaTime,
      frameIndex: this.frameIndex,
      qualityTier: 'high',
    };

    // Delegate composed substates to respective subsystems with change detection
    this.deps.lighting.update(snapshot.lighting, context);
    this.deps.sky.update(snapshot.sky, context);
    this.deps.terrain.update(snapshot.terrain, context);
    this.deps.vegetation.update(snapshot.vegetation, context);
    this.deps.atmosphere.update(snapshot.atmosphere, context);
    this.deps.particles.update(snapshot.particles, context);
    this.deps.weather.update(snapshot.weather, context);
    this.deps.wildlife.update(snapshot.wildlife, context);
    this.deps.event.update(snapshot.event, context);
    this.deps.biome.update(snapshot.biome, context);
    this.deps.volumetricLighting.update(snapshot.volumetricLighting, context);
    this.deps.instancedVegetation.update(snapshot.instancedVegetation, context);
    this.deps.particleField.update(snapshot.particleField, context);
  }

  public getDependencies(): Readonly<EnvironmentOrchestratorDependencies> {
    return this.deps;
  }

  public dispose(): void {
    this.deps.lighting.dispose?.();
    this.deps.sky.dispose?.();
    this.deps.terrain.dispose?.();
    this.deps.vegetation.dispose?.();
    this.deps.atmosphere.dispose?.();
    this.deps.particles.dispose?.();
    this.deps.weather.dispose?.();
    this.deps.wildlife.dispose?.();
    this.deps.event.dispose?.();
    this.deps.biome.dispose?.();
    this.deps.volumetricLighting.dispose?.();
    this.deps.instancedVegetation.dispose?.();
    this.deps.particleField.dispose?.();
  }
}







