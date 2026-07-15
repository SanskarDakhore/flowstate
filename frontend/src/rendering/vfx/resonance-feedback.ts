import { InteractionEvent } from '../../game/prototype/prototype-interaction-system';
import { GameplayScene } from '../scene/gameplay-scene';
import { PlayerHud } from '../../ui/hud/player-hud';

export const RESONANCE_CALIBRATION = {
  BASELINE_VITALITY: 0.2,
  MAX_VITALITY_ADD: 0.8,
  JOURNEY_WEIGHT: 0.3,
  PERFORMANCE_WEIGHT: 0.7,
  VITALITY_LERP_SPEED: 4.0,
  TARGET_PULSE_DURATION: 0.35,
  PLAYER_FLARE_DURATION: 0.35,
};

export class ResonanceFeedbackController {
  private scene: GameplayScene;
  private hud: PlayerHud | null = null;

  // Frame-rate independent world vitality interpolation
  private targetVitality: number = RESONANCE_CALIBRATION.BASELINE_VITALITY;
  private currentVitality: number = RESONANCE_CALIBRATION.BASELINE_VITALITY;

  constructor(scene: GameplayScene) {
    this.scene = scene;
  }

  public setPlayerHud(hud: PlayerHud | null): void {
    this.hud = hud;
  }

  public onInteractionEvents(events: InteractionEvent[]): void {
    for (const event of events) {
      if (event.type === 'PASS') {
        this.handleTargetPassed(event.targetId);
      } else if (event.type === 'MISS') {
        this.handleTargetMissed(event.targetId);
      }
    }
  }

  public handleTargetPassed(targetId: string): void {
    // 1. Scene Target Mesh Resonance Pulse
    this.scene.triggerTargetPassResonance(targetId);

    // 2. Player View Trail & Halo Flare
    this.scene.playerView.triggerTargetPassFlare();

    // 3. HUD Target Counter Resonance Micro-Pulse
    if (this.hud) {
      this.hud.triggerTargetPulse();
    }
  }

  public handleTargetMissed(targetId: string): void {
    // Soft desaturation/fade for missed targets without jarring red flashes
    this.scene.triggerTargetMissResonance(targetId);
  }

  /**
   * Hybrid Vitality Model (Option C):
   * World Vitality = Journey Progress (30%) + Performance Resonance (70%)
   */
  public setHarmonyLevel(courseProgress: number, performanceRatio: number, deltaTimeSeconds: number): void {
    const clampedProgress = Math.min(1.0, Math.max(0.0, courseProgress));
    const clampedPerformance = Math.min(1.0, Math.max(0.0, performanceRatio));

    const hybridHarmony =
      clampedProgress * RESONANCE_CALIBRATION.JOURNEY_WEIGHT +
      clampedPerformance * RESONANCE_CALIBRATION.PERFORMANCE_WEIGHT;

    // Baseline vitality floor 0.2 + up to 0.8 awakening based on hybrid performance
    this.targetVitality =
      RESONANCE_CALIBRATION.BASELINE_VITALITY + hybridHarmony * RESONANCE_CALIBRATION.MAX_VITALITY_ADD;

    // Frame-rate independent smooth lerp
    const lerpFactor = Math.min(1.0, RESONANCE_CALIBRATION.VITALITY_LERP_SPEED * deltaTimeSeconds);
    this.currentVitality += (this.targetVitality - this.currentVitality) * lerpFactor;

    // Apply smooth vitality to scene environment presentation
    this.scene.environmentView.setHarmonyLevel(this.currentVitality);
  }

  public reset(): void {
    this.targetVitality = RESONANCE_CALIBRATION.BASELINE_VITALITY;
    this.currentVitality = RESONANCE_CALIBRATION.BASELINE_VITALITY;
    this.scene.environmentView.setHarmonyLevel(RESONANCE_CALIBRATION.BASELINE_VITALITY);
  }
}
