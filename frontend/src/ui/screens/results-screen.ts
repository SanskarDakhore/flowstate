export interface ResultsScreenData {
  targetsPassed: number;
  totalTargets: number;
  finalScore: number;
  harmonyPct: number;
  durationSeconds: number;
}

export type ResultsActionCallback = () => void;

export class ResultsScreen {
  private container: HTMLDivElement | null = null;
  private data: ResultsScreenData;
  private onRetryCallback?: ResultsActionCallback;
  private onReturnCallback?: ResultsActionCallback;
  private isFading: boolean = false;
  private animFrameIds: number[] = [];

  constructor(
    data: ResultsScreenData,
    onRetry?: ResultsActionCallback,
    onReturnToVoid?: ResultsActionCallback
  ) {
    this.data = data;
    this.onRetryCallback = onRetry;
    this.onReturnCallback = onReturnToVoid;
    this.createDomElements();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('flow-results-screen-root');
    if (existing) existing.remove();

    this.container = document.createElement('div');
    this.container.id = 'flow-results-screen-root';
    this.container.className = 'flow-screen flow-results-screen';

    this.container.innerHTML = `
      <div class="flow-results-header flow-reveal" style="animation-delay: 0.1s;">
        <div class="flow-eyebrow">PHASE RESONANCE COMPLETE</div>
        <div class="flow-results-title">Performance Summary</div>
      </div>

      <div class="flow-results-stats flow-reveal" style="animation-delay: 0.25s;">
        <div>
          <div class="flow-stat-label">Resonance Score</div>
          <div id="flow-stat-score" class="flow-stat-score">0</div>
        </div>

        <div class="flow-stat-divider" aria-hidden="true"></div>

        <div class="flow-stat-grid">
          <div>
            <div class="flow-stat-label">Targets Cleared</div>
            <div class="flow-stat-value"><span id="flow-stat-targets">0</span> / ${this.data.totalTargets}</div>
          </div>

          <div>
            <div class="flow-stat-label">Harmony Peak</div>
            <div class="flow-stat-value flow-stat-value--mint"><span id="flow-stat-harmony">0</span>%</div>
          </div>
        </div>
      </div>

      <div class="flow-results-actions flow-reveal" style="animation-delay: 0.4s;">
        <button id="flow-btn-retry" class="flow-action-button flow-results-primary" type="button">Run Again</button>
        <button id="flow-btn-return" class="flow-results-secondary" type="button">Return to Title</button>
      </div>
    `;

    document.body.appendChild(this.container);

    const btnRetry = this.container.querySelector('#flow-btn-retry') as HTMLButtonElement;
    const btnReturn = this.container.querySelector('#flow-btn-return') as HTMLButtonElement;

    if (btnRetry) {
      btnRetry.addEventListener('click', () => this.handleAction(this.onRetryCallback));
    }

    if (btnReturn) {
      btnReturn.addEventListener('click', () => this.handleAction(this.onReturnCallback));
    }

    this.startTickingOdometer();
  }

  private startTickingOdometer(): void {
    const scoreEl = this.container?.querySelector('#flow-stat-score');
    const targetsEl = this.container?.querySelector('#flow-stat-targets');
    const harmonyEl = this.container?.querySelector('#flow-stat-harmony');

    const durationMs = 600;
    const startTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const elapsed = Math.min(durationMs, now - startTime);
      const progress = elapsed / durationMs;
      const easeProgress = this.easeOutExpo(progress);

      if (scoreEl) {
        const currentScore = Math.round(this.data.finalScore * easeProgress);
        scoreEl.textContent = currentScore.toLocaleString();
      }

      if (targetsEl) {
        const currentTargets = Math.round(this.data.targetsPassed * easeProgress);
        targetsEl.textContent = currentTargets.toString();
      }

      if (harmonyEl) {
        const currentHarmony = Math.round(this.data.harmonyPct * easeProgress);
        harmonyEl.textContent = currentHarmony.toString();
      }

      if (elapsed < durationMs) {
        const frameId = requestAnimationFrame(animate);
        this.animFrameIds.push(frameId);
      }
    };

    const frameId = requestAnimationFrame(animate);
    this.animFrameIds.push(frameId);
  }

  private easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  private handleAction(callback?: ResultsActionCallback): void {
    if (this.isFading || !this.container) return;
    this.isFading = true;

    this.container.style.opacity = '0';

    const onFadeEnd = () => {
      this.dispose();
      if (callback) {
        callback();
      }
    };

    this.container.addEventListener('transitionend', onFadeEnd, { once: true });
    setTimeout(onFadeEnd, 350);
  }

  public dispose(): void {
    for (const id of this.animFrameIds) {
      cancelAnimationFrame(id);
    }
    this.animFrameIds = [];

    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
