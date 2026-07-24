import { EngineLoopBenchmark } from '../../src/game/performance/engine-loop-benchmark';

describe('Phase 20 — Engine Loop Benchmark & Allocation Audit', () => {
  let benchmark: EngineLoopBenchmark;

  beforeEach(() => {
    benchmark = new EngineLoopBenchmark();
  });

  describe('Frame Time Percentile Calculation & Spikes', () => {
    it('should compute mean, P95, P99, and max frame time spike metrics', () => {
      for (let f = 0; f < 100; f++) {
        benchmark.recordFrameTime(16.0 + (f % 3));
      }
      benchmark.recordFrameTime(30.0); // Spike

      const report = benchmark.generateReport();

      expect(report.totalFramesEvaluated).toBe(101);
      expect(report.meanFrameTimeMs).toBeGreaterThan(15.0);
      expect(report.maxSpikeMs).toBe(30.0);
      expect(report.isPerformanceOptimal).toBe(true);
    });
  });

  describe('Allocation Audit Harness', () => {
    it('should audit zero-allocation loops across 1,000 continuous iterations', () => {
      let x = 0;
      const result = benchmark.runAllocationAudit(() => {
        x += 1;
      }, 1000);

      expect(result.zeroAllocationPassed).toBe(true);
      expect(x).toBe(1000);
    });
  });
});
