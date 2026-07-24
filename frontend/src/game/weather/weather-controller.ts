import { WeatherState, WeatherType, WorldInputSnapshot } from '@flowstate/shared';
import { WeatherStateMachine } from './weather-state-machine';
import { WeatherTransitionEngine } from './weather-transition-engine';
import { WeatherInterpolator, WeatherParameters } from './weather-interpolator';

export class WeatherController {
  private stateMachine = new WeatherStateMachine();
  private transitionEngine = new WeatherTransitionEngine();
  private interpolator = new WeatherInterpolator();

  private currentWeatherType: WeatherType = WeatherType.Clear;
  private targetWeatherType: WeatherType = WeatherType.Clear;
  private transitionProgress: number = 1.0;

  private currentParams: WeatherParameters = {
    cloudCoverage: 0.1,
    humidity: 0.3,
    mistDensity: 0.0,
    windSpeed: 5.0,
    windDirection: 45.0,
    airTemperature: 22.0,
    visibility: 1.0,
  };

  public update(worldInput: Readonly<WorldInputSnapshot>, deltaTime: number): Readonly<WeatherState> {
    if (deltaTime <= 0) return this.getCurrentSnapshot();

    // 1. Evaluate State Transition with Hysteresis (0 Math.random())
    const nextType = this.stateMachine.evaluateState(
      worldInput.environmentEnergy,
      worldInput.harmony,
      this.currentParams.humidity,
      worldInput.recovery,
      this.currentWeatherType
    );

    if (nextType !== this.currentWeatherType) {
      this.currentWeatherType = nextType;
      this.targetWeatherType = nextType;
      this.transitionProgress = 0.0;
    }

    if (this.transitionProgress < 1.0) {
      this.transitionProgress = Math.min(1.0, this.transitionProgress + deltaTime * 0.2);
    }

    // 2. Exponential Parameter Interpolation
    const targetParams = this.transitionEngine.getTargetParameters(this.currentWeatherType, worldInput.environmentEnergy);
    this.interpolator.interpolate(this.currentParams, targetParams, deltaTime);

    return this.getCurrentSnapshot();
  }

  public getCurrentSnapshot(): WeatherState {
    return {
      weatherType: this.currentWeatherType,
      cloudCoverage: this.currentParams.cloudCoverage,
      humidity: this.currentParams.humidity,
      mistDensity: this.currentParams.mistDensity,
      windSpeed: this.currentParams.windSpeed,
      windDirection: this.currentParams.windDirection,
      airTemperature: this.currentParams.airTemperature,
      visibility: this.currentParams.visibility,
      atmosphericEnergy: this.currentParams.cloudCoverage * 100.0,
      transitionProgress: this.transitionProgress,
      timestamp: Date.now(),
    };
  }

  public reset(): void {
    this.currentWeatherType = WeatherType.Clear;
    this.targetWeatherType = WeatherType.Clear;
    this.transitionProgress = 1.0;
    this.currentParams = {
      cloudCoverage: 0.1,
      humidity: 0.3,
      mistDensity: 0.0,
      windSpeed: 5.0,
      windDirection: 45.0,
      airTemperature: 22.0,
      visibility: 1.0,
    };
  }
}
