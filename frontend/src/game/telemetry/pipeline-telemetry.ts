import { PerformanceState, createDefaultPerformanceState } from '@flowstate/shared';

export interface PipelineFrameDiagnostic {
  readonly frameIndex: number;
  readonly deltaTime: number;
  readonly gameplayTimeMs: number;
  readonly simulationTimeMs: number;
  readonly presentationTimeMs: number;
  readonly renderingTimeMs: number;
  readonly totalCpuTimeMs: number;
  readonly subsystemUpdateCount: number;
  readonly subsystemCacheSkips: number;
  readonly isWithinBudget: boolean;
  readonly performanceState: PerformanceState;
  readonly timestamp: number;
}

export class PipelineTelemetry {
  private static readonly MAX_HISTORY = 120;
  private ringBuffer: PipelineFrameDiagnostic[] = [];
  private currentFrameIndex: number = 0;

  // Static SLA Budgets in ms
  public static readonly BUDGETS = {
    gameplay: 0.5,
    simulation: 0.5,
    presentation: 0.5,
    rendering: 2.5,
    totalCpu: 5.0,
  };

  public recordFrame(
    gameplayTimeMs: number,
    simulationTimeMs: number,
    presentationTimeMs: number,
    renderingTimeMs: number,
    subsystemUpdateCount: number,
    subsystemCacheSkips: number,
    deltaTime: number = 0.016,
    perfState?: PerformanceState
  ): PipelineFrameDiagnostic {
    this.currentFrameIndex++;
    const totalCpuTimeMs = gameplayTimeMs + simulationTimeMs + presentationTimeMs + renderingTimeMs;
    const isWithinBudget =
      gameplayTimeMs <= PipelineTelemetry.BUDGETS.gameplay &&
      simulationTimeMs <= PipelineTelemetry.BUDGETS.simulation &&
      presentationTimeMs <= PipelineTelemetry.BUDGETS.presentation &&
      renderingTimeMs <= PipelineTelemetry.BUDGETS.rendering &&
      totalCpuTimeMs <= PipelineTelemetry.BUDGETS.totalCpu;

    const diagnostic: PipelineFrameDiagnostic = {
      frameIndex: this.currentFrameIndex,
      deltaTime,
      gameplayTimeMs,
      simulationTimeMs,
      presentationTimeMs,
      renderingTimeMs,
      totalCpuTimeMs,
      subsystemUpdateCount,
      subsystemCacheSkips,
      isWithinBudget,
      performanceState: perfState ?? createDefaultPerformanceState(),
      timestamp: Date.now(),
    };

    if (this.ringBuffer.length >= PipelineTelemetry.MAX_HISTORY) {
      this.ringBuffer.shift();
    }
    this.ringBuffer.push(diagnostic);

    return diagnostic;
  }

  public getHistory(): ReadonlyArray<PipelineFrameDiagnostic> {
    return this.ringBuffer;
  }

  public getLatestDiagnostic(): Readonly<PipelineFrameDiagnostic> | null {
    return this.ringBuffer.length > 0 ? this.ringBuffer[this.ringBuffer.length - 1] : null;
  }

  public clear(): void {
    this.ringBuffer = [];
    this.currentFrameIndex = 0;
  }
}
