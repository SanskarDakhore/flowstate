export enum WeatherType {
  Clear = 0,
  Breezy = 1,
  Overcast = 2,
  Mist = 3,
}

export interface WeatherState {
  readonly weatherType: WeatherType;
  readonly cloudCoverage: number;
  readonly humidity: number;
  readonly mistDensity: number;
  readonly windSpeed: number;
  readonly windDirection: number;
  readonly airTemperature: number;
  readonly visibility: number;
  readonly atmosphericEnergy: number;
  readonly transitionProgress: number;
  readonly timestamp: number;
}

export interface PresentationWeatherState {
  readonly cloudOpacity: number;
  readonly skyBlend: number;
  readonly fogDensity: number;
  readonly windAnimationStrength: number;
  readonly sunVisibility: number;
  readonly ambientTintHex: string;
}

export function createDefaultWeatherState(): WeatherState {
  return {
    weatherType: WeatherType.Clear,
    cloudCoverage: 0.1,
    humidity: 0.3,
    mistDensity: 0.0,
    windSpeed: 5.0,
    windDirection: 45.0,
    airTemperature: 22.0,
    visibility: 1.0,
    atmosphericEnergy: 10.0,
    transitionProgress: 1.0,
    timestamp: Date.now(),
  };
}

export function createDefaultPresentationWeatherState(): PresentationWeatherState {
  return {
    cloudOpacity: 0.1,
    skyBlend: 0.1,
    fogDensity: 0.005,
    windAnimationStrength: 0.1,
    sunVisibility: 1.0,
    ambientTintHex: '#0f172a',
  };
}
