import { MovementModelId, Vector3State, PlayerState } from '../game/movement/movement-types';
import { MovementIntent } from '../game/movement/movement-intent';
import { MovementMetricsSummary } from '../game/prototype/prototype-metrics';

export type HudDisplayMode = 'PLAYER' | 'DEBUG';

export class DebugOverlay {
  private element: HTMLDivElement | null = null;
  private mode: HudDisplayMode = 'DEBUG';
  private fpsCounter: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdate: number = performance.now();

  constructor() {
    this.createDomElement();
    this.setupToggleListener();
  }

  private createDomElement(): void {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('debugOverlay');
    if (existing) {
      existing.remove();
    }

    this.element = document.createElement('div');
    this.element.id = 'debugOverlay';
    this.element.style.position = 'absolute';
    this.element.style.top = '12px';
    this.element.style.left = '12px';
    this.element.style.padding = '12px 16px';
    this.element.style.background = 'rgba(10, 15, 30, 0.82)';
    this.element.style.backdropFilter = 'blur(10px)';
    this.element.style.color = '#f8fafc';
    this.element.style.fontFamily = 'monospace';
    this.element.style.fontSize = '12px';
    this.element.style.borderRadius = '10px';
    this.element.style.border = '1px solid rgba(56, 189, 248, 0.25)';
    this.element.style.pointerEvents = 'none';
    this.element.style.zIndex = '1000';
    this.element.style.lineHeight = '1.5';
    this.element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';

    document.body.appendChild(this.element);
  }

  private setupToggleListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') {
        this.mode = this.mode === 'DEBUG' ? 'PLAYER' : 'DEBUG';
      }
    });
  }

  public toggleMode(): void {
    this.mode = this.mode === 'DEBUG' ? 'PLAYER' : 'DEBUG';
  }

  public update(data: {
    modelId: MovementModelId;
    position: Vector3State;
    speed: number;
    intent: MovementIntent;
    sessionProgress: number;
    remainingTime: number;
    metrics: MovementMetricsSummary;
    playerState?: PlayerState;
  }): void {
    if (!this.element) return;

    // Calculate live FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 500) {
      this.fpsCounter = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    const { modelId, position, speed, intent, sessionProgress, remainingTime, metrics, playerState } = data;
    const progressPct = Math.round(sessionProgress * 100);

    const jumpsUsed = playerState?.jumpsUsed ?? 0;
    const maxJumps = playerState?.maxJumps ?? 2;
    const airborneH = playerState?.airborneHeight ?? 0;
    const vertVel = playerState?.verticalVelocity ?? 0;

    if (this.mode === 'PLAYER') {
      // Sleek Minimalist Player HUD Mode
      this.element.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; color: #38bdf8; letter-spacing: 0.5px; margin-bottom: 6px;">
          FLOWSTATE
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px;">
          <span>Harmony Progress</span>
          <span style="color: #34d399; font-weight: bold;">${progressPct}%</span>
        </div>
        <div style="width: 180px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
          <div style="width: ${progressPct}%; height: 100%; background: linear-gradient(90deg, #38bdf8, #34d399); transition: width 0.2s ease;"></div>
        </div>
        <div style="font-size: 11px; color: #cbd5e1;">
          Rings: <strong style="color: #38bdf8;">${metrics.targetsPassed}</strong> | 
          Time: <strong>${remainingTime.toFixed(0)}s</strong>
        </div>
        <div style="font-size: 10px; color: #64748b; margin-top: 6px;">
          Press <b>H</b> for Debug HUD
        </div>
      `;
    } else {
      // Comprehensive Technical Debug HUD Mode
      this.element.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; color: #38bdf8; margin-bottom: 4px;">
          FLOWSTATE — Core Movement Lab v0.1.2
        </div>
        <div><strong>FPS:</strong> ${this.fpsCounter}</div>
        <div><strong>Active Model:</strong> <span style="color: #facc15;">${modelId}</span></div>
        <div><strong>Speed:</strong> ${speed.toFixed(1)} u/s</div>
        <div><strong>Position:</strong> X:${position.x.toFixed(1)} Y:${position.y.toFixed(1)} Z:${position.z.toFixed(1)}</div>
        <div><strong>Input Intent:</strong> H:${intent.horizontal.toFixed(2)} | V:${intent.vertical.toFixed(2)} | Edge:${intent.jumpPressed ? '1' : '0'}</div>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.12); margin: 6px 0;">
        <div><strong>Jumps:</strong> <span style="color: #38bdf8; font-weight: bold;">${jumpsUsed}/${maxJumps}</span> | <strong>Height:</strong> ${airborneH.toFixed(2)}u (V<sub>y</sub>:${vertVel.toFixed(1)})</div>
        <div><strong>Session Rem:</strong> ${remainingTime.toFixed(1)}s (${progressPct}%)</div>
        <div><strong>Passed:</strong> ${metrics.targetsPassed} | <strong>Missed:</strong> ${metrics.targetsMissed}</div>
        <div><strong>Boundary Contacts:</strong> ${metrics.boundaryContacts}</div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">
          Press <b>Space</b>: Jump | <b>1</b>: Guided | <b>2</b>: Free | <b>3</b>: Branching | <b>R</b>: Reset | <b>F2</b>: Align Debug | <b>H</b>: Toggle Mode
        </div>
      `;
    }
  }

  public dispose(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
