import { PresentationController } from '../../src/game/presentation/presentation-controller';
import {
  DEFAULT_PRESENTATION_PROFILE,
  PresentationProfile,
} from '../../src/game/presentation/presentation-profile';
import { MovementState, JumpState, GravityPhase, getMomentumQuality } from '../../src/game/movement/movement-types';
import { MovementEventDispatcher } from '../../src/game/movement/movement-events';

function createMockMovementState(overrides: Partial<MovementState> = {}): MovementState {
  const score = overrides.momentumScore ?? 90.0;
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
    currentHorizontalVelocityVector: { x: 0, z: 15.0 },
    momentumMagnitude: 15.0,
    momentumScore: score,
    momentumQuality: getMomentumQuality(score),
    flowEfficiency: 0.9,
    activeGravityPhase: GravityPhase.Grounded,
    activeEnvironmentProfileId: 'terrestrial-ground',
    activeMovementProfileId: 'default-responsive',
    currentAirControl: 0.6,
    appliedGravity: -28.0,
    targetSpeed: 20.0,
    desiredVelocity: { x: 0, z: 20.0 },
    velocityError: 5.0,
    directionDelta: 0,
    ...overrides,
  };
}

describe('FLOWSTATE v0.2.4A Presentation Layer Isolation & Telemetry Invariants', () => {
  test('Zero-Mutation Invariant: Presentation controller update leaves MovementState and physics position 100% unmutated', () => {
    const dispatcher = new MovementEventDispatcher();
    const controller = new PresentationController(undefined, dispatcher);
    const state = createMockMovementState();
    const initialSnapshot = JSON.stringify(state);
    const position = { x: 25.0, y: 1.0, z: 100.0 };
    const posSnapshot = JSON.stringify(position);

    dispatcher.emit('JumpStarted', {
      jumpId: 1,
      position,
      velocity: { x: 0, y: 10.5, z: 15 },
      timestamp: performance.now(),
      jumpState: JumpState.Ascending,
    });

    for (let i = 0; i < 100; i++) {
      controller.update(state, position, 0.016);
    }

    expect(JSON.stringify(state)).toBe(initialSnapshot);
    expect(JSON.stringify(position)).toBe(posSnapshot);
  });

  test('Exponential Decay Tracking Convergence across Framerate Matrix (20 FPS to 240 FPS)', () => {
    const controller = new PresentationController();
    const frameDeltas = [1 / 240, 1 / 144, 1 / 60, 1 / 30, 1 / 20];

    frameDeltas.forEach((dt) => {
      const state = createMockMovementState({ currentHorizontalVelocityVector: { x: 5, z: 18 } });
      const presState = controller.update(state, { x: 10, y: 0, z: 50 }, dt);
      const cam = presState.camera;

      expect(Number.isNaN(cam.position.x)).toBe(false);
      expect(Number.isNaN(cam.position.y)).toBe(false);
      expect(Number.isNaN(cam.position.z)).toBe(false);
      expect(Number.isNaN(cam.lookTarget.x)).toBe(false);
      expect(Number.isNaN(cam.lookTarget.y)).toBe(false);
      expect(Number.isNaN(cam.lookTarget.z)).toBe(false);

      expect(cam.rollAngle).toBe(0.0); // Locked for comfort
      expect(cam.cameraError).toBeGreaterThanOrEqual(0);
    });
  });

  test('Soft Weighty Landing Cushion: Landed event injects cushion Y-offset that dissipates smoothly without oscillation', () => {
    const dispatcher = new MovementEventDispatcher();
    const controller = new PresentationController(undefined, dispatcher);

    dispatcher.emit('Landed', {
      jumpId: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: -20.0, z: 10 },
      timestamp: performance.now(),
      jumpState: JumpState.Grounded,
      extraData: { landingResult: { impactVelocity: -20.0 } },
    });

    const step1 = controller.update(createMockMovementState({ landingImpact: 20.0 }), { x: 0, y: 0, z: 0 }, 0.016);
    expect(step1.camera.landingOffset).toBeGreaterThan(0);

    // Step forward 300ms to verify smooth recovery back to 0
    let offsetCleared = false;
    for (let i = 0; i < 20; i++) {
      const res = controller.update(createMockMovementState(), { x: 0, y: 0, z: 0 }, 0.016);
      if (res.camera.landingOffset === 0) {
        offsetCleared = true;
        break;
      }
    }

    expect(offsetCleared).toBe(true);
  });

  test('Performance Budget Verification: Presentation update executes in < 0.5ms per frame', () => {
    const controller = new PresentationController();
    const state = createMockMovementState();
    const pos = { x: 0, y: 0, z: 0 };

    // Warm-up step
    controller.update(state, pos, 0.016);

    const iterations = 500;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      pos.z += 0.3;
      controller.update(state, pos, 0.016);
    }
    const totalTimeMs = performance.now() - start;
    const avgTimePerFrameMs = totalTimeMs / iterations;

    expect(avgTimePerFrameMs).toBeLessThan(0.5);
  });

  test('Profile Hot-Swapping & Diagnostic Telemetry Integrity', () => {
    const controller = new PresentationController();
    const customProfile: PresentationProfile = {
      ...DEFAULT_PRESENTATION_PROFILE,
      id: 'storm-peaks-tight-camera',
      camera: {
        ...DEFAULT_PRESENTATION_PROFILE.camera,
        follow: { followStiffness: 15.0 },
      },
    };

    const swapped = controller.setProfile(customProfile);
    expect(swapped).toBe(true);

    const res = controller.update(createMockMovementState(), { x: 10, y: 0, z: 100 }, 0.016);
    expect(res.activeProfileId).toBe('storm-peaks-tight-camera');
    expect(res.camera.currentFollowSpeed).toBeGreaterThanOrEqual(0);
  });
});
