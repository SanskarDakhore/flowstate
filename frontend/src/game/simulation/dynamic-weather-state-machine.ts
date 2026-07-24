import {
  DynamicWeatherChangeEvent,
  DynamicWeatherState,
  DynamicWeatherTransitionConfig,
  DynamicWeatherType,
  EnvironmentalVariables,
} from '@flowstate/shared';

export const DEFAULT_WEATHER_CONFIG: DynamicWeatherTransitionConfig = {
  minDurationSeconds: 60.0,
  transitionDurationSeconds: 5.0,
  rainFrictionScalar: 0.75,
  stormEnergyScalar: 1.5,
};

interface WeatherProfile {
  readonly moisture: number;
  readonly sunlight: number;
  readonly temperature: number;
  readonly tractionMultiplier: number;
  readonly energyChargeRate: number;
}

const WEATHER_PROFILES: Record<DynamicWeatherType, WeatherProfile> = {
  CLEAR_SUNNY: {
    moisture: 0.2,
    sunlight: 1.0,
    temperature: 25.0,
    tractionMultiplier: 1.0,
    energyChargeRate: 1.0,
  },
  MISTY_RAIN: {
    moisture: 0.95,
    sunlight: 0.3,
    temperature: 18.0,
    tractionMultiplier: 0.75,
    energyChargeRate: 1.1,
  },
  ELECTRICAL_STORM: {
    moisture: 1.0,
    sunlight: 0.15,
    temperature: 15.0,
    tractionMultiplier: 0.65,
    energyChargeRate: 1.5,
  },
  SOLAR_AURORA: {
    moisture: 0.4,
    sunlight: 0.85,
    temperature: 20.0,
    tractionMultiplier: 1.1,
    energyChargeRate: 1.3,
  },
};

export class DynamicWeatherStateMachine {
  private config: DynamicWeatherTransitionConfig;
  private currentWeather: DynamicWeatherType = 'CLEAR_SUNNY';
  private targetWeather: DynamicWeatherType = 'CLEAR_SUNNY';
  private isTransitioning: boolean = false;
  private transitionTimer: number = 0.0;
  private totalTimeSeconds: number = 0.0;
  private timeInCurrentWeather: number = 0.0;

  constructor(config: DynamicWeatherTransitionConfig = DEFAULT_WEATHER_CONFIG) {
    this.config = config;
  }

  public transitionTo(newWeather: DynamicWeatherType): DynamicWeatherChangeEvent | null {
    if (newWeather === this.targetWeather) return null;

    const previous = this.currentWeather;
    this.targetWeather = newWeather;
    this.isTransitioning = true;
    this.transitionTimer = 0.0;

    return {
      previousWeather: previous,
      newWeather,
      timestampSeconds: this.totalTimeSeconds,
    };
  }

  public stepSimulation(deltaTimeSeconds: number = 0.016, playerKineticEnergy: number = 0.0): DynamicWeatherState {
    this.totalTimeSeconds += deltaTimeSeconds;
    this.timeInCurrentWeather += deltaTimeSeconds;

    if (this.isTransitioning) {
      this.transitionTimer += deltaTimeSeconds;
      if (this.transitionTimer >= this.config.transitionDurationSeconds) {
        this.currentWeather = this.targetWeather;
        this.isTransitioning = false;
        this.transitionTimer = 0.0;
        this.timeInCurrentWeather = 0.0;
      }
    }

    const alpha = this.isTransitioning
      ? Math.min(1.0, this.transitionTimer / this.config.transitionDurationSeconds)
      : 1.0;

    const sourceProfile = WEATHER_PROFILES[this.currentWeather];
    const targetProfile = WEATHER_PROFILES[this.targetWeather];

    // Lerp weather parameters
    const moisture = sourceProfile.moisture + (targetProfile.moisture - sourceProfile.moisture) * alpha;
    const sunlight = sourceProfile.sunlight + (targetProfile.sunlight - sourceProfile.sunlight) * alpha;
    const temperature = sourceProfile.temperature + (targetProfile.temperature - sourceProfile.temperature) * alpha;
    const tractionMultiplier =
      sourceProfile.tractionMultiplier +
      (targetProfile.tractionMultiplier - sourceProfile.tractionMultiplier) * alpha;
    const energyChargeRate =
      sourceProfile.energyChargeRate +
      (targetProfile.energyChargeRate - sourceProfile.energyChargeRate) * alpha;

    const envVariables: EnvironmentalVariables = {
      moisture,
      sunlight,
      kineticEnergy: playerKineticEnergy,
      temperature,
    };

    return {
      currentWeather: this.currentWeather,
      targetWeather: this.targetWeather,
      isTransitioning: this.isTransitioning,
      transitionProgress: alpha,
      timeInCurrentWeatherSeconds: this.timeInCurrentWeather,
      envVariables,
      tractionMultiplier,
      energyChargeRate,
    };
  }
}
