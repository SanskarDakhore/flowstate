import {
  PresentationProfile,
  DEFAULT_PRESENTATION_PROFILE,
  CameraIntent,
  PresentationState,
  UnifiedPresentationProfile,
  DEFAULT_UNIFIED_PRESENTATION_PROFILE,
} from './presentation-profile';
import { PresentationEventBus } from './presentation-event-bus';
import { CameraPresentationController } from './camera-presentation-controller';
import { MovementState, Vector3State } from '../movement/movement-types';
import { MovementEventDispatcher } from '../movement/movement-events';
import { EnvironmentProfile, DEFAULT_ENVIRONMENT_PROFILE } from './environment-profile';
import { PresentationPipeline } from './presentation-pipeline';

export class PresentationController {
  private pipeline: PresentationPipeline;
  private customProfileId: string | null = null;

  constructor(
    profile: PresentationProfile = DEFAULT_PRESENTATION_PROFILE,
    dispatcher: MovementEventDispatcher | null = null,
    environmentProfile: EnvironmentProfile = DEFAULT_ENVIRONMENT_PROFILE
  ) {
    this.pipeline = new PresentationPipeline(dispatcher, DEFAULT_UNIFIED_PRESENTATION_PROFILE);
    if (profile && profile.id) {
      this.customProfileId = profile.id;
    }
    this.setupEventListeners();
  }

  public getPipeline(): PresentationPipeline {
    return this.pipeline;
  }

  public setProfile(profile: PresentationProfile): boolean {
    if (!profile || !profile.camera || typeof profile.camera.follow.followStiffness !== 'number') {
      return false;
    }
    this.customProfileId = profile.id;
    this.pipeline.getCameraController().setProfile(profile.camera);
    return true;
  }

  public setEnvironmentProfile(envProfile: EnvironmentProfile): boolean {
    return this.pipeline.getEnvironmentController().setProfile(envProfile);
  }

  public setUnifiedProfile(unifiedProfile: UnifiedPresentationProfile): boolean {
    this.customProfileId = unifiedProfile.id;
    this.pipeline.getRegistry().register(unifiedProfile);
    return this.pipeline.transitionToProfile(unifiedProfile.id, 0);
  }

  public attachMovementDispatcher(dispatcher: MovementEventDispatcher): void {
    this.pipeline.getEventBus().attachMovementDispatcher(dispatcher);
    this.pipeline.getEnvironmentController().attachEventBus(this.pipeline.getEventBus());
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.pipeline.getEventBus().subscribeEvent('Landed', (payload) => {
      const impactVel = (payload.extraData?.landingResult as any)?.impactVelocity ?? payload.velocity.y;
      this.pipeline.getCameraController().triggerLandingCushion(impactVel);
    });
  }

  public extractCameraIntent(movementState: MovementState, position: Vector3State): CameraIntent {
    const curSpeed = Math.sqrt(
      movementState.currentHorizontalVelocityVector.x ** 2 +
        movementState.currentHorizontalVelocityVector.z ** 2
    );

    return {
      targetPosition: { ...position },
      velocity: {
        x: movementState.currentHorizontalVelocityVector.x,
        y: movementState.verticalVelocity,
        z: movementState.currentHorizontalVelocityVector.z,
      },
      desiredFacingDirection: {
        x: movementState.desiredVelocity.x,
        y: 0,
        z: movementState.desiredVelocity.z,
      },
      speed: curSpeed,
      isGrounded: movementState.isGrounded,
      verticalVelocity: movementState.verticalVelocity,
      landingImpact: movementState.landingImpact,
    };
  }

  public update(
    movementState: MovementState,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    deltaTimeSeconds: number = 0.016
  ): PresentationState {
    const frameSnapshot = this.pipeline.update(movementState, position, deltaTimeSeconds);

    return {
      camera: this.pipeline.getCameraController().getState(),
      activeProfileId: this.customProfileId ?? frameSnapshot.activeProfileId,
      presentationEventCount: this.pipeline.getEventBus().getEventCount(),
      lastStepDurationMs: frameSnapshot.diagnostics.totalPresentationCostMs,
    };
  }

  public getPresentationState(): PresentationState {
    return {
      camera: this.pipeline.getCameraController().getState(),
      activeProfileId: this.customProfileId ?? this.pipeline.getActiveProfile().id,
      presentationEventCount: this.pipeline.getEventBus().getEventCount(),
      lastStepDurationMs: 0,
    };
  }

  public getEventBus(): PresentationEventBus {
    return this.pipeline.getEventBus();
  }

  public getCameraController(): CameraPresentationController {
    return this.pipeline.getCameraController();
  }

  public reset(position: Vector3State = { x: 0, y: 0, z: 0 }): void {
    this.pipeline.getCameraController().reset(position);
  }

  public dispose(): void {
    this.pipeline.dispose();
  }
}
