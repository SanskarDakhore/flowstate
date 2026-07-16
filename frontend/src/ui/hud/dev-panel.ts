import { MovementModelId, Vector3State, PlayerState, getJumpStateName, getGravityPhaseName } from '../../game/movement/movement-types';
import { MovementIntent } from '../../game/movement/movement-intent';
import { MovementMetricsSummary } from '../../game/prototype/prototype-metrics';
import { DebugTelemetry } from '../../game/telemetry/debug-telemetry';

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
      background: 'var(--flow-bg-scrim)',
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

    // Collapsible Glass Drawer Panel with dark background scrim for text readability
    this.drawer = document.createElement('div');
    this.drawer.id = 'flow-dev-drawer';
    Object.assign(this.drawer.style, {
      position: 'absolute',
      top: '32px',
      right: '0',
      width: '300px',
      background: 'var(--flow-text-scrim)',
      backdropFilter: 'blur(16px)',
      webkitBackdropFilter: 'blur(16px)',
      border: 'var(--flow-stroke-spectral) solid var(--flow-text-ghost)',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 8px 32px var(--flow-bg-scrim)',
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
    const vertVel = playerState?.verticalVelocity ?? 0;

    const telemetryRecord = DebugTelemetry.getSnapshot('movement');
    const movState = playerState?.movementState ?? (telemetryRecord ? (telemetryRecord.current as any) : null);

    const ambientRecord = DebugTelemetry.getSnapshot('ambient');
    const ambientState = ambientRecord ? (ambientRecord.current as any) : null;

    const presentationRecord = DebugTelemetry.getSnapshot('presentation');
    const presentationState = presentationRecord ? (presentationRecord.current as any) : null;

    const livingWorldRecord = DebugTelemetry.getSnapshot('livingWorld');
    const livingWorldState = livingWorldRecord ? (livingWorldRecord.current as any) : null;

    const jumpStateName = movState ? getJumpStateName(movState.jumpState) : (playerState?.isGrounded ? 'Grounded' : 'Airborne');
    const gravityPhaseName = movState ? getGravityPhaseName(movState.activeGravityPhase) : 'Grounded';
    const coyoteT = movState ? movState.coyoteTimer.toFixed(3) : '0.000';
    const bufferT = movState ? movState.jumpBufferTimer.toFixed(3) : '0.000';
    const jumpId = movState ? movState.jumpId : 0;
    const landImpact = movState ? movState.landingImpact.toFixed(1) : '0.0';

    const targetSpd = movState?.targetSpeed ?? 20.0;
    const desVelX = movState?.desiredVelocity?.x ?? 0;
    const desVelZ = movState?.desiredVelocity?.z ?? 0;
    const velErr = movState?.velocityError ?? 0;
    const momScore = movState?.momentumScore ?? 100;
    const momQuality = movState?.momentumQuality ?? 'EXCELLENT';
    const flowEff = movState ? (movState.flowEfficiency * 100).toFixed(0) : '100';
    const dirDelta = movState ? movState.directionDelta.toFixed(1) : '0.0';
    const appliedGrav = movState ? movState.appliedGravity.toFixed(1) : '0.0';

    const envProfId = ambientState?.activeProfileId ?? (movState?.activeEnvironmentProfileId ?? 'LIVING_VALLEY');
    const movProfId = movState?.activeMovementProfileId ?? 'default-responsive';

    const fpsColor = this.fpsCounter >= 55 ? 'var(--flow-status-success)' : 'var(--flow-status-warning)';

    const liveDebris = ambientState?.liveSurfaceResponsePoolUsage ?? 0;
    const freePool = ambientState?.inactivePoolCapacity ?? 64;
    const peakDebris = ambientState?.largestPoolUsage ?? 0;
    const activeRipples = ambientState?.activeRipples ?? 0;
    const influenceRadius = ambientState?.currentActiveResponseRadius ?? 2.8;
    const frameTimeDelta = ambientState?.frameTimeMs ? ambientState.frameTimeMs.toFixed(2) : '0.00';
    const peakFrameTime = ambientState?.peakFrameTimeMs ? ambientState.peakFrameTimeMs.toFixed(2) : '0.00';

    const pipePhase = presentationState?.phase ?? 'PLAYING';
    const pipeMood = presentationState?.mood ?? 'LUSH';
    const pipeCost = presentationState?.totalPresentationCostMs ? presentationState.totalPresentationCostMs.toFixed(2) : '0.00';
    const transitionPct = presentationState?.transitionProgress ? (presentationState.transitionProgress * 100).toFixed(0) : '0';

    // Living World Metrics (v0.3.0)
    const lwFlowState = livingWorldState?.flowState ? livingWorldState.flowState.toFixed(1) : '0.0';
    const lwResonance = livingWorldState?.worldResonance ? livingWorldState.worldResonance.toFixed(1) : '0.0';
    const lwInfluence = livingWorldState?.biomeInfluence ? (livingWorldState.biomeInfluence * 100).toFixed(0) : '0';
    const lwPhaseNumeric = livingWorldState?.biomePhase ?? 0;
    const phaseNames = ['DORMANT', 'AWAKENING', 'LIVING', 'BLOOMING', 'RADIANT'];
    const lwPhaseName = phaseNames[lwPhaseNumeric] ?? 'DORMANT';
    const lwCost = livingWorldState?.computeCostMs ? livingWorldState.computeCostMs.toFixed(2) : '0.00';
    const lwEvents = livingWorldState?.eventSequence ?? 0;

    this.drawer.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--flow-stroke-spectral) solid var(--flow-text-ghost); padding-bottom: 6px;">
        <span style="font-weight: 700; color: var(--flow-cyan-kinetic); font-size: 10px; letter-spacing: 0.1em;">DEV TELEMETRY v0.3.0</span>
        <span style="font-weight: 700; color: ${fpsColor};">${this.fpsCounter} FPS</span>
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

      <!-- Live Vector Coordinates & Kinematics -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; font-size: 10px;">
        <div><strong style="color: var(--flow-text-muted);">Speed:</strong> ${speed.toFixed(1)} / ${targetSpd.toFixed(1)} u/s</div>
        <div><strong style="color: var(--flow-text-muted);">Efficiency:</strong> <span style="color: var(--flow-solar-champagne);">${flowEff}%</span></div>
        <div><strong style="color: var(--flow-text-muted);">Desired V:</strong> ${desVelX.toFixed(1)}, ${desVelZ.toFixed(1)}</div>
        <div><strong style="color: var(--flow-text-muted);">Vel Error:</strong> ${velErr.toFixed(2)}</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Pos:</strong> ${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Jump State:</strong> <span style="color: var(--flow-cyan-kinetic); font-weight: 700;">${jumpStateName}</span> (#${jumpId})</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Gravity Phase:</strong> <span style="color: var(--flow-solar-champagne); font-weight: 700;">${gravityPhaseName}</span> (G:${appliedGrav})</div>
        <div style="grid-column: span 2;"><strong style="color: var(--flow-text-muted);">Jumps:</strong> ${jumpsUsed}/${maxJumps} | <strong>Vy:</strong> ${vertVel.toFixed(1)} | <strong>Impact:</strong> ${landImpact}</div>
      </div>

      <!-- Living World Simulation Telemetry Foundation (v0.3.0) -->
      <div style="font-size: 9px; background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; border: var(--flow-hairline) solid var(--flow-cyan-kinetic);">
        <div style="font-weight: 700; color: var(--flow-cyan-kinetic); margin-bottom: 2px;">LIVING WORLD SIMULATION (${lwPhaseName})</div>
        <div><strong>Flow State:</strong> <span style="color: var(--flow-solar-champagne); font-weight: 700;">${lwFlowState}%</span> | <strong>Resonance:</strong> ${lwResonance} pts</div>
        <div><strong>Biome Influence:</strong> ${lwInfluence}% | <strong>Event Stream:</strong> #${lwEvents}</div>
        <div><strong>Simulation Latency:</strong> ${lwCost}ms / tick (< 1.0ms target)</div>
      </div>

      <!-- Momentum Score & Quality Observer -->
      <div style="font-size: 9px; background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; border: var(--flow-hairline) solid var(--flow-text-ghost);">
        <div><strong>Momentum Score:</strong> <span style="color: var(--flow-cyan-kinetic); font-weight: 700;">${momScore.toFixed(1)}</span> / 100 [<span style="color: var(--flow-solar-champagne); font-weight: 700;">${momQuality}</span>]</div>
        <div><strong>Direction Delta:</strong> ${dirDelta}° | <strong>Profiles:</strong> ${envProfId} / ${movProfId}</div>
      </div>

      <!-- Presentation Pipeline Telemetry Foundation (v0.2.5) -->
      <div style="font-size: 9px; background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; border: var(--flow-hairline) solid var(--flow-solar-champagne);">
        <div style="font-weight: 700; color: var(--flow-solar-champagne); margin-bottom: 2px;">PRESENTATION PIPELINE (${pipePhase})</div>
        <div><strong>Mood:</strong> ${pipeMood} | <strong>Transition:</strong> ${transitionPct}%</div>
        <div><strong>Execution Latency:</strong> ${pipeCost}ms / frame (< 1.0ms target)</div>
      </div>

      <!-- Ambient Ecosystem Telemetry Foundation (v0.2.4B) -->
      <div style="font-size: 9px; background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; border: var(--flow-hairline) solid var(--flow-cyan-kinetic);">
        <div style="font-weight: 700; color: var(--flow-cyan-kinetic); margin-bottom: 2px;">AMBIENT ECOSYSTEM (${envProfId})</div>
        <div><strong>Radius:</strong> ${influenceRadius.toFixed(1)}u | <strong>Ripples:</strong> ${activeRipples} active</div>
        <div><strong>Debris Pool:</strong> ${liveDebris} live / ${freePool} free (Peak: ${peakDebris})</div>
        <div><strong>CPU Cycle:</strong> ${frameTimeDelta}ms (Peak: ${peakFrameTime}ms)</div>
      </div>

      <!-- Timers & Window Status -->
      <div style="font-size: 9px; color: var(--flow-text-muted); background: var(--flow-bg-scrim); padding: 4px 6px; border-radius: 3px;">
        <div><strong>Coyote Window:</strong> ${coyoteT}s | <strong>Jump Buffer:</strong> ${bufferT}s</div>
      </div>

      <!-- Input Intent -->
      <div style="font-size: 9px; color: var(--flow-text-muted);">
        <strong>Input Intent:</strong> Mag:${intent.movementMagnitude.toFixed(2)} | Dir:(${intent.desiredDirection?.x.toFixed(2)},${intent.desiredDirection?.z.toFixed(2)}) | Jump:${intent.jumpPressed ? '1' : '0'}
      </div>

      <!-- Metrics Summary -->
      <div style="border-top: var(--flow-stroke-spectral) solid var(--flow-text-ghost); padding-top: 4px; display: flex; flex-direction: column; gap: 2px; font-size: 9px;">
        <div style="font-weight: 600; color: var(--flow-solar-champagne);">VALIDATION</div>
        <div>Passed: <strong style="color: var(--flow-status-success);">${metrics.targetsPassed}</strong> | Missed: <strong style="color: var(--flow-status-danger);">${metrics.targetsMissed}</strong></div>
      </div>

      <!-- Shortcut Hint -->
      <div style="font-size: 8px; color: var(--flow-text-muted); border-top: var(--flow-stroke-spectral) solid var(--flow-text-ghost); padding-top: 4px;">
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
    const bg = active ? 'var(--flow-bg-scrim)' : 'transparent';
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
