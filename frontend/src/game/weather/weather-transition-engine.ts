import { WeatherType } from '@flowstate/shared';
import { WeatherParameters } from './weather-interpolator';

export class WeatherTransitionEngine {
  public getTargetParameters(weatherType: WeatherType, energy: number): WeatherParameters {
    const energyNorm = Math.min(1.0, Math.max(0.0, energy / 100.0));

    switch (weatherType) {
      case WeatherType.Clear:
        return {
          cloudCoverage: 0.1,
          humidity: 0.3,
          mistDensity: 0.0,
          windSpeed: 5.0,
          windDirection: 45.0,
          airTemperature: 22.0,
          visibility: 1.0,
        };
      case WeatherType.Breezy:
        return {
          cloudCoverage: 0.3,
          humidity: Math.min(0.85, 0.5 + (energyNorm * 0.35)),
          mistDensity: 0.05,
          windSpeed: 18.0 + (energyNorm * 10.0),
          windDirection: 60.0,
          airTemperature: 20.0,
          visibility: 0.9,
        };
      case WeatherType.Overcast:
        return {
          cloudCoverage: 0.75,
          humidity: 0.7,
          mistDensity: 0.2,
          windSpeed: 25.0,
          windDirection: 90.0,
          airTemperature: 18.0,
          visibility: 0.75,
        };
      case WeatherType.Mist:
      default:
        return {
          cloudCoverage: 0.9,
          humidity: 0.95,
          mistDensity: 0.6,
          windSpeed: 8.0,
          windDirection: 120.0,
          airTemperature: 16.0,
          visibility: 0.5,
        };
    }
  }
}
