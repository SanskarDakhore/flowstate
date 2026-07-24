export interface EngineBenchmarkReport {
  readonly totalFramesEvaluated: number;
  readonly meanFrameTimeMs: number;
  readonly p95FrameTimeMs: number;
  readonly p99FrameTimeMs: number;
  readonly maxSpikeMs: number;
  readonly isPerformanceOptimal: boolean;
}

export interface AllocationAuditResult {
  readonly initialHeapBytes: number;
  readonly finalHeapBytes: number;
  readonly shallowHeapDeltaBytes: number;
  readonly zeroAllocationPassed: boolean;
}
