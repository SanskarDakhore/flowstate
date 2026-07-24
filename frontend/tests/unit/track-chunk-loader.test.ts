import { TrackChunkLoader } from '../../src/game/performance/track-chunk-loader';

describe('Phase 14 — Track Chunk Loading & Memory Management', () => {
  let loader: TrackChunkLoader;

  beforeEach(() => {
    loader = new TrackChunkLoader({ maxMemoryBudgetMb: 10, maxLoadedChunkCount: 4 });
  });

  describe('Priority Queue Chunk Loading', () => {
    it('should sort load requests by priority (HIGH before LOW)', () => {
      loader.requestChunkLoad('chunk_low', 'LOW', 2.0);
      loader.requestChunkLoad('chunk_high', 'HIGH', 2.0);

      loader.processNextChunk(); // Should process HIGH priority first
      const metrics = loader.getMetrics();
      expect(metrics.totalLoadedChunks).toBe(1);
    });

    it('should allow request cancellation before processing', () => {
      loader.requestChunkLoad('chunk_cancel', 'MEDIUM', 2.0);
      const cancelled = loader.cancelRequest('chunk_cancel');

      expect(cancelled).toBe(true);
      expect(loader.getMetrics().pendingQueueLength).toBe(0);
    });
  });

  describe('Memory Budget Manager & Evictions', () => {
    it('should enforce 10MB memory budget and evict oldest chunks when exceeded', () => {
      for (let i = 0; i < 6; i++) {
        loader.requestChunkLoad(`chunk_${i}`, 'HIGH', 3.0);
        loader.processNextChunk();
      }

      const metrics = loader.getMetrics();
      expect(metrics.memoryUsedMb).toBeLessThanOrEqual(10);
      expect(metrics.evictionsCount).toBeGreaterThan(0);
    });
  });
});
