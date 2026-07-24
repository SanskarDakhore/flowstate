import { CameraPresentationController } from '../../src/game/presentation/camera-presentation-controller';
import { CameraBehaviorProfile, CameraIntent } from '../../src/game/presentation/presentation-profile';

describe('Phase 05 — Dynamic Camera System & FOV Scaling', () => {
  let controller: CameraPresentationController;
  let testProfile: CameraBehaviorProfile;

  beforeEach(() => {
    testProfile = {
      follow: { followStiffness: 8.0 },
      lookAhead: { lookAheadFactor: 0.15, maxDistance: 4.5 },
      jump: { verticalFramingBias: 1.2 },
      landing: { landingCushionAbsorption: 0.8, cushionRecoveryMs: 300 },
      fov: { baseFov: 0.8, maxFovSpeedExpansion: 0.2 },
    };

    controller = new CameraPresentationController(testProfile);
  });

  const createIntent = (speed: number, verticalVelocity: number = 0): CameraIntent => ({
    targetPosition: { x: 0, y: 0, z: 10 },
    velocity: { x: 0, y: 0, z: speed },
    desiredFacingDirection: { x: 0, y: 0, z: 1 },
    speed,
    isGrounded: verticalVelocity === 0,
    verticalVelocity,
    landingImpact: 0,
  });

  describe('Speed-Proportional Dynamic FOV Scaling', () => {
    it('should scale FOV monotonically with player speed', () => {
      const stateIdle = controller.update(createIntent(0), 0.1);
      const initialFov = stateIdle.fov;

      const stateFast = controller.update(createIntent(20.0), 0.1);
      expect(stateFast.fov).toBeGreaterThan(initialFov);
    });
  });

  describe('Toggleable Camera Angle Modes', () => {
    it('should switch between camera angle presets and update target offset vectors', () => {
      controller.setMode('Playing');
      const statePlaying = controller.update(createIntent(10), 0.1);

      controller.setMode('LowAngleChase');
      const stateLowAngle = controller.update(createIntent(10), 0.1);

      expect(controller.getMode()).toBe('LowAngleChase');
      expect(stateLowAngle.activeMode).toBe('LowAngleChase');
      expect(stateLowAngle.position.y).toBeLessThan(statePlaying.position.y);
    });

    it('should update dynamic orbit angle in DynamicOrbit mode', () => {
      controller.setMode('DynamicOrbit');
      const state1 = controller.update(createIntent(0), 0.05);
      const state2 = controller.update(createIntent(0), 0.05);

      expect(state2.position.x).not.toBe(state1.position.x);
    });
  });

  describe('Landing Cushion & Recovery', () => {
    it('should absorb landing impact and recover downward cushion offset', () => {
      controller.triggerLandingCushion(20.0);
      const stateImpact = controller.update(createIntent(0), 0.016);

      expect(stateImpact.landingOffset).toBeGreaterThan(0);

      // Advance time beyond recovery window (300ms = 4 x 100ms ticks)
      for (let i = 0; i < 4; i++) {
        controller.update(createIntent(0), 0.1);
      }
      const stateRecovered = controller.getState();
      expect(stateRecovered.landingOffset).toBe(0);
    });
  });

  describe('Framerate Independence & Zero Allocation', () => {
    it('should produce zero NaN or Infinity values over 1,000 steps', () => {
      for (let i = 0; i < 1000; i++) {
        const state = controller.update(createIntent(15.0), 0.016);
        expect(Number.isNaN(state.position.x)).toBe(false);
        expect(Number.isNaN(state.position.y)).toBe(false);
        expect(Number.isNaN(state.position.z)).toBe(false);
        expect(Number.isFinite(state.fov)).toBe(true);
      }
    });
  });
});
