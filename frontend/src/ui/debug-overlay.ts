import { MovementModelId, Vector3State, PlayerState } from '../game/movement/movement-types';
import { MovementIntent } from '../game/movement/movement-intent';
import { MovementMetricsSummary } from '../game/prototype/prototype-metrics';
import { PlayerHud } from './hud/player-hud';
import { DevPanel } from './hud/dev-panel';

export type HudDisplayMode = 'PLAYER' | 'DEBUG';

export class DebugOverlay {
  private playerHud: PlayerHud;
  private devPanel: DevPanel;

  constructor(onModelSwitch?: (model: MovementModelId) => void) {
    this.playerHud = new PlayerHud();
    this.devPanel = new DevPanel(onModelSwitch);
  }

  public toggleMode(): void {
    this.devPanel.togglePanel();
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
    // 1. Synchronize player-facing HUD (minimal floating objective, timer, hints)
    this.playerHud.update({
      sessionProgress: data.sessionProgress,
      remainingTime: data.remainingTime,
      metrics: data.metrics,
      playerState: data.playerState,
    });

    // 2. Synchronize developer validation telemetry panel
    this.devPanel.update({
      modelId: data.modelId,
      position: data.position,
      speed: data.speed,
      intent: data.intent,
      sessionProgress: data.sessionProgress,
      remainingTime: data.remainingTime,
      metrics: data.metrics,
      playerState: data.playerState,
    });
  }

  public dispose(): void {
    this.playerHud.dispose();
    this.devPanel.dispose();
  }
}
