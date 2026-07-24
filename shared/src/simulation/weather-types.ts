import { EnvironmentalVariables } from './ecosystem-types';

export type DynamicWeatherType = 'CLEAR_SUNNY' | 'MISTY_RAIN' | 'ELECTRICAL_STORM' | 'SOLAR_AURORA';

export interface DynamicWeatherTransitionConfig {
  readonly minDurationSeconds: number;
  readonly transitionDurationSeconds: number;
  readonly rainFrictionScalar: number; // e.g. 0.75x
  readonly stormEnergyScalar: number;  // e.g. 1.5x
}

export interface DynamicWeatherState {
  readonly currentWeather: DynamicWeatherType;
  readonly targetWeather: DynamicWeatherType;
  readonly isTransitioning: boolean;
  readonly transitionProgress: number; // [0.0, 1.0]
  readonly timeInCurrentWeatherSeconds: number;
  readonly envVariables: EnvironmentalVariables;
  readonly tractionMultiplier: number;
  readonly energyChargeRate: number;
}

export interface DynamicWeatherChangeEvent {
  readonly previousWeather: DynamicWeatherType;
  readonly newWeather: DynamicWeatherType;
  readonly timestampSeconds: number;
}
