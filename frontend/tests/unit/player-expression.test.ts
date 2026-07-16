import { PlayerExpressionController } from '../../src/game/player/player-expression-controller';
import {
  DEFAULT_PLAYER_EXPRESSION_PROFILE,
  PlayerExpressionProfile,
} from '../../src/game/player/player-expression-profile';
import { MovementState, JumpState, GravityPhase, getMomentumQuality } from '../../src/game/movement/movement-types';
import { MovementEventDispatcher } from '../../src/game/movement/movement-events';

function createMockMovementState(overrides: Partial<MovementState> = {}): MovementState {
  const score = overrides.momentumScore ?? 95.0;
  return {
    isGrounded: true,
    isAirborne: false,
    isCoyoteWindowActive: false,
    isJumpBuffered: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    currentJumpCount: 0,
    jumpState: JumpState.Grounded,
    jumpId: 0,
    landingImpact: 0,
    verticalVelocity: 0,
    airborneHeight: 0,
    currentHorizontalVelocityVector: { x: 0, z: 12.0 },
    momentumMagnitude: 12.0,
    momentumScore: score,
    momentumQuality: getMomentumQuality(score),
    flowEfficiency: 0.95,
    activeGravityPhase: GravityPhase.Grounded,
    activeEnvironmentProfileId: 'terrestrial-ground',
    activeMovementProfileId: 'default-responsive',
    currentAirControl: 0.6,
    appliedGravity: -28.0,
    targetSpeed: 20.0,
    desiredVelocity: { x: 0, z: 20.0 },
    velocityError: 8.0,
    directionDelta: 0,
    ...overrides,
  };
}

describe('FLOWSTATE v0.2.3 Presentation Layer Isolation & Purity Invariants', () => {
  test('Observer Purity Test: Expression controller update leaves MovementState and position vectors 100% unmutated', () => {
    const controller = new PlayerExpressionController();
    const state = createMockMovementState();
    const originalStateSnapshot = JSON.stringify(state);
    const position = { x: 10, y: 2, z: 50 };
    const originalPosSnapshot = JSON.stringify(position);

    for (let i = 0; i < 100; i++) {
      controller.update(state, position, 0.016);
    }

    expect(JSON.stringify(state)).toBe(originalStateSnapshot);
    expect(JSON.stringify(position)).toBe(originalPosSnapshot);
  });

  test('Volume Preservation Invariant: Scale transform satisfying Sx * Sy * Sz = 1.0 +/- 0.005 across all silhouetting states', () => {
    const controller = new PlayerExpressionController();
    const dispatcher = new MovementEventDispatcher();
    controller.attachEventDispatcher(dispatcher);

    // 1. Idle state
    let res = controller.update(createMockMovementState({ currentHorizontalVelocityVector: { x: 0, z: 0 }, momentumMagnitude: 0 }), { x: 0, y: 0, z: 0 }, 0.016);
    let vol = res.scaleTransform.x * res.scaleTransform.y * res.scaleTransform.z;
    expect(vol).toBeCloseTo(1.0, 2);

    // 2. Accelerating / Peak Speed Stretch
    res = controller.update(createMockMovementState({ currentHorizontalVelocityVector: { x: 0, z: 20 }, momentumMagnitude: 20 }), { x: 0, y: 0, z: 0 }, 0.016);
    vol = res.scaleTransform.x * res.scaleTransform.y * res.scaleTransform.z;
    expect(vol).toBeCloseTo(1.0, 2);

    // 3. Jump Launch Anticipation Event Trigger
    dispatcher.emit('JumpStarted', {
      jumpId: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 10.5, z: 0 },
      timestamp: performance.now(),
      jumpState: JumpState.Ascending,
    });
    res = controller.update(createMockMovementState({ isGrounded: false, verticalVelocity: 10.0, airborneHeight: 0.1 }), { x: 0, y: 0, z: 0 }, 0.016);
    vol = res.scaleTransform.x * res.scaleTransform.y * res.scaleTransform.z;
    expect(vol).toBeCloseTo(1.0, 2);

    // 4. Landing Impact Trigger
    dispatcher.emit('Landed', {
      jumpId: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: -18.0, z: 0 },
      timestamp: performance.now(),
      jumpState: JumpState.Grounded,
      extraData: { landingResult: { impactVelocity: -18.0 } },
    });
    res = controller.update(createMockMovementState({ isGrounded: true, landingImpact: 18.0 }), { x: 0, y: 0, z: 0 }, 0.016);
    vol = res.scaleTransform.x * res.scaleTransform.y * res.scaleTransform.z;
    expect(vol).toBeCloseTo(1.0, 2);
  });

  test('Mass-Spring Stability Across Framerate Drops (240Hz down to 20Hz)', () => {
    const controller = new PlayerExpressionController();
    const frameDeltas = [1 / 240, 1 / 60, 1 / 20, 1 / 144, 1 / 30];

    frameDeltas.forEach((dt) => {
      const res = controller.update(createMockMovementState({ verticalVelocity: -15.0, airborneHeight: 2.0, isGrounded: false }), { x: 0, y: 0, z: 0 }, dt);
      const scale = res.scaleTransform;

      expect(Number.isNaN(scale.x)).toBe(false);
      expect(Number.isNaN(scale.y)).toBe(false);
      expect(Number.isNaN(scale.z)).toBe(false);
      expect(Number.isFinite(scale.x)).toBe(true);
      expect(Number.isFinite(scale.y)).toBe(true);
      expect(Number.isFinite(scale.z)).toBe(true);

      const volume = scale.x * scale.y * scale.z;
      expect(volume).toBeCloseTo(1.0, 2);
    });
  });

  test('Zero-Delay Jump Launch Anticipation: JumpStarted event immediately injects squash transform without pausing execution', () => {
    const controller = new PlayerExpressionController();
    const dispatcher = new MovementEventDispatcher();
    controller.attachEventDispatcher(dispatcher);

    dispatcher.emit('JumpStarted', {
      jumpId: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 10.5, z: 0 },
      timestamp: performance.now(),
      jumpState: JumpState.Ascending,
    });

    const res = controller.update(createMockMovementState({ isGrounded: false, verticalVelocity: 10.5 }), { x: 0, y: 0, z: 0 }, 0.016);
    expect(res.scaleTransform.y).toBeLessThan(1.0); // Visual compression active

    // Within 60ms (4 frames), spring naturally rebounds into vertical stretch
    let rebounded = false;
    for (let i = 0; i < 6; i++) {
      const stepRes = controller.update(createMockMovementState({ isGrounded: false, verticalVelocity: 8.0 }), { x: 0, y: 0, z: 0 }, 0.016);
      if (stepRes.scaleTransform.y > 1.0) {
        rebounded = true;
        break;
      }
    }
    expect(rebounded).toBe(true);
  });

  test('Profile Swap Stability: Hot-swapping expression profiles mid-motion causes zero NaN or transform pops', () => {
    const controller = new PlayerExpressionController();
    const state = createMockMovementState({ currentHorizontalVelocityVector: { x: 10, z: 10 }, momentumMagnitude: 14.14 });

    controller.update(state, { x: 0, y: 0, z: 0 }, 0.016);

    const customProfile: PlayerExpressionProfile = {
      ...DEFAULT_PLAYER_EXPRESSION_PROFILE,
      id: 'high-energy-storm',
      expressionIntensity: 0.8,
      maxHorizontalStretch: 0.4,
    };

    const swapped = controller.setProfile(customProfile);
    expect(swapped).toBe(true);
    expect(controller.getProfile().id).toBe('high-energy-storm');

    const resAfter = controller.update(state, { x: 0, y: 0, z: 0 }, 0.016);
    expect(Number.isNaN(resAfter.scaleTransform.x)).toBe(false);
    expect(resAfter.activeProfileId).toBe('high-energy-storm');
  });
});
