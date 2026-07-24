import { PipelineFrameDiagnostic, PipelineTelemetry } from '../../game/telemetry/pipeline-telemetry';

export class PipelineDebugPanel {
  private container: HTMLDivElement | null = null;
  private isVisible: boolean = false;

  public mount(parent: HTMLElement = document.body): void {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'flow-pipeline-debug-panel';
    this.container.style.position = 'absolute';
    this.container.style.top = '16px';
    this.container.style.left = '16px';
    this.container.style.width = '320px';
    this.container.style.padding = '12px';
    this.container.style.borderRadius = '8px';
    this.container.style.background = 'var(--flow-text-scrim, rgba(15, 23, 42, 0.85))';
    this.container.style.backdropFilter = 'blur(8px)';
    this.container.style.color = 'var(--flow-text-primary)';
    this.container.style.fontFamily = 'var(--flow-font-mono)';
    this.container.style.fontSize = '12px';
    this.container.style.zIndex = '9999';
    this.container.style.pointerEvents = 'none';
    this.container.style.border = 'var(--flow-hairline) solid var(--flow-text-ghost)';

    parent.appendChild(this.container);
    this.isVisible = true;
  }

  public update(diag: Readonly<PipelineFrameDiagnostic>): void {
    if (!this.container || !this.isVisible) return;

    const formatBadge = (time: number, budget: number) =>
      time <= budget
        ? `<span style="color:var(--flow-status-success);">✓ ${time.toFixed(2)}ms</span>`
        : `<span style="color:var(--flow-status-danger);">⚠ ${time.toFixed(2)}ms</span>`;

    this.container.innerHTML = `
      <div style="font-weight:bold; margin-bottom:6px; color:var(--flow-cyan-kinetic);">FLOWSTATE PIPELINE TELEMETRY</div>
      <div style="margin-bottom:4px;">Frame #${diag.frameIndex} | Total: ${formatBadge(diag.totalCpuTimeMs, PipelineTelemetry.BUDGETS.totalCpu)}</div>
      <hr style="border:0; border-top:var(--flow-hairline) solid var(--flow-text-ghost); margin:6px 0;" />
      <div>1. Gameplay .... ${formatBadge(diag.gameplayTimeMs, PipelineTelemetry.BUDGETS.gameplay)}</div>
      <div>2. Simulation .. ${formatBadge(diag.simulationTimeMs, PipelineTelemetry.BUDGETS.simulation)}</div>
      <div>3. Presentation ${formatBadge(diag.presentationTimeMs, PipelineTelemetry.BUDGETS.presentation)}</div>
      <div>4. Rendering ... ${formatBadge(diag.renderingTimeMs, PipelineTelemetry.BUDGETS.rendering)}</div>
      <hr style="border:0; border-top:var(--flow-hairline) solid var(--flow-text-ghost); margin:6px 0;" />
      <div style="color:var(--flow-text-muted);">Subsystems Updated: ${diag.subsystemUpdateCount} | Skips: ${diag.subsystemCacheSkips}</div>
    `;
  }

  public unmount(): void {
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.container = null;
    this.isVisible = false;
  }
}
