import {
  UnifiedPresentationProfile,
  PresentationPhase,
  DEFAULT_UNIFIED_PRESENTATION_PROFILE,
} from './presentation-profile';
import { PresentationFrameState } from './presentation-frame-state';
import { PresentationProfileRegistry } from './presentation-profile-registry';
import { PresentationTransitionEngine } from './presentation-transition-engine';
import { PresentationEventBus } from './presentation-event-bus';
import { CameraPresentationController } from './camera-presentation-controller';
import { EnvironmentResponseController } from './environment-response-controller';
import { PlayerExpressionController } from '../player/player-expression-controller';
import { LivingWorldController } from '../world/living-world-controller';
import { LivingWorldState } from '../world/living-world-state';
import { MovementState, Vector3State } from '../movement/movement-types';
import { MovementEventDispatcher } from '../movement/movement-events';
import { DebugTelemetry } from '../telemetry/debug-telemetry';

export class PresentationPipeline {
  private registry: PresentationProfileRegistry;
  private transitionEngine: PresentationTransitionEngine;
  private eventBus: PresentationEventBus;

  private playerExpressionController: PlayerExpressionController;
  private cameraController: CameraPresentationController;
  private environmentController: EnvironmentResponseController;
  private livingWorldController: LivingWorldController;

  private phase: PresentationPhase = PresentationPhase.BOOT;
  private activeBaseProfile: UnifiedPresentationProfile;

  private frameIndex: number = 0;
  private latestSnapshot: PresentationFrameState | null = null;
  private lastExecutionCostMs: number = 0;

  constructor(
    dispatcher: MovementEventDispatcher | null = null,
    initialProfile: UnifiedPresentationProfile = DEFAULT_UNIFIED_PRESENTATION_PROFILE,
    livingWorldController: LivingWorldController | null = null
  ) {
    this.registry = new PresentationProfileRegistry();
    this.transitionEngine = new PresentationTransitionEngine();
    this.eventBus = new PresentationEventBus(dispatcher);
    this.livingWorldController = livingWorldController ?? new LivingWorldController();

    this.activeBaseProfile = initialProfile;
    this.registry.register(initialProfile);

    // Instantiate subsystem controllers
    this.playerExpressionController = new PlayerExpressionController(initialProfile.player);
    this.cameraController = new CameraPresentationController(initialProfile.camera);
    this.environmentController = new EnvironmentResponseController(initialProfile.environment, this.eventBus);

    this.phase = PresentationPhase.READY;
    this.registerTelemetry();
  }

  public getRegistry(): PresentationProfileRegistry {
    return this.registry;
  }

  public getPhase(): PresentationPhase {
    return this.phase;
  }

  public setPhase(phase: PresentationPhase): void {
    this.phase = phase;
  }

  public getActiveProfile(): UnifiedPresentationProfile {
    return this.activeBaseProfile;
  }

  public transitionToProfile(targetProfileId: string, durationMs?: number): boolean {
    const target = this.registry.get(targetProfileId);
    if (!target) {
      console.warn(`[PresentationPipeline] Unknown target profile ID: ${targetProfileId}`);
      return false;
    }

    this.transitionEngine.startTransition(this.activeBaseProfile, target, durationMs);
    this.setPhase(PresentationPhase.TRANSITION);
    return true;
  }

  public update(
    movementState: MovementState,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    deltaTimeSeconds: number = 0.016
  ): PresentationFrameState {
    const startTime = performance.now();
    this.frameIndex++;

    // 0. Update Living World simulation downstream of movement/physics
    const livingWorldSnapshot = this.livingWorldController.update(
      movementState,
      position,
      deltaTimeSeconds
    );

    if (this.phase === PresentationPhase.BOOT || this.phase === PresentationPhase.SHUTDOWN) {
      this.lastExecutionCostMs = performance.now() - startTime;
      return this.buildFrameSnapshot(
        this.activeBaseProfile,
        position,
        { x: position.x, y: position.y + 3.5, z: position.z - 10.0 },
        { x: position.x, y: position.y + 1.0, z: position.z },
        0.8,
        { x: 1, y: 1, z: 1 },
        0,
        0,
        false,
        0,
        livingWorldSnapshot
      );
    }

    if (this.phase === PresentationPhase.PAUSED && this.latestSnapshot) {
      this.lastExecutionCostMs = performance.now() - startTime;
      return this.latestSnapshot;
    }

    const deltaTimeMs = deltaTimeSeconds * 1000;

    // 1. Ask Transition Engine for active blended profile
    const transitionState = this.transitionEngine.update(deltaTimeMs, this.activeBaseProfile);
    const activeProfile = transitionState.blendedProfile;

    if (!transitionState.isTransitioning && this.phase === PresentationPhase.TRANSITION) {
      this.activeBaseProfile = transitionState.blendedProfile;
      this.setPhase(PresentationPhase.PLAYING);
    } else if (this.phase === PresentationPhase.READY) {
      this.setPhase(PresentationPhase.PLAYING);
    }

    // Apply active blended config down to subsystems
    this.playerExpressionController.setProfile(activeProfile.player);
    this.cameraController.setProfile(activeProfile.camera);
    this.environmentController.setProfile(activeProfile.environment);

    // 2. Subsystem 1: Camera Presentation State
    const cameraIntent = this.environmentController.extractEnvironmentIntent(movementState, position);
    const desiredFacing = {
      x: movementState.desiredVelocity?.x ?? 0,
      y: 0,
      z: movementState.desiredVelocity?.z ?? 0,
    };

    this.eventBus.broadcastSnapshot(movementState, position, {
      targetPosition: position,
      velocity: cameraIntent.playerVelocity,
      desiredFacingDirection: desiredFacing,
      speed: cameraIntent.speed,
      isGrounded: movementState.isGrounded,
      verticalVelocity: movementState.verticalVelocity,
      landingImpact: movementState.landingImpact,
    });

    const cameraState = this.cameraController.update(
      {
        targetPosition: position,
        velocity: cameraIntent.playerVelocity,
        desiredFacingDirection: desiredFacing,
        speed: cameraIntent.speed,
        isGrounded: movementState.isGrounded,
        verticalVelocity: movementState.verticalVelocity,
        landingImpact: movementState.landingImpact,
      },
      deltaTimeSeconds
    );

    // 3. Subsystem 2: Player Expression State
    const playerExprState = this.playerExpressionController.update(
      movementState,
      position,
      deltaTimeSeconds
    );

    // 4. Subsystem 3: Environment Response Telemetry
    const envState = this.environmentController.updateWithIntent(cameraIntent, deltaTimeSeconds);

    // 5. Compile into hierarchical frozen PresentationFrameState snapshot
    this.lastExecutionCostMs = performance.now() - startTime;

    this.latestSnapshot = this.buildFrameSnapshot(
      activeProfile,
      position,
      cameraState.position,
      cameraState.lookTarget,
      cameraState.fov,
      playerExprState.scaleTransform,
      playerExprState.material.emissiveIntensity,
      playerExprState.trail.opacity,
      transitionState.isTransitioning,
      transitionState.progress,
      livingWorldSnapshot
    );

    return this.latestSnapshot;
  }

  private buildFrameSnapshot(
    profile: UnifiedPresentationProfile,
    playerPos: Vector3State,
    camPos: Vector3State,
    camTarget: Vector3State,
    fov: number,
    scaleTransform: { x: number; y: number; z: number },
    emissiveOutput: number,
    trailAlpha: number,
    isTransitioning: boolean,
    transitionProgress: number,
    livingWorldSnapshot: LivingWorldState | null = null
  ): PresentationFrameState {
    const intensity = profile.global.presentationIntensity;

    const frameSnapshot: PresentationFrameState = {
      frame: {
        frameIndex: this.frameIndex,
        timestamp: performance.now(),
      },
      phase: this.phase,
      activeProfileId: profile.id,
      isTransitioning,
      transitionProgress,
      player: {
        scaleTransform: {
          x: scaleTransform.x * intensity,
          y: scaleTransform.y * intensity,
          z: scaleTransform.z * intensity,
        },
        emissiveLumenOutput: emissiveOutput * intensity,
        trailAlpha: trailAlpha * intensity,
      },
      camera: {
        position: { x: camPos.x, y: camPos.y, z: camPos.z },
        target: { x: camTarget.x, y: camTarget.y, z: camTarget.z },
        fieldOfView: fov,
      },
      environment: {
        vertexDisplacementUniforms: {
          playerPos: [playerPos.x, playerPos.y, playerPos.z],
          influenceRadius: profile.environment.vegetation.environmentInfluenceRadius,
        },
        activeSurfaceResponseTag: profile.environment.surface.defaultSurfaceMaterial,
        primaryGlobalColor: {
          r: profile.environment.lighting.color.r,
          g: profile.environment.lighting.color.g,
          b: profile.environment.lighting.color.b,
          intensity: profile.environment.lighting.ambientIntensity,
        },
      },
      world: {
        reservedWorldState: livingWorldSnapshot,
      },
      diagnostics: {
        totalPresentationCostMs: this.lastExecutionCostMs,
        appliedIntensity: intensity,
      },
    };

    return Object.freeze(frameSnapshot);
  }

  public getLatestSnapshot(): PresentationFrameState | null {
    return this.latestSnapshot;
  }

  public getEventBus(): PresentationEventBus {
    return this.eventBus;
  }

  public getCameraController(): CameraPresentationController {
    return this.cameraController;
  }

  public getEnvironmentController(): EnvironmentResponseController {
    return this.environmentController;
  }

  public getPlayerExpressionController(): PlayerExpressionController {
    return this.playerExpressionController;
  }

  public getLivingWorldController(): LivingWorldController {
    return this.livingWorldController;
  }

  private registerTelemetry(): void {
    DebugTelemetry.register('presentation', () => ({
      activeProfileId: this.activeBaseProfile.id,
      mood: this.activeBaseProfile.mood,
      phase: this.phase,
      isTransitioning: this.latestSnapshot?.isTransitioning ?? false,
      transitionProgress: this.latestSnapshot?.transitionProgress ?? 0.0,
      totalPresentationCostMs: this.lastExecutionCostMs,
      appliedIntensity: this.activeBaseProfile.global.presentationIntensity,
    }));
  }

  public dispose(): void {
    DebugTelemetry.unregister('presentation');
    this.livingWorldController.dispose();
    this.eventBus.reset();
  }
}
