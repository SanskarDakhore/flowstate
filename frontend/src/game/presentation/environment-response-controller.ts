import {
  EnvironmentProfile,
  DEFAULT_ENVIRONMENT_PROFILE,
  EnvironmentIntent,
  AmbientExpressionState,
  SurfaceMaterial,
} from './environment-profile';
import { VegetationProximitySubsystem } from './subsystems/vegetation-proximity-subsystem';
import { SurfaceResponseSubsystem } from './subsystems/surface-response-subsystem';
import { RippleResponseSubsystem } from './subsystems/ripple-response-subsystem';
import { MovementState, Vector3State } from '../movement/movement-types';
import { MovementEventPayload } from '../movement/movement-events';
import { PresentationEventBus } from './presentation-event-bus';
import { DebugTelemetry } from '../telemetry/debug-telemetry';

export class EnvironmentResponseController {
  private profile: EnvironmentProfile;
  private vegetationSubsystem: VegetationProximitySubsystem;
  private surfaceSubsystem: SurfaceResponseSubsystem;
  private rippleSubsystem: RippleResponseSubsystem;

  private lastCycleFrameTimeMs: number = 0;
  private peakFrameTimeMs: number = 0;

  constructor(
    profile: EnvironmentProfile = DEFAULT_ENVIRONMENT_PROFILE,
    eventBus: PresentationEventBus | null = null
  ) {
    this.profile = profile;
    this.vegetationSubsystem = new VegetationProximitySubsystem(profile.vegetation);
    this.surfaceSubsystem = new SurfaceResponseSubsystem(profile.surface);
    this.rippleSubsystem = new RippleResponseSubsystem(profile.water);

    if (eventBus) {
      this.attachEventBus(eventBus);
    }

    this.registerTelemetry();
  }

  public loadProfile(profile: EnvironmentProfile): boolean {
    return this.setProfile(profile);
  }

  public setProfile(profile: EnvironmentProfile): boolean {
    if (!profile || !profile.vegetation || !profile.surface || !profile.water) {
      console.warn('[EnvironmentResponseController] Rejected invalid profile:', profile);
      return false;
    }

    this.profile = profile;
    this.vegetationSubsystem.setConfig(profile.vegetation);
    this.surfaceSubsystem.setConfig(profile.surface);
    this.rippleSubsystem.setConfig(profile.water);
    return true;
  }

  public getProfile(): EnvironmentProfile {
    return this.profile;
  }

  public attachEventBus(eventBus: PresentationEventBus): void {
    eventBus.subscribeEvent('Landed', (payload: MovementEventPayload) => {
      this.onPlayerLanded(payload);
    });
  }

  private onPlayerLanded(payload: MovementEventPayload): void {
    const landingImpact = (payload.extraData?.landingResult as any)?.impactVelocity ?? payload.velocity.y;
    const intensity = this.profile.responseIntensity;

    // Water ripple response on liquid landing
    if (this.profile.surface.defaultSurfaceMaterial === SurfaceMaterial.Water || this.profile.water.baseRippleSpeed > 0) {
      this.rippleSubsystem.triggerImpactRipple(payload.position, landingImpact, intensity);
    }

    // Heavy landing triggers burst of localized surface response
    this.surfaceSubsystem.triggerSurfaceResponse(
      payload.position,
      payload.velocity,
      this.profile.surface.defaultSurfaceMaterial,
      1.0,
      undefined,
      intensity
    );
  }

  /**
   * Transforms raw MovementState + Position into an immutable EnvironmentIntent snapshot
   */
  public extractEnvironmentIntent(
    movementState: MovementState,
    position: Vector3State
  ): EnvironmentIntent {
    const speed = movementState.momentumMagnitude;
    const movementEnergy = (speed / Math.max(1, movementState.targetSpeed)) * (movementState.flowEfficiency ?? 1.0);

    return {
      playerPosition: { ...position },
      playerVelocity: {
        x: movementState.currentHorizontalVelocityVector.x,
        y: movementState.verticalVelocity,
        z: movementState.currentHorizontalVelocityVector.z,
      },
      speed,
      movementEnergy,
      landingImpact: movementState.landingImpact,
      surfaceMaterialTag: this.profile.surface.defaultSurfaceMaterial,
      isGrounded: movementState.isGrounded,
    };
  }

  /**
   * Pure observer update loop consuming immutable EnvironmentIntent snapshot
   */
  public updateWithIntent(
    intent: EnvironmentIntent,
    deltaTimeSeconds: number = 0.016
  ): AmbientExpressionState {
    const startTime = performance.now();

    const intensity = this.profile.responseIntensity;

    // Update active subsystems inline without allocations
    this.surfaceSubsystem.update(deltaTimeSeconds);
    this.rippleSubsystem.update(deltaTimeSeconds);

    // Grounded locomotion continuous surface response emission
    if (intent.isGrounded && intent.speed > 2.0) {
      this.surfaceSubsystem.triggerSurfaceResponse(
        intent.playerPosition,
        intent.playerVelocity,
        intent.surfaceMaterialTag,
        undefined,
        undefined,
        intensity
      );
    }

    // Measure processing latency
    this.lastCycleFrameTimeMs = performance.now() - startTime;
    if (this.lastCycleFrameTimeMs > this.peakFrameTimeMs) {
      this.peakFrameTimeMs = this.lastCycleFrameTimeMs;
    }

    return this.getTelemetryState();
  }

  /**
   * Backward-compatible direct update wrapper building intent internally
   */
  public update(
    deltaTimeSeconds: number = 0.016,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    velocity: Vector3State = { x: 0, y: 0, z: 0 },
    movementState?: MovementState
  ): AmbientExpressionState {
    const intent: EnvironmentIntent = {
      playerPosition: position,
      playerVelocity: velocity,
      speed: Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z),
      movementEnergy: 1.0,
      landingImpact: movementState?.landingImpact ?? 0,
      surfaceMaterialTag: this.profile.surface.defaultSurfaceMaterial,
      isGrounded: movementState?.isGrounded ?? true,
    };

    return this.updateWithIntent(intent, deltaTimeSeconds);
  }

  public getTelemetryState(): AmbientExpressionState {
    return {
      activeProfileId: this.profile.id,
      activeVegetation: this.vegetationSubsystem.getActiveUniformBindingsCount(),
      activeRipples: this.rippleSubsystem.getActiveRipplesCount(),
      activeSurfaceResponses: this.surfaceSubsystem.getActiveCount(),
      currentActiveResponseRadius: this.profile.vegetation.environmentInfluenceRadius,
      activeVegetationUniformsBound: this.vegetationSubsystem.getActiveUniformBindingsCount(),
      liveSurfaceResponsePoolUsage: this.surfaceSubsystem.getActiveCount(),
      inactivePoolCapacity: this.surfaceSubsystem.getInactiveCount(),
      largestPoolUsage: this.surfaceSubsystem.getPeakUsageCount(),
      frameTimeMs: this.lastCycleFrameTimeMs,
      peakFrameTimeMs: this.peakFrameTimeMs,
    };
  }

  public getSurfacePoolFreeCount(): number {
    return this.surfaceSubsystem.getPoolFreeCount();
  }

  public getVegetationSubsystem(): VegetationProximitySubsystem {
    return this.vegetationSubsystem;
  }

  public getSurfaceSubsystem(): SurfaceResponseSubsystem {
    return this.surfaceSubsystem;
  }

  public getRippleSubsystem(): RippleResponseSubsystem {
    return this.rippleSubsystem;
  }

  private registerTelemetry(): void {
    DebugTelemetry.register('ambient', () => this.getTelemetryState());
  }

  public reset(): void {
    this.vegetationSubsystem.reset();
    this.surfaceSubsystem.reset();
    this.rippleSubsystem.reset();
    this.lastCycleFrameTimeMs = 0;
    this.peakFrameTimeMs = 0;
  }

  public dispose(): void {
    DebugTelemetry.unregister('ambient');
    this.reset();
  }
}
