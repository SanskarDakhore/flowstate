export interface WeatherParameters {
  cloudCoverage: number;
  humidity: number;
  mistDensity: number;
  windSpeed: number;
  windDirection: number;
  airTemperature: number;
  visibility: number;
}

export class WeatherInterpolator {
  private static readonly INTERP_RATE = 0.5; // Exponential interpolation rate

  public interpolate(
    current: WeatherParameters,
    target: Readonly<WeatherParameters>,
    deltaTime: number
  ): void {
    if (deltaTime <= 0) return;

    const factor = 1.0 - Math.exp(-WeatherInterpolator.INTERP_RATE * deltaTime);

    current.cloudCoverage += (target.cloudCoverage - current.cloudCoverage) * factor;
    current.humidity += (target.humidity - current.humidity) * factor;
    current.mistDensity += (target.mistDensity - current.mistDensity) * factor;
    current.windSpeed += (target.windSpeed - current.windSpeed) * factor;
    current.windDirection += (target.windDirection - current.windDirection) * factor;
    current.airTemperature += (target.airTemperature - current.airTemperature) * factor;
    current.visibility += (target.visibility - current.visibility) * factor;
  }
}
