import {
  AllocationAuditResult,
  EngineBenchmarkReport,
} from '@flowstate/shared';

export class EngineLoopBenchmark {
  private frameTimesMs: number[] = [];

  public recordFrameTime(frameTimeMs: number): void {
    this.frameTimesMs.push(frameTimeMs);
  }

  public generateReport(): EngineBenchmarkReport {
    if (this.frameTimesMs.length === 0) {
      return {
        totalFramesEvaluated: 0,
        meanFrameTimeMs: 0,
        p95FrameTimeMs: 0,
        p99FrameTimeMs: 0,
        maxSpikeMs: 0,
        isPerformanceOptimal: true,
      };
    }

    const sorted = [...this.frameTimesMs].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;

    const p95Idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
    const p99Idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));

    const p95 = sorted[p95Idx];
    const p99 = sorted[p99Idx];
    const maxSpike = sorted[sorted.length - 1];

    // Performance is optimal if mean frame time <= 20.0ms (>=50 FPS) and max spike <= 33.4ms
    const isPerformanceOptimal = mean <= 20.0 && maxSpike <= 33.4;

    return {
      totalFramesEvaluated: sorted.length,
      meanFrameTimeMs: mean,
      p95FrameTimeMs: p95,
      p99FrameTimeMs: p99,
      maxSpikeMs: maxSpike,
      isPerformanceOptimal,
    };
  }

  public runAllocationAudit(stepFunction: () => void, steps: number = 1000): AllocationAuditResult {
    const gcFn = (global as any).gc;
    if (typeof gcFn === 'function') {
      gcFn();
    }

    const initialHeap = process.memoryUsage().heapUsed;

    for (let i = 0; i < steps; i++) {
      stepFunction();
    }

    if (typeof gcFn === 'function') {
      gcFn();
    }

    const finalHeap = process.memoryUsage().heapUsed;
    const delta = finalHeap - initialHeap;

    return {
      initialHeapBytes: initialHeap,
      finalHeapBytes: finalHeap,
      shallowHeapDeltaBytes: delta,
      zeroAllocationPassed: delta <= 1024 * 1024, // Within 1MB test runner tolerance
    };
  }

  public reset(): void {
    this.frameTimesMs = [];
  }
}
