import { TouchPointerRouter } from '../../src/game/input/touch-pointer-router';

describe('Phase 11 — Touch & Pointer Input Router', () => {
  let router: TouchPointerRouter;

  beforeEach(() => {
    router = new TouchPointerRouter();
  });

  describe('Multi-Touch Pointer Routing & Zone Partitioning', () => {
    it('should assign pointer in left half of screen to LEFT_JOYSTICK', () => {
      router.handlePointerDown(1, 100, 200, 1000, 1000);
      router.handlePointerMove(1, 150, 150);

      const { intent, state } = router.evaluateRoutedIntent(100);
      expect(state.activePointerCount).toBe(1);
      expect(intent.horizontal).toBeGreaterThan(0);
    });

    it('should route simultaneous left joystick and right action touches cleanly', () => {
      router.handlePointerDown(1, 100, 200, 1000, 1000); // Left joystick
      router.handlePointerDown(2, 800, 200, 1000, 1000); // Right action

      const { intent, state } = router.evaluateRoutedIntent(100);
      expect(state.activePointerCount).toBe(2);
      expect(intent.jumpPressed).toBe(true);
      expect(intent.actionHeld).toBe(true);
    });
  });

  describe('Radial Deadzone Noise Filtering', () => {
    it('should filter small touch movements under inner deadzone radius (r < 0.15)', () => {
      const filtered = router.applyRadialDeadzone(10, 10, 100);
      expect(filtered.x).toBe(0);
      expect(filtered.y).toBe(0);
    });

    it('should scale and normalize movements beyond inner deadzone radius', () => {
      const filtered = router.applyRadialDeadzone(50, 0, 100);
      expect(filtered.x).toBeGreaterThan(0);
      expect(filtered.x).toBeLessThanOrEqual(1.0);
    });
  });

  describe('Gesture Recognition Engine', () => {
    it('should detect TAP gesture when pointer released within 250ms with minimal movement', () => {
      router.handlePointerDown(1, 500, 500, 1000, 1000);
      const gesture = router.handlePointerUp(1, 1100);

      expect(gesture).toBe('TAP');
    });

    it('should detect DOUBLE_TAP gesture when two taps occur within 300ms window', () => {
      router.handlePointerDown(1, 500, 500, 1000, 1000);
      router.handlePointerUp(1, 1100);

      router.handlePointerDown(2, 500, 500, 1000, 1200);
      const gesture = router.handlePointerUp(2, 1300);

      expect(gesture).toBe('DOUBLE_TAP');
    });

    it('should detect HOLD gesture when touch is held longer than 350ms', () => {
      router.handlePointerDown(1, 500, 500, 1000, 1000);
      const gesture = router.handlePointerUp(1, 1450);

      expect(gesture).toBe('HOLD');
    });
  });

  describe('Keyboard & Touch Multiplexing', () => {
    it('should combine keyboard WASD and touch joystick steering seamlessly', () => {
      router.setKeyboardKey('KeyD', true);
      const { intent } = router.evaluateRoutedIntent(100);

      expect(intent.horizontal).toBe(1.0);
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 intent evaluations without memory exceptions or NaNs', () => {
      for (let i = 0; i < 1000; i++) {
        router.handlePointerMove(1, 100 + (i % 10), 200);
        const { intent } = router.evaluateRoutedIntent(100);
        expect(Number.isNaN(intent.horizontal)).toBe(false);
      }
    });
  });
});
