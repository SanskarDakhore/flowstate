import { EventCascadeController } from '../../src/game/events/event-cascade-controller';
import { WorldEventEnum, createDefaultWorldInput } from '@flowstate/shared';

describe('World Event & Resonance Cascade Simulation', () => {
  let controller: EventCascadeController;

  beforeEach(() => {
    controller = new EventCascadeController();
  });

  it('should initialize with no active world event', () => {
    const snap = controller.getCurrentSnapshot();
    expect(snap.activeEvent).toBe(WorldEventEnum.None);
    expect(snap.intensity).toBe(0.0);
  });

  it('should trigger BloomBurst event when energy and growth potential reach threshold without random number generators', () => {
    const burstInput = {
      ...createDefaultWorldInput(),
      environmentEnergy: 65.0,
      growthPotential: 0.85,
    };

    controller.update(burstInput, 0.1);
    const snap = controller.getCurrentSnapshot();
    expect(snap.activeEvent).toBe(WorldEventEnum.BloomBurst);
    expect(snap.intensity).toBeGreaterThan(0.0);
    expect(snap.timeRemainingMs).toBeGreaterThan(0);
  });

  it('should trigger TranscendentCascade event on peak flow energy and harmony', () => {
    const peakInput = {
      ...createDefaultWorldInput(),
      environmentEnergy: 95.0,
      harmony: 0.98,
    };

    controller.update(peakInput, 0.1);
    const snap = controller.getCurrentSnapshot();
    expect(snap.activeEvent).toBe(WorldEventEnum.TranscendentCascade);
    expect(snap.intensity).toBe(1.0);
  });
});
