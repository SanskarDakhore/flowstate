import { MovementModelId, Vector3State, PlayerState } from '../../game/movement/movement-types';
import { MovementIntent } from '../../game/movement/movement-intent';
import { MovementMetricsSummary } from '../../game/prototype/prototype-metrics';

export interface DevPanelData {
  modelId: MovementModelId;
  position: Vector3State;
  speed: number;
  intent: MovementIntent;
  sessionProgress: number;
  remainingTime: number;
  metrics: MovementMetricsSummary;
  playerState?: PlayerState;
}

export type ModelSwitchCallback = (model: MovementModelId) => void;

export class DevPanel {
  private container: HTMLDivElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;
  private drawer: HTMLDivElement | null = null;

  private isExpanded: boolean = false;
  private fpsCounter: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdate: number = performance.now();

  private onModelSwitch?: ModelSwitchCallback;

  constructor(onModelSwitch?: ModelSwitchCallback) {
    this.onModelSwitch = onModelSwitch;
    this.createDomElements();
    this.setupListeners();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('flow-dev-panel-root');
    if (existing) existing.remove();

    this.container = document.createElement('div');
    this.container.id = 'flow-dev-panel-root';
    Object.assign(this.container.style, {
      position: 'fixed',
      top: 'var(--flow-safe-top)',
      right: 'var(--flow-safe-right)',
      zIndex: '1000',
      fontFamily: 'var(--flow-font-mono)',
      fontSize: '11px',
      color: 'var(--flow-text-primary)',
      boxSizing: 'border-box',
    });

    // Top Right Micro Glyph Toggle (Quiet & Secondary)
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.id = 'flow-dev-toggle';
    this.toggleBtn.innerHTML = `
      <span style="
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--flow-cyan-kinetic);
        opacity: 0.8;
      "></span>
      <span>⚙ TEL</span>
    `;
    Object.assign(this.toggleBtn.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      background: 'rgba(5, 8, 16, 0.4)',
      backdropFilter: 'blur(8px)',
      webkitBackdropFilter: 'blur(8px)',
      border: 'var(--flow-hairline) solid var(--flow-text-ghost)',
      borderRadius: '4px',
      padding: '4px 8px',
      color: 'var(--flow-text-muted)',
      fontSize: '10px',
      fontFamily: 'var(--flow-font-mono)',
      letterSpacing: '0.1em',
      cursor: 'pointer',
      pointerEvents: 'auto',
      opacity: '0.35',
      transition: 'var(--flow-transition-fast)',
      outline: 'none',
      userSelect: 'none',
    });

    // Hover effect on toggle button
    this.toggleBtn.addEventListener('mouseenter', () => {
      if (this.toggleBtn) {
        this.toggleBtn.style.opacity = '1.0';
        this.toggleBtn.style.borderColor = 'var(--flow-cyan-kinetic)';
        this.toggleBtn.style.color = 'var(--flow-text-primary)';
      }
    });
    this.toggleBtn.addEventListener('mouseleave', () => {
      if (this.toggleBtn && !this.isExpanded) {
        this.toggleBtn.style.opacity = '0.35';
        this.toggleBtn.style.borderColor = 'var(--flow-text-ghost)';
        this.toggleBtn.style.color = 'var(--flow-text-muted)';
      }
    });

    // Collapsible Glass Drawer Panel
    this.drawer = document.createElement('div');
    this.drawer.id = 'flow-dev-drawer';
    Object.assign(this.drawer.style, {
      position: 'absolute',
      top: '32px',
      right: '0',
      width: '280px',
      background: 'rgba(5, 8, 16, 0.9)',
      backdropFilter: 'blur(16px)',
      webkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      display: 'none',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'auto',
      boxSizing: 'border-box',
    });

    this.container.appendChild(this.toggleBtn);
    this.container.appendChild(this.drawer);
    document.body.appendChild(this.container);
  }

  private setupListeners(): void {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.togglePanel();
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
          this.togglePanel();
        }
      });
    }
  }

  public togglePanel(): void {
    this.isExpanded = !this.isExpanded;
    if (this.drawer) {
      this.drawer.style.display = this.isExpanded ? 'flex' : 'none';
    }
    if (this.toggleBtn) {
      this.toggleBtn.style.opacity = this.isExpanded ? '1.0' : '0.35';
      this.toggleBtn.style.borderColor = this.isExpanded ? 'var(--flow-cyan-kinetic)' : 'var(--flow-text-ghost)';
      this.toggleBtn.style.color = this.isExpanded ? 'var(--flow-cyan-kinetic)' : 'var(--flow-text-muted)';
    }
  }

  public update(data: DevPanelData): void {
    if (!this.drawer || !this.isExpanded) return;

    // Live FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 500) {
      this.fpsCounter = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    const { modelId, position, speed, intent, remainingTime, metrics, playerState } = data;

    const jumpsUsed = playerState?.jumpsUsed ?? 0;
    const maxJumps = playerState?.maxJumps ?? 2;
    const airborneH = playerState?.airborneHeight ?? 0;
    const vertVel = playerState?.verticalVelocity ?? 0;

    this.drawer.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
        <span style="font-weight: 700; color: var(--flow-cyan-kinetic); font-size: 10px; letter-spacing: 0.1em;">DEV TELEMETRY</span>
        <span style="font-weight: 700; color: ${this.fpsCounter >= 55 ? '#34d399' : '#f59e0b'};">${this.fpsCounter} FPS</span>
      </div>

      <!-- Movement Model Tabs -->
      <div>
        <div style="font-size: 9px; color: var(--flow-text-muted); margin-bottom: 4px;">ACTIVE MODEL</div>
        <div style="display: flex; gap: 4px;">
          ${this.renderModelTab('guided-flow', 'Guided', modelId === 'guided-flow', '1')}
          ${this.renderModelTab('free-flow', 'Free', modelId === 'free-flow', '2')}
          ${this.renderModelTab('branching-flow', 'Branching', modelId === 'branching-flow', '3')}
        </div>
      </div>

      <!-- Live Coordinates -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px; font-size: 10px;">
        <div><strong style="color: var(--flow-text-muted);">Spd:</strong> ${speed.toFixed(1)} u/s</div>
        <div><strong style="color: var(--flow-text-muted);">Rem:</strong> ${remainingTime.toFixed(1)}s</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Pos:</strong> ${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Jumps:</strong> ${jumpsUsed}/${maxJumps} | <strong>Vy:</strong> ${vertVel.toFixed(1)}</div>
      </div>

      <!-- Input Intent -->
      <div style="font-size: 9px; color: var(--flow-text-muted);">
        <strong>Input:</strong> H:${intent.horizontal.toFixed(2)} | V:${intent.vertical.toFixed(2)} | Jump:${intent.jumpPressed ? '1' : '0'}
      </div>

      <!-- Metrics -->
      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px; display: flex; flex-direction: column; gap: 2px; font-size: 9px;">
        <div style="font-weight: 600; color: var(--flow-solar-champagne);">VALIDATION</div>
        <div>Passed: <strong style="color: #34d399;">${metrics.targetsPassed}</strong> | Missed: <strong style="color: #f87171;">${metrics.targetsMissed}</strong></div>
      </div>

      <!-- Shortcut Hint -->
      <div style="font-size: 8px; color: var(--flow-text-muted); border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px;">
        Keys: 1-3 Model | Space Jump | H Toggle
      </div>
    `;

    // Rebind tab handlers
    const tabs = this.drawer.querySelectorAll('.flow-model-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const targetModel = (e.currentTarget as HTMLElement).getAttribute('data-model') as MovementModelId;
        if (targetModel && this.onModelSwitch) {
          this.onModelSwitch(targetModel);
        }
      });
    });
  }

  private renderModelTab(id: MovementModelId, label: string, active: boolean, key: string): string {
    const bg = active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)';
    const border = active ? 'var(--flow-cyan-kinetic)' : 'transparent';
    const color = active ? 'var(--flow-cyan-kinetic)' : 'var(--flow-text-muted)';

    return `
      <div class="flow-model-tab" data-model="${id}" style="
        flex: 1;
        padding: 3px 4px;
        background: ${bg};
        border: 1px solid ${border};
        border-radius: 3px;
        color: ${color};
        text-align: center;
        cursor: pointer;
        font-weight: ${active ? '700' : '400'};
        font-size: 9px;
      ">
        [${key}] ${label}
      </div>
    `;
  }

  public dispose(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
