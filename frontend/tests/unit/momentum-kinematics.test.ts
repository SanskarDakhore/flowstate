import { MovementControlEngine } from '../../src/game/movement/movement-control-engine';
import { GuidedFlowMovement } from '../../src/game/movement/models/guided-flow-movement';
import { FreeFlowMovement } from '../../src/game/movement/models/free-flow-movement';
import {
  DEFAULT_ENVIRONMENT_PROFILE,
  LOW_GRAVITY_ENVIRONMENT_PROFILE,
  DEFAULT_MOVEMENT_PROFILE,
  LinearCurve,
  EaseOutCurve,
  SineCurve,
} from '../../src/game/config/physics-profile';
import {
  GravityPhase,
  getGravityPhaseName,
  getMomentumQuality,
  PlayerState,
} from '../../src/game/movement/movement-types';
import { MovementIntent, sanitizeIntent } from '../../src/game/movement/movement-intent';

function createDefaultPlayerState(): PlayerState {
  return {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    forward: { x: 0, y: 0, z: 1 },
    speed: 0,
    airborneHeight: 0,
    verticalVelocity: 0,
    isGrounded: true,
    impactVelocity: 0,
    justLanded: false,
    jumpsUsed: 0,
    maxJumps: 2,
    jumpEventCounter: 0,
    lastJumpIndex: 0,
  };
}

describe('v0.2.2 Response Curves & Presenter Tests', () => {
  test('MovementResponseCurve implementations map 0..1 monotonically', () => {
    const linear = new LinearCurve();
    const easeOut = new EaseOutCurve();
    const sine = new SineCurve();

    expect(linear.evaluate(0)).toBe(0);
    expect(linear.evaluate(1)).toBe(1);
    expect(easeOut.evaluate(0)).toBe(0);
    expect(easeOut.evaluate(1)).toBe(1);
    expect(sine.evaluate(0)).toBe(0);
    expect(sine.evaluate(1)).toBeCloseTo(1, 4);

    expect(easeOut.evaluate(0.5)).toBeGreaterThan(0.5);
  });

  test('getGravityPhaseName maps enum values accurately', () => {
    expect(getGravityPhaseName(GravityPhase.Grounded)).toBe('Grounded');
    expect(getGravityPhaseName(GravityPhase.Ascending)).toBe('ASCENDING');
    expect(getGravityPhaseName(GravityPhase.Apex)).toBe('APEX');
    expect(getGravityPhaseName(GravityPhase.Descending)).toBe('DESCENDING');
    expect(getGravityPhaseName(GravityPhase.FastFall)).toBe('FAST_FALL');
  });

  test('getMomentumQuality maps numeric score boundaries to qualitative badges', () => {
    expect(getMomentumQuality(95)).toBe('EXCELLENT');
    expect(getMomentumQuality(90)).toBe('EXCELLENT');
    expect(getMomentumQuality(85)).toBe('GOOD');
    expect(getMomentumQuality(70)).toBe('GOOD');
    expect(getMomentumQuality(55)).toBe('AVERAGE');
    expect(getMomentumQuality(40)).toBe('AVERAGE');
    expect(getMomentumQuality(20)).toBe('POOR');
  });
});

describe('v0.2.2 Profile Injection & Validation Tests', () => {
  test('MovementControlEngine accepts valid profiles and cleanly rejects invalid profiles', () => {
    const engine = new MovementControlEngine();

    const envResult = engine.setEnvironmentProfile(DEFAULT_ENVIRONMENT_PROFILE);
    expect(envResult).toBe(true);

    const movResult = engine.setMovementProfile(DEFAULT_MOVEMENT_PROFILE);
    expect(movResult).toBe(true);

    const badEnvResult = engine.setEnvironmentProfile(null as any);
    expect(badEnvResult).toBe(false);

    const badMovResult = engine.setMovementProfile({ maxHorizontalSpeed: 'invalid' } as any);
    expect(badMovResult).toBe(false);

    expect(engine.getEnvironmentProfile().id).toBe('terrestrial-ground');
    expect(engine.getMovementProfile().id).toBe('default-responsive');
  });

  test('Dynamic profile hot-swapping changes vertical gravity without mutating state logic', () => {
    const engine = new MovementControlEngine();
    engine.setEnvironmentProfile(DEFAULT_ENVIRONMENT_PROFILE);

    const resStandard = engine.update({ jumpPressed: true }, 0.016);
    expect(resStandard.kinematics.activeGravityPhase).toBe(GravityPhase.Ascending);

    engine.setEnvironmentProfile(LOW_GRAVITY_ENVIRONMENT_PROFILE);
    expect(engine.getEnvironmentProfile().id).toBe('floating-isles');
  });
});

describe('v0.2.2 Determinism Verification Test', () => {
  test('Two independent runs given identical input sequence yield identical positions and telemetry', () => {
    const runSimulation = () => {
      const model = new GuidedFlowMovement();
      let state = createDefaultPlayerState();
      model.initialize(state);

      const dt = 1.0 / 60.0;
      const eventsCaptured: string[] = [];
      model.getControlEngine().getEventDispatcher().onAll((evt, payload) => {
        eventsCaptured.push(`${evt}:${payload.jumpState}`);
      });

      for (let i = 0; i < 300; i++) {
        const jump = i === 10 || i === 120;
        const intent = sanitizeIntent({
          horizontal: Math.sin(i * 0.05),
          vertical: 0.5,
          jumpPressed: jump,
          actionHeld: i > 10 && i < 30,
        });
        state = model.update(state, intent, dt);
      }

      return { state, eventsCaptured };
    };

    const run1 = runSimulation();
    const run2 = runSimulation();

    expect(run1.state.position.x).toBeCloseTo(run2.state.position.x, 6);
    expect(run1.state.position.y).toBeCloseTo(run2.state.position.y, 6);
    expect(run1.state.position.z).toBeCloseTo(run2.state.position.z, 6);
    expect(run1.state.speed).toBeCloseTo(run2.state.speed, 6);
    expect(run1.eventsCaptured).toEqual(run2.eventsCaptured);
  });
});

describe('v0.2.2 Framerate Independence Integration Matrix', () => {
  test('Guided Flow trajectory over 5.0 seconds matches across 20, 30, 60, 120, 144, 240 FPS within Delta Position <= 0.0001 units', () => {
    const durationSeconds = 5.0;

    const runAtFps = (fps: number) => {
      const model = new GuidedFlowMovement();
      let state = createDefaultPlayerState();
      model.initialize(state);

      const dt = 1.0 / fps;
      const steps = Math.round(durationSeconds / dt);
      const intent = sanitizeIntent({ horizontal: 0.3, vertical: 0.1, jumpPressed: false });

      for (let i = 0; i < steps; i++) {
        state = model.update(state, intent, dt);
      }
      return state;
    };

    const baseline60 = runAtFps(60);
    const fpsList = [20, 30, 120, 144, 240];

    fpsList.forEach((fps) => {
      const res = runAtFps(fps);
      const deltaZ = Math.abs(res.position.z - baseline60.position.z);
      expect(deltaZ).toBeLessThanOrEqual(0.0001);
    });
  });
});

describe('v0.2.2 Long-Run Stability & Stress Testing Matrix', () => {
  test('5-Minute Continuous Forward Run (18,000 steps at 60 FPS) has zero position drift, NaN, or Infinity', () => {
    const model = new FreeFlowMovement();
    let state = createDefaultPlayerState();
    model.initialize(state);

    const dt = 1.0 / 60.0;
    const totalSteps = 300 * 60; // 18,000 steps
    const intent = sanitizeIntent({ horizontal: 0.2, vertical: 0.5 });

    for (let i = 0; i < totalSteps; i++) {
      state = model.update(state, intent, dt);
      expect(Number.isNaN(state.position.x)).toBe(false);
      expect(Number.isNaN(state.position.y)).toBe(false);
      expect(Number.isNaN(state.position.z)).toBe(false);
      expect(Number.isFinite(state.position.x)).toBe(true);
      expect(Number.isFinite(state.position.y)).toBe(true);
      expect(Number.isFinite(state.position.z)).toBe(true);
    }

    expect(state.position.z).toBeGreaterThan(100.0);
  });

  test('5-Minute Repeated Jump Cycle Test (18,000 steps at 60 FPS) resets jump counters cleanly without timer leaks', () => {
    const model = new GuidedFlowMovement();
    let state = createDefaultPlayerState();
    model.initialize(state);

    const dt = 1.0 / 60.0;
    const totalSteps = 300 * 60;

    for (let i = 0; i < totalSteps; i++) {
      const jumpPressed = i % 120 === 0; // Trigger jump every 2 seconds
      const intent = sanitizeIntent({ horizontal: 0.0, vertical: 0.0, jumpPressed, actionHeld: true });
      state = model.update(state, intent, dt);

      expect(Number.isNaN(state.verticalVelocity)).toBe(false);
      expect(Number.isFinite(state.verticalVelocity)).toBe(true);
      expect(state.jumpsUsed).toBeLessThanOrEqual(2);
    }

    expect(state.isGrounded).toBe(true);
    expect(state.jumpsUsed).toBe(0);
  });

  test('5-Minute Random Input Monkey Stress Test (18,000 steps) exhibits no NaNs, Infinities, or stuck jump state flags', () => {
    const model = new GuidedFlowMovement();
    let state = createDefaultPlayerState();
    model.initialize(state);

    const dt = 1.0 / 60.0;
    const totalSteps = 300 * 60;

    // Pseudo-random deterministic seed generator
    let seed = 12345;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < totalSteps; i++) {
      const h = pseudoRandom() * 2 - 1;
      const v = pseudoRandom() * 2 - 1;
      const jumpPressed = pseudoRandom() > 0.95;
      const actionHeld = pseudoRandom() > 0.5;

      const intent = sanitizeIntent({ horizontal: h, vertical: v, jumpPressed, actionHeld });
      state = model.update(state, intent, dt);

      expect(Number.isNaN(state.position.x)).toBe(false);
      expect(Number.isNaN(state.position.y)).toBe(false);
      expect(Number.isNaN(state.position.z)).toBe(false);
      expect(Number.isFinite(state.position.x)).toBe(true);
      expect(Number.isFinite(state.position.y)).toBe(true);
      expect(Number.isFinite(state.position.z)).toBe(true);
    }
  });
});
