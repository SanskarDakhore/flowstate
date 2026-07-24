import { WeatherController } from '../../src/game/weather/weather-controller';
import { WeatherType, createDefaultWorldInput } from '@flowstate/shared';

describe('Weather Simulation Engine & Transition Stability', () => {
  let controller: WeatherController;

  beforeEach(() => {
    controller = new WeatherController();
  });

  it('should initialize with default Clear weather', () => {
    const snap = controller.getCurrentSnapshot();
    expect(snap.weatherType).toBe(WeatherType.Clear);
    expect(snap.cloudCoverage).toBeCloseTo(0.1);
  });

  it('should transition smoothly between Clear -> Breezy -> Overcast -> Mist as environmental energy rises without random number generators', () => {
    // 1. Low energy input
    const lowInput = createDefaultWorldInput();
    const snap1 = controller.update(lowInput, 1.0);
    expect(snap1.weatherType).toBe(WeatherType.Clear);

    // 2. High energy & harmony input -> triggers Breezy
    const breezyInput = {
      ...lowInput,
      environmentEnergy: 30.0,
      harmony: 0.8,
    };
    const snap2 = controller.update(breezyInput, 1.0);
    expect(snap2.weatherType).toBe(WeatherType.Breezy);
    expect(snap2.windSpeed).toBeGreaterThan(5.0);

    // 3. Very high energy -> triggers Overcast
    const overcastInput = {
      ...lowInput,
      environmentEnergy: 60.0,
      harmony: 0.9,
    };
    controller.update(overcastInput, 2.0); // Allow humidity to accumulate
    const snap3 = controller.update(overcastInput, 1.0);
    expect(snap3.weatherType).toBe(WeatherType.Overcast);
  });

  it('should maintain hysteresis buffer preventing rapid oscillation on threshold edges', () => {
    const input = {
      ...createDefaultWorldInput(),
      environmentEnergy: 30.0,
      harmony: 0.8,
    };

    controller.update(input, 1.0); // Reaches Breezy
    expect(controller.getCurrentSnapshot().weatherType).toBe(WeatherType.Breezy);

    // Minor dip should maintain Breezy due to hysteresis
    const inputDip = {
      ...input,
      environmentEnergy: 22.0,
    };
    controller.update(inputDip, 0.1);
    expect(controller.getCurrentSnapshot().weatherType).toBe(WeatherType.Breezy);
  });
});
