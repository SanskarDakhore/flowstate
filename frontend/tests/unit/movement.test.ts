import { MovementController } from '../../src/game/movement/movement-controller';
import { GuidedFlowMovement } from '../../src/game/movement/models/guided-flow-movement';
import { FreeFlowMovement } from '../../src/game/movement/models/free-flow-movement';
import { MathFlowPath } from '../../src/game/movement/flow-path';
import { clampIntentValue, sanitizeIntent } from '../../src/game/movement/movement-intent';
import { DEFAULT_GUIDED_FLOW_CONFIG, DEFAULT_FREE_FLOW_CONFIG } from '../../src/game/movement/movement-config';
import { PlayerState } from '../../src/game/movement/movement-types';

describe('Movement System Framework Independence & Intent Tests', () => {
  test('clampIntentValue should sanitize NaN, infinite, and out-of-bound inputs', () => {
    expect(clampIntentValue(1.5)).toBe(1.0);
    expect(clampIntentValue(-2.0)).toBe(-1.0);
    expect(clampIntentValue(0.5)).toBe(0.5);
    expect(clampIntentValue(NaN)).toBe(0);
    expect(clampIntentValue(Infinity)).toBe(0);
  });

  test('sanitizeIntent should clamp partial intent parameters correctly', () => {
    const raw = { horizontal: 2.0, vertical: -1.8, jumpPressed: true };
    const sanitized = sanitizeIntent(raw);

    expect(sanitized.horizontal).toBe(1.0);
    expect(sanitized.vertical).toBe(-1.0);
    expect(sanitized.jumpPressed).toBe(true);
  });

  test('Movement configurations should have positive base values', () => {
    expect(DEFAULT_GUIDED_FLOW_CONFIG.baseForwardSpeed).toBeGreaterThan(0);
    expect(DEFAULT_FREE_FLOW_CONFIG.baseForwardSpeed).toBeGreaterThan(0);
    expect(DEFAULT_GUIDED_FLOW_CONFIG.maximumLateralOffset).toBeGreaterThan(0);
  });
});

describe('Movement Model Switching and Reset Behavior', () => {
  test('MovementController switches models and resets simulation state cleanly', () => {
    const controller = new MovementController('guided-flow');
    expect(controller.getActiveModelId()).toBe('guided-flow');

    // Perform continuous simulation updates
    controller.update({ horizontal: 0.5, vertical: 0.2 }, 0.016);
    controller.update({ horizontal: 0.5, vertical: 0.2 }, 0.016);
    const movedState = controller.getPlayerState();
    expect(movedState.position.z).toBeGreaterThan(0);

    // Switch to Free Flow
    controller.switchModel('free-flow');
    expect(controller.getActiveModelId()).toBe('free-flow');

    // State must be cleanly reset to origin
    const resetState = controller.getPlayerState();
    expect(resetState.position.x).toBe(0);
    expect(resetState.position.y).toBe(0);
    expect(resetState.position.z).toBe(0);
  });
});

describe('Timestep Tolerance Testing (30 FPS vs 60 FPS vs 120 FPS)', () => {
  test('Guided Flow trajectory over 5 seconds remains consistent across framerates within 5% tolerance', () => {
    const durationSeconds = 5.0;

    const createDefaultState = (): PlayerState => ({
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
    });

    const runSimulationAtFps = (fps: number) => {
      const model = new GuidedFlowMovement();
      let state = createDefaultState();
      model.initialize(state);

      const dt = 1.0 / fps;
      const steps = Math.round(durationSeconds / dt);
      const intent = sanitizeIntent({ horizontal: 0.4, vertical: -0.2, actionHeld: false, jumpPressed: false });

      for (let i = 0; i < steps; i++) {
        state = model.update(state, intent, dt);
      }
      return state;
    };

    const result30 = runSimulationAtFps(30);
    const result60 = runSimulationAtFps(60);
    const result120 = runSimulationAtFps(120);

    // Assert forward distance Z is within 5% tolerance across frame rates
    const deltaZ_30_60 = Math.abs(result30.position.z - result60.position.z) / result60.position.z;
    const deltaZ_60_120 = Math.abs(result60.position.z - result120.position.z) / result120.position.z;

    expect(deltaZ_30_60).toBeLessThan(0.05);
    expect(deltaZ_60_120).toBeLessThan(0.05);
  });
});

describe('Free Flow Boundary Restitution', () => {
  test('Free Flow model prevents lateral offset from exceeding boundary limit indefinitely', () => {
    const path = new MathFlowPath();
    const model = new FreeFlowMovement(undefined, path);
    let state: PlayerState = {
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
    model.initialize(state);

    const intent = sanitizeIntent({ horizontal: 1.0, vertical: 0.0, actionHeld: false, jumpPressed: false });
    const dt = 0.016;

    for (let i = 0; i < 500; i++) {
      state = model.update(state, intent, dt);
    }

    const frame = path.getTrackFrame(model.getProgress());
    const dx = state.position.x - frame.center.x;
    const dy = state.position.y - frame.center.y;
    const dz = state.position.z - frame.center.z;
    const lateralOffset = dx * frame.right.x + dy * frame.right.y + dz * frame.right.z;

    expect(Math.abs(lateralOffset)).toBeLessThanOrEqual(DEFAULT_FREE_FLOW_CONFIG.maximumLateralOffset + 0.01);
  });
});
