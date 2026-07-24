import { PlayerState } from '../../game/movement/movement-types';
import { MovementMetricsSummary } from '../../game/prototype/prototype-metrics';

export interface PlayerHudData {
  sessionProgress: number; // 0.0 to 1.0
  remainingTime: number;
  metrics: MovementMetricsSummary;
  playerState?: PlayerState;
}

export class PlayerHud {
  private container: HTMLDivElement | null = null;
  private scrimTop: HTMLDivElement | null = null;
  private scrimBottom: HTMLDivElement | null = null;

  // Cached DOM elements for zero-garbage frame updates
  private progressFillEl: HTMLDivElement | null = null;
  private targetCountEl: HTMLSpanElement | null = null;
  private timerEl: HTMLSpanElement | null = null;
  private inputHintEl: HTMLDivElement | null = null;
  private hintTextEl: HTMLSpanElement | null = null;
  private chargeNodeLeft: HTMLSpanElement | null = null;
  private chargeNodeRight: HTMLSpanElement | null = null;

  private lastTargetsPassed: number = -1;

  constructor() {
    this.createDomElements();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    // Clean up existing HUD elements
    const existingHud = document.getElementById('flow-hud-root');
    if (existingHud) existingHud.remove();
    const existingScrimTop = document.getElementById('flow-scrim-top');
    if (existingScrimTop) existingScrimTop.remove();
    const existingScrimBottom = document.getElementById('flow-scrim-bottom');
    if (existingScrimBottom) existingScrimBottom.remove();

    this.scrimTop = document.createElement('div');
    this.scrimTop.id = 'flow-scrim-top';
    this.scrimTop.className = 'flow-scrim flow-scrim--top';
    document.body.appendChild(this.scrimTop);

    this.scrimBottom = document.createElement('div');
    this.scrimBottom.id = 'flow-scrim-bottom';
    this.scrimBottom.className = 'flow-scrim flow-scrim--bottom';
    document.body.appendChild(this.scrimBottom);

    this.container = document.createElement('div');
    this.container.id = 'flow-hud-root';
    this.container.className = 'flow-hud-root';

    this.container.innerHTML = `
      <div class="flow-hud-brand" aria-label="Flowstate movement lab">
        <div class="flow-hud-brand__thread" aria-hidden="true"></div>
        <div>
          <div class="flow-hud-brand__name">FLOWSTATE</div>
          <div class="flow-hud-brand__meta">MOVEMENT LAB &middot; 01</div>
        </div>
      </div>

      <div class="flow-objective">
        <div class="flow-objective__line">
          <span>Calibration</span>
          <span id="flow-target-count" class="flow-objective__count">0 / 30</span>
          <span id="flow-timer">60s</span>
        </div>
        <div class="flow-objective__track" aria-hidden="true">
          <div id="flow-progress-fill" class="flow-objective__fill"></div>
        </div>
      </div>

      <div id="flow-input-hint" class="flow-input-hint">
        <span id="flow-node-left" class="flow-input-hint__node" aria-hidden="true"></span>
        <span id="flow-hint-text" class="flow-input-hint__text">Tap / Space to Jump</span>
        <span id="flow-node-right" class="flow-input-hint__node" aria-hidden="true"></span>
      </div>
    `;

    document.body.appendChild(this.container);

    // Cache DOM references
    this.progressFillEl = this.container.querySelector('#flow-progress-fill');
    this.targetCountEl = this.container.querySelector('#flow-target-count');
    this.timerEl = this.container.querySelector('#flow-timer');
    this.inputHintEl = this.container.querySelector('#flow-input-hint');
    this.hintTextEl = this.container.querySelector('#flow-hint-text');
    this.chargeNodeLeft = this.container.querySelector('#flow-node-left');
    this.chargeNodeRight = this.container.querySelector('#flow-node-right');
  }

  public update(data: PlayerHudData): void {
    if (!this.container) return;

    const { sessionProgress, remainingTime, metrics, playerState } = data;
    const progressPct = Math.min(100, Math.max(0, Math.round(sessionProgress * 100)));

    // 1. Update Objective Fill Line & Glow Transition
    if (this.progressFillEl) {
      this.progressFillEl.style.width = `${progressPct}%`;
      if (sessionProgress >= 0.8) {
        this.progressFillEl.style.boxShadow = 'var(--flow-glow-solar)';
      } else {
        this.progressFillEl.style.boxShadow = 'var(--flow-glow-cyan)';
      }
    }

    // 2. Update Target Counter
    if (this.targetCountEl) {
      const targetsPassed = metrics.targetsPassed;
      const totalTargets = 30;
      this.targetCountEl.textContent = `${targetsPassed} / ${totalTargets}`;

      if (this.lastTargetsPassed !== -1 && targetsPassed > this.lastTargetsPassed) {
        this.triggerTargetPulse();
      }
      this.lastTargetsPassed = targetsPassed;
    }

    // 3. Update Monospaced Timer
    if (this.timerEl) {
      const formattedTime = `${Math.ceil(remainingTime)}s`;
      this.timerEl.textContent = formattedTime;
    }

    // 4. Contextual Jump Guidance & Orbital Charge Nodes
    if (this.inputHintEl && this.hintTextEl) {
      const jumpsUsed = playerState?.jumpsUsed ?? 0;
      const maxJumps = playerState?.maxJumps ?? 2;
      const airborne = playerState ? !playerState.isGrounded : false;

      if (jumpsUsed === 0 && !airborne) {
        this.hintTextEl.textContent = 'Tap / Space to Jump';
        this.setNodeState(this.chargeNodeLeft, true, false);
        this.setNodeState(this.chargeNodeRight, true, false);
        this.inputHintEl.style.opacity = '0.9';
      } else if (jumpsUsed === 1 && jumpsUsed < maxJumps) {
        this.hintTextEl.textContent = 'Tap Again to Double Jump';
        this.setNodeState(this.chargeNodeLeft, false, true); // First jump spent
        this.setNodeState(this.chargeNodeRight, true, false); // Second charge ready
        this.inputHintEl.style.opacity = '1.0';
      } else if (jumpsUsed >= maxJumps) {
        // High flow airborne state — HUD recedes
        this.setNodeState(this.chargeNodeLeft, false, true);
        this.setNodeState(this.chargeNodeRight, false, true);
        this.inputHintEl.style.opacity = '0.25';
      } else {
        this.inputHintEl.style.opacity = '0.7';
      }
    }
  }

  private setNodeState(node: HTMLSpanElement | null, active: boolean, spent: boolean): void {
    if (!node) return;
    if (active) {
      node.style.background = 'var(--flow-cyan-kinetic)';
      node.style.boxShadow = 'var(--flow-glow-cyan)';
      node.style.opacity = '1.0';
      node.style.transform = 'scale(1)';
    } else if (spent) {
      node.style.background = 'var(--flow-text-ghost)';
      node.style.boxShadow = 'none';
      node.style.opacity = '0.4';
      node.style.transform = 'scale(0.75)';
    }
  }

  public triggerTargetPulse(): void {
    if (!this.targetCountEl) return;
    this.targetCountEl.style.color = 'var(--flow-solar-champagne)';
    this.targetCountEl.style.transform = 'scale(1.1)';
    this.targetCountEl.style.transition = 'transform 0.15s var(--flow-ease-out), color 0.15s ease';

    setTimeout(() => {
      if (this.targetCountEl) {
        this.targetCountEl.style.color = 'var(--flow-cyan-kinetic)';
        this.targetCountEl.style.transform = 'scale(1)';
      }
    }, 200);
  }

  public dispose(): void {
    if (this.scrimTop) this.scrimTop.remove();
    if (this.scrimBottom) this.scrimBottom.remove();
    if (this.container) this.container.remove();
    this.scrimTop = null;
    this.scrimBottom = null;
    this.container = null;
  }
}
