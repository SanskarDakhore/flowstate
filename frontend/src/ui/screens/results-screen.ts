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

    // Clean up existing Results Screen instance
    const existing = document.getElementById('flow-results-screen-root');
    if (existing) existing.remove();

    this.injectKeyframeStyles();

    this.container = document.createElement('div');
    this.container.id = 'flow-results-screen-root';

    const s = this.container.style;
    s.position = 'fixed';
    s.top = '0';
    s.left = '0';
    s.width = '100%';
    s.height = '100%';
    s.zIndex = '960';
    s.pointerEvents = 'auto';
    s.display = 'flex';
    s.flexDirection = 'column';
    s.alignItems = 'center';
    s.justifyContent = 'space-between';
    s.paddingTop = 'calc(var(--flow-safe-top) + 6vh)';
    s.paddingBottom = 'calc(var(--flow-safe-bottom) + 6vh)';
    s.paddingLeft = 'var(--flow-safe-left)';
    s.paddingRight = 'var(--flow-safe-right)';
    s.background = 'var(--flow-bg-scrim)';
    s.boxSizing = 'border-box';
    s.userSelect = 'none';
    s.opacity = '1';
    s.transition = 'opacity var(--flow-transition-normal)';

    this.container.innerHTML = `
      <!-- Staggered Entry 1: Top Header Label -->
      <div class="flow-reveal" style="animation-delay: 0.1s; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center;">
        <div style="
          font-family: var(--flow-font-mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: var(--flow-cyan-kinetic);
          text-shadow: var(--flow-glow-cyan);
          text-transform: uppercase;
        ">PHASE RESONANCE COMPLETE</div>
        
        <div style="
          font-family: var(--flow-font-display);
          font-size: clamp(28px, 6vw, 42px);
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--flow-text-primary);
          text-shadow: 0 0 24px rgba(253, 230, 138, 0.4);
          text-transform: uppercase;
        ">PERFORMANCE SUMMARY</div>
      </div>

      <!-- Staggered Entry 2: Numerical Breakdown Stats Cluster -->
      <div class="flow-reveal" style="
        animation-delay: 0.25s;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: min(340px, 90vw);
        user-select: none;
      ">
        <!-- Main Score Counter -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="font-family: var(--flow-font-body); font-size: 10px; letter-spacing: 0.2em; color: var(--flow-text-muted); text-transform: uppercase;">RESONANCE SCORE</div>
          <div id="flow-stat-score" style="font-family: var(--flow-font-mono); font-size: clamp(36px, 8vw, 54px); font-weight: 700; color: var(--flow-solar-champagne); text-shadow: var(--flow-glow-solar);">0</div>
        </div>

        <div style="width: 100%; height: var(--flow-hairline); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);"></div>

        <!-- Secondary Stat Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
          <!-- Targets Stat -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="font-family: var(--flow-font-body); font-size: 9px; letter-spacing: 0.15em; color: var(--flow-text-muted); text-transform: uppercase;">TARGETS CLEARED</div>
            <div style="font-family: var(--flow-font-mono); font-size: 20px; font-weight: 700; color: var(--flow-cyan-kinetic);">
              <span id="flow-stat-targets">0</span> / ${this.data.totalTargets}
            </div>
          </div>

          <!-- Harmony Level Stat -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="font-family: var(--flow-font-body); font-size: 9px; letter-spacing: 0.15em; color: var(--flow-text-muted); text-transform: uppercase;">HARMONY PEAK</div>
            <div style="font-family: var(--flow-font-mono); font-size: 20px; font-weight: 700; color: var(--flow-cyan-velocity);">
              <span id="flow-stat-harmony">0</span>%
            </div>
          </div>
        </div>
      </div>

      <!-- Staggered Entry 3: Primary Action Options -->
      <div class="flow-reveal" style="
        animation-delay: 0.4s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        width: 100%;
      ">
        <button id="flow-btn-retry" style="
          min-height: var(--flow-min-touch-target);
          padding: 10px 24px;
          background: transparent;
          border: var(--flow-hairline) solid var(--flow-cyan-kinetic);
          border-radius: 4px;
          box-shadow: var(--flow-glow-cyan);
          font-family: var(--flow-font-display);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--flow-text-primary);
          cursor: pointer;
          pointer-events: auto;
          transition: var(--flow-transition-fast);
          outline: none;
          text-transform: uppercase;
        ">[ RE-RESONATE ]</button>

        <button id="flow-btn-return" style="
          min-height: var(--flow-min-touch-target);
          padding: 8px 18px;
          background: transparent;
          border: none;
          font-family: var(--flow-font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--flow-text-muted);
          cursor: pointer;
          pointer-events: auto;
          transition: var(--flow-transition-fast);
          outline: none;
          text-transform: uppercase;
        ">[ RETURN TO VOID ]</button>
      </div>
    `;

    document.body.appendChild(this.container);

    // Wire Button Events
    const btnRetry = this.container.querySelector('#flow-btn-retry') as HTMLButtonElement;
    const btnReturn = this.container.querySelector('#flow-btn-return') as HTMLButtonElement;

    if (btnRetry) {
      btnRetry.addEventListener('mouseenter', () => {
        btnRetry.style.background = 'rgba(56, 189, 248, 0.15)';
        btnRetry.style.borderColor = 'var(--flow-solar-champagne)';
      });
      btnRetry.addEventListener('mouseleave', () => {
        btnRetry.style.background = 'transparent';
        btnRetry.style.borderColor = 'var(--flow-cyan-kinetic)';
      });
      btnRetry.addEventListener('click', () => this.handleAction(this.onRetryCallback));
    }

    if (btnReturn) {
      btnReturn.addEventListener('mouseenter', () => {
        btnReturn.style.color = 'var(--flow-text-primary)';
      });
      btnReturn.addEventListener('mouseleave', () => {
        btnReturn.style.color = 'var(--flow-text-muted)';
      });
      btnReturn.addEventListener('click', () => this.handleAction(this.onReturnCallback));
    }

    // Trigger Ticking Odometer Animations over 600ms
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

  private injectKeyframeStyles(): void {
    if (document.getElementById('flow-results-keyframes')) return;

    const style = document.createElement('style');
    style.id = 'flow-results-keyframes';
    style.textContent = `
      @keyframes flow-reveal-up {
        0% {
          opacity: 0;
          transform: translateY(12px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .flow-reveal {
        animation: flow-reveal-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
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
