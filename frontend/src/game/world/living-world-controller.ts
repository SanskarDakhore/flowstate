import {
  LivingWorldConfig,
  DEFAULT_LIVING_WORLD_CONFIG,
  BiomePhase,
  LivingWorldEventType,
  LivingWorldEventPriority,
} from './living-world-types';
import { LivingWorldState, createInitialLivingWorldState } from './living-world-state';
import { FlowStateController } from './flow-state-controller';
import { ResonanceController } from './resonance-controller';
import { LivingWorldEventStream } from './living-world-event-stream';
import { MovementState, Vector3State } from '../movement/movement-types';
import { DebugTelemetry } from '../telemetry/debug-telemetry';

export class LivingWorldController {
  private config: LivingWorldConfig;
  private flowController: FlowStateController;
  private resonanceController: ResonanceController;
  private eventStream: LivingWorldEventStream;

  private frameIndex: number = 0;
  private elapsedSimulationTime: number = 0.0;
  private lastSnapshot: LivingWorldState;

  private hasEmittedFirstRadiant: boolean = false;
  private lastReportedResonanceTier: number = 0;
  private highFlowStateActive: boolean = false;

  private lastExecutionCostMs: number = 0;

  constructor(config: LivingWorldConfig = DEFAULT_LIVING_WORLD_CONFIG) {
    this.config = config;
    this.flowController = new FlowStateController(this.config);
    this.resonanceController = new ResonanceController(this.config);
    this.eventStream = new LivingWorldEventStream();

    this.lastSnapshot = createInitialLivingWorldState(this.config.biomeId);
    this.registerTelemetry();
  }

  public getConfig(): LivingWorldConfig {
    return this.config;
  }

  public setConfig(config: LivingWorldConfig): void {
    this.config = config;
    this.flowController.setConfig(config);
    this.resonanceController.setConfig(config);
  }

  public getEventStream(): LivingWorldEventStream {
    return this.eventStream;
  }

  public getLatestSnapshot(): LivingWorldState {
    return this.lastSnapshot;
  }

  /**
   * Main simulation execution tick.
   * Consumes read-only movement telemetry, advances simulation deltas,
   * evaluates derived invariants, fires prioritized events, and returns frozen LivingWorldState snapshot.
   */
  public update(
    movementState: MovementState | null,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    deltaTimeSeconds: number = 0.016
  ): LivingWorldState {
    const startTime = performance.now();
    this.frameIndex++;

    const clampedDt = Math.max(0, Math.min(0.1, deltaTimeSeconds));
    this.elapsedSimulationTime += clampedDt;

    // Extract movement indicators
    const currentSpeed = movementState?.momentumMagnitude ?? 0.0;
    const flowComboScalar = movementState?.flowEfficiency ?? 0.0;
    const isAirborne = movementState ? !movementState.isGrounded : false;

    // 1. Primary Simulation Update
    const flowState = this.flowController.update(currentSpeed, flowComboScalar, isAirborne, clampedDt);
    const worldResonance = this.resonanceController.update(flowState, clampedDt);

    // 2. Derived Simulation Outputs (Invariants D & E)
    const biomeInfluence = Math.max(0.0, Math.min(1.0, worldResonance / 100.0));
    const biomeHealthPercentage = biomeInfluence; // Single source of truth (Invariant D)

    const previousPhase = this.lastSnapshot.biomePhase;
    const currentPhase = this.evaluateBiomePhase(worldResonance);

    const now = performance.now();

    // 3. Evaluate State Transition Events
    this.evaluateStateEvents(previousPhase, currentPhase, flowState, worldResonance, now);

    // 4. Compile Frozen Immutable Snapshot (Invariant G - Single Writer)
    const newSnapshot: LivingWorldState = {
      version: 1,
      frameIndex: this.frameIndex,
      timestamp: now,
      elapsedSimulationTime: this.elapsedSimulationTime,
      activeBiomeId: this.config.biomeId,

      flowState,
      worldResonance,

      biomeHealthPercentage,
      biomeInfluence,
      biomePhase: currentPhase,

      extensions: {
        reserved: null,
      },
    };

    this.lastSnapshot = Object.freeze(newSnapshot);
    this.lastExecutionCostMs = performance.now() - startTime;

    return this.lastSnapshot;
  }

  /**
   * Evaluates BiomePhase strictly from worldResonance and config phaseThresholds (Invariant E)
   */
  private evaluateBiomePhase(worldResonance: number): BiomePhase {
    const { phaseThresholds } = this.config;

    if (worldResonance >= phaseThresholds.radiant) {
      return BiomePhase.RADIANT;
    }
    if (worldResonance >= phaseThresholds.blooming) {
      return BiomePhase.BLOOMING;
    }
    if (worldResonance >= phaseThresholds.living) {
      return BiomePhase.LIVING;
    }
    if (worldResonance >= phaseThresholds.awakening) {
      return BiomePhase.AWAKENING;
    }
    return BiomePhase.DORMANT;
  }

  private evaluateStateEvents(
    previousPhase: BiomePhase,
    currentPhase: BiomePhase,
    flowState: number,
    worldResonance: number,
    timestamp: number
  ): void {
    // 1. Phase Transition Events
    if (currentPhase !== previousPhase) {
      this.eventStream.emit(
        LivingWorldEventType.BIOME_PHASE_CHANGED,
        LivingWorldEventPriority.HIGH,
        timestamp,
        { previousPhase, currentPhase }
      );

      if (currentPhase === BiomePhase.BLOOMING) {
        this.eventStream.emit(
          LivingWorldEventType.WORLD_BLOOM_STARTED,
          LivingWorldEventPriority.HIGH,
          timestamp,
          { worldResonance }
        );
      } else if (previousPhase === BiomePhase.BLOOMING) {
        this.eventStream.emit(
          LivingWorldEventType.WORLD_BLOOM_FINISHED,
          LivingWorldEventPriority.NORMAL,
          timestamp,
          { worldResonance }
        );
      }

      if (currentPhase === BiomePhase.RADIANT && !this.hasEmittedFirstRadiant) {
        this.hasEmittedFirstRadiant = true;
        this.eventStream.emit(
          LivingWorldEventType.FIRST_RADIANT_STATE,
          LivingWorldEventPriority.CRITICAL,
          timestamp,
          { worldResonance }
        );
      }
    }

    // 2. Continuous Flow State threshold events
    if (flowState >= 75.0 && !this.highFlowStateActive) {
      this.highFlowStateActive = true;
      this.eventStream.emit(
        LivingWorldEventType.FLOW_STATE_GAINED,
        LivingWorldEventPriority.LOW,
        timestamp,
        { flowState }
      );
    } else if (flowState <= 5.0 && this.highFlowStateActive) {
      this.highFlowStateActive = false;
      this.eventStream.emit(
        LivingWorldEventType.FLOW_STATE_LOST,
        LivingWorldEventPriority.LOW,
        timestamp,
        { flowState }
      );
    }

    // 3. Resonance Step Thresholds (every 10 units)
    const currentTier = Math.floor(worldResonance / 10.0);
    if (currentTier > this.lastReportedResonanceTier) {
      this.lastReportedResonanceTier = currentTier;
      this.eventStream.emit(
        LivingWorldEventType.RESONANCE_LEVEL_UP,
        LivingWorldEventPriority.NORMAL,
        timestamp,
        { tier: currentTier, worldResonance }
      );
    }
  }

  public resetSimulation(initialResonance: number = 0.0): void {
    this.flowController.reset(0.0);
    this.resonanceController.reset(initialResonance);
    this.frameIndex = 0;
    this.elapsedSimulationTime = 0.0;
    this.hasEmittedFirstRadiant = false;
    this.lastReportedResonanceTier = Math.floor(initialResonance / 10.0);
    this.highFlowStateActive = false;
    this.lastSnapshot = createInitialLivingWorldState(this.config.biomeId);
  }

  private registerTelemetry(): void {
    DebugTelemetry.register('livingWorld', () => ({
      activeBiomeId: this.config.biomeId,
      flowState: this.lastSnapshot.flowState,
      worldResonance: this.lastSnapshot.worldResonance,
      biomeHealthPercentage: this.lastSnapshot.biomeHealthPercentage,
      biomeInfluence: this.lastSnapshot.biomeInfluence,
      biomePhase: this.lastSnapshot.biomePhase,
      elapsedSimulationTime: this.elapsedSimulationTime,
      eventSequence: this.eventStream.getCurrentSequence(),
      computeCostMs: this.lastExecutionCostMs,
    }));
  }

  public dispose(): void {
    DebugTelemetry.unregister('livingWorld');
    this.eventStream.clearListeners();
  }
}
