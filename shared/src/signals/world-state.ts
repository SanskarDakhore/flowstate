import { WeatherState, createDefaultWeatherState } from './weather-state';
import { VegetationGrowthState, createDefaultVegetationGrowthState } from './vegetation-state';
import { WildlifeState, createDefaultWildlifeState } from './wildlife-state';
import { WorldEventState, createDefaultWorldEventState } from './event-state';

export enum WorldStateEnum {
  IDLE = 0,
  AWAKENING = 1,
  GROWING = 2,
  BLOOMING = 3,
  THRIVING = 4,
  TRANSCENDENT = 5,
}

export interface WorldStateSnapshot {
  readonly currentState: WorldStateEnum;
  readonly targetState: WorldStateEnum;
  readonly transitionProgress: number;
  readonly energyBuffer: number;
  readonly growthWeight: number;
  readonly vegetationWeight: number;
  readonly weatherWeight: number;
  readonly musicWeight: number;
  readonly wildlifeWeight: number;
  readonly weatherState: WeatherState;
  readonly vegetationState: VegetationGrowthState;
  readonly wildlifeState: WildlifeState;
  readonly eventState: WorldEventState;
  readonly timestamp: number;
}

export function createDefaultWorldStateSnapshot(): WorldStateSnapshot {
  return {
    currentState: WorldStateEnum.IDLE,
    targetState: WorldStateEnum.IDLE,
    transitionProgress: 1.0,
    energyBuffer: 0,
    growthWeight: 0,
    vegetationWeight: 0,
    weatherWeight: 0,
    musicWeight: 0,
    wildlifeWeight: 0,
    weatherState: createDefaultWeatherState(),
    vegetationState: createDefaultVegetationGrowthState(),
    wildlifeState: createDefaultWildlifeState(),
    eventState: createDefaultWorldEventState(),
    timestamp: Date.now(),
  };
}




