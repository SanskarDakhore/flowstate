import { WeatherType } from '@flowstate/shared';

export class WeatherStateMachine {
  public evaluateState(
    energy: number,
    harmony: number,
    humidity: number,
    recovery: number,
    currentType: WeatherType
  ): WeatherType {
    if (currentType === WeatherType.Clear) {
      if (energy >= 25.0 && harmony >= 0.5) return WeatherType.Breezy;
      return WeatherType.Clear;
    }
    if (currentType === WeatherType.Breezy) {
      if (energy >= 50.0 && humidity >= 0.6) return WeatherType.Overcast;
      if (energy < 15.0) return WeatherType.Clear;
      return WeatherType.Breezy;
    }
    if (currentType === WeatherType.Overcast) {
      if (energy >= 75.0 && humidity >= 0.8) return WeatherType.Mist;
      if (energy < 40.0) return WeatherType.Breezy;
      return WeatherType.Overcast;
    }
    if (currentType === WeatherType.Mist) {
      if (recovery >= 0.8 && energy < 20.0) return WeatherType.Clear;
      if (energy < 60.0) return WeatherType.Overcast;
      return WeatherType.Mist;
    }
    return WeatherType.Clear;
  }
}
