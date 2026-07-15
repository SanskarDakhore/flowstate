import { Vector3State, PlayerState } from '../../game/movement/movement-types';
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

    // 1. Top Scrim Vignette Overlay (Non-intrusive gradient backdrop)
    this.scrimTop = document.createElement('div');
    this.scrimTop.id = 'flow-scrim-top';
    Object.assign(this.scrimTop.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '140px',
      background: 'linear-gradient(180deg, rgba(5, 8, 16, 0.75) 0%, rgba(5, 8, 16, 0.3) 60%, rgba(5, 8, 16, 0) 100%)',
      pointerEvents: 'none',
      zIndex: '900',
    });
    document.body.appendChild(this.scrimTop);

    // 2. Bottom Scrim Overlay
    this.scrimBottom = document.createElement('div');
    this.scrimBottom.id = 'flow-scrim-bottom';
    Object.assign(this.scrimBottom.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '120px',
      background: 'linear-gradient(0deg, rgba(5, 8, 16, 0.75) 0%, rgba(5, 8, 16, 0.3) 60%, rgba(5, 8, 16, 0) 100%)',
      pointerEvents: 'none',
      zIndex: '900',
    });
    document.body.appendChild(this.scrimBottom);

    // 3. HUD Root Container (Zero-surface floating spatial canvas)
    this.container = document.createElement('div');
    this.container.id = 'flow-hud-root';
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '950',
      fontFamily: 'var(--flow-font-body)',
      boxSizing: 'border-box',
    });

    this.container.innerHTML = `
      <!-- Top-Left: Identity Anchor (No Card, Vertical Cyan Light Thread) -->
      <div style="
        position: absolute;
        top: var(--flow-safe-top);
        left: var(--flow-safe-left);
        display: flex;
        align-items: center;
        gap: 10px;
        user-select: none;
      ">
        <div style="
          width: var(--flow-stroke-spectral);
          height: 24px;
          background: linear-gradient(180deg, var(--flow-cyan-kinetic), var(--flow-cyan-velocity));
          box-shadow: var(--flow-glow-cyan);
          border-radius: 1px;
        "></div>
        <div style="display: flex; flex-direction: column; gap: 1px;">
          <div style="
            font-family: var(--flow-font-display);
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.25em;
            color: var(--flow-text-primary);
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
            text-transform: uppercase;
          ">FLOWSTATE</div>
          <div style="
            font-family: var(--flow-font-mono);
            font-size: 9px;
            font-weight: 500;
            letter-spacing: 0.15em;
            color: var(--flow-cyan-kinetic);
            opacity: 0.85;
          ">MOVEMENT LAB &middot; 01</div>
        </div>
      </div>

      <!-- Top-Center: Flow Objective Anchor (Parabolic Vector Arc Progress) -->
      <div style="
        position: absolute;
        top: var(--flow-safe-top);
        left: 50%;
        transform: translateX(-50%);
        width: min(320px, calc(100vw - 120px));
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        user-select: none;
      ">
        <!-- Telemetry Data Line: Title | Counter | Clock -->
        <div style="
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
          letter-spacing: 0.15em;
        ">
          <span style="
            font-family: var(--flow-font-body);
            font-weight: 600;
            color: var(--flow-text-muted);
            text-transform: uppercase;
          ">CALIBRATION</span>

          <span id="flow-target-count" style="
            font-family: var(--flow-font-mono);
            font-weight: 700;
            color: var(--flow-cyan-kinetic);
            text-shadow: var(--flow-glow-cyan);
          ">0 / 30</span>

          <span id="flow-timer" style="
            font-family: var(--flow-font-mono);
            font-weight: 500;
            color: var(--flow-text-muted);
          ">60s</span>
        </div>

        <!-- Parabolic Spectral Thread (Kinetic Progress Line) -->
        <div style="
          width: 100%;
          height: 2px;
          background: var(--flow-text-ghost);
          border-radius: 1px;
          overflow: hidden;
          position: relative;
        ">
          <div id="flow-progress-fill" style="
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--flow-cyan-velocity), var(--flow-cyan-kinetic), var(--flow-solar-champagne));
            box-shadow: var(--flow-glow-cyan);
            transition: var(--flow-transition-normal);
          "></div>
        </div>
      </div>

      <!-- Bottom-Center: Contextual Interaction Echo (Luminous Orbital Charge Nodes) -->
      <div id="flow-input-hint" style="
        position: absolute;
        bottom: calc(var(--flow-safe-bottom) + 12px);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 12px;
        user-select: none;
        transition: var(--flow-transition-normal);
        opacity: 0.9;
      ">
        <!-- Orbital Node Left -->
        <span id="flow-node-left" style="
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--flow-cyan-kinetic);
          box-shadow: var(--flow-glow-cyan);
          transition: var(--flow-transition-fast);
        "></span>

        <!-- Floating Text -->
        <span id="flow-hint-text" style="
          font-family: var(--flow-font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--flow-text-primary);
          text-shadow: 0 0 8px rgba(248, 250, 252, 0.3);
          text-transform: uppercase;
        ">TAP / SPACE TO JUMP</span>

        <!-- Orbital Node Right -->
        <span id="flow-node-right" style="
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--flow-cyan-kinetic);
          box-shadow: var(--flow-glow-cyan);
          transition: var(--flow-transition-fast);
        "></span>
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
        this.hintTextEl.textContent = 'TAP / SPACE TO JUMP';
        this.setNodeState(this.chargeNodeLeft, true, false);
        this.setNodeState(this.chargeNodeRight, true, false);
        this.inputHintEl.style.opacity = '0.9';
      } else if (jumpsUsed === 1 && jumpsUsed < maxJumps) {
        this.hintTextEl.textContent = 'TAP AGAIN TO DOUBLE JUMP';
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
