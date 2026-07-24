import { ViewportManager } from '../../src/rendering/engine/viewport-manager';

describe('Phase 19 — Canvas Viewport Management & Auto-Resizing', () => {
  let manager: ViewportManager;

  beforeEach(() => {
    manager = new ViewportManager();
  });

  describe('DPR Scaling & Canvas Resolution', () => {
    it('should clamp devicePixelRatio strictly between minDPR (1.0) and maxDPR (2.0)', () => {
      const state = manager.updateViewport(1920, 1080, 3.0);
      expect(state.currentDPR).toBe(2.0);
      expect(state.canvasWidthPx).toBe(3840);
    });

    it('should calculate accurate aspect ratio on window resize', () => {
      const state = manager.updateViewport(1920, 1080, 1.0);
      expect(state.aspectRatio).toBeCloseTo(1.7778, 3);
    });
  });

  describe('Dynamic Resolution Downscaling', () => {
    it('should downscale DPR to minDPR (1.0) when frame lag spike is detected', () => {
      const state = manager.updateViewport(1920, 1080, 2.0, true);
      expect(state.isDownscaled).toBe(true);
      expect(state.currentDPR).toBe(1.0);
    });
  });
});
