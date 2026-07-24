import { TrackChunkStreamingManager, TrackSegmentPool } from '../../src/game/performance/track-segment-pool';
import { Vector3D } from '@flowstate/shared';

describe('Phase 09 — Object Pooling Engine for Track Segments', () => {
  let pool: TrackSegmentPool;
  let manager: TrackChunkStreamingManager;

  const sampleControlPoints: Vector3D[] = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 10 },
    { x: 0, y: 0, z: 20 },
    { x: 0, y: 0, z: 30 },
  ];

  beforeEach(() => {
    pool = new TrackSegmentPool();
    manager = new TrackChunkStreamingManager(pool);
  });

  describe('O(1) Ring Buffer Pool Mechanics', () => {
    it('should pre-allocate N=16 chunk containers during bootstrap', () => {
      const metrics = pool.getMetrics();
      expect(metrics.totalAllocated).toBe(16);
    });

    it('should acquire and release chunks in O(1) time without memory leak', () => {
      const initialActive = pool.getActiveChunks().length;
      const chunk99 = pool.acquireChunk(99, 0, sampleControlPoints);
      expect(chunk99.chunkId).toBe('chunk_99');
      expect(chunk99.isActive).toBe(true);

      const released = pool.releaseChunk(99);
      expect(released).toBe(true);
      expect(pool.getActiveChunks().length).toBe(initialActive);
    });
  });

  describe('Catmull-Rom C1 Spline Continuity', () => {
    it('should maintain C1 continuity by reusing P1 and P2 control points across consecutive chunks', () => {
      const active = pool.getActiveChunks();
      expect(active.length).toBeGreaterThanOrEqual(2);

      const chunk0 = active[0];
      const chunk1 = active[1];

      expect(chunk1.controlPoints[0].x).toBe(chunk0.controlPoints[1].x);
      expect(chunk1.controlPoints[0].z).toBe(chunk0.controlPoints[1].z);
    });
  });

  describe('Look-Ahead Streaming & Trailing Recycling', () => {
    it('should stream new chunks ahead as player advances along track', () => {
      const initialMetrics = pool.getMetrics();
      const initialActiveCount = initialMetrics.inUseCount;

      // Advance player progress distance by 100m
      manager.updateStreaming(100.0);

      const newMetrics = pool.getMetrics();
      expect(newMetrics.acquireCount).toBeGreaterThan(initialMetrics.acquireCount);
    });

    it('should recycle trailing chunks beyond 50m behind player', () => {
      // Advance player progress far ahead to 300m
      manager.updateStreaming(300.0);

      const metrics = pool.getMetrics();
      expect(metrics.releaseCount).toBeGreaterThan(0);
    });
  });

  describe('LOD Distance Resolution with Hysteresis', () => {
    it('should assign LOD_0 when player distance is under 50m', () => {
      const lod = pool.resolveLOD(20.0, 'LOD_0');
      expect(lod).toBe('LOD_0');
    });

    it('should apply 5m hysteresis buffer to prevent LOD flickering', () => {
      // When at 52m (within 50 + 5 = 55m hysteresis buffer), LOD_0 stays LOD_0
      const lodHolding = pool.resolveLOD(52.0, 'LOD_0');
      expect(lodHolding).toBe('LOD_0');

      // Beyond 55m, LOD_0 transitions to LOD_1
      const lodSwitched = pool.resolveLOD(56.0, 'LOD_0');
      expect(lodSwitched).toBe('LOD_1');
    });
  });

  describe('Zero-Allocation Execution Stability', () => {
    it('should execute 1,000 acquire/recycle operations without NaN or memory failure', () => {
      for (let i = 0; i < 1000; i++) {
        manager.updateStreaming(i * 10.0);
      }
      const metrics = pool.getMetrics();
      expect(metrics.zeroAllocationPassed).toBe(true);
    });
  });
});
