import {
  PlayerExpressionProfile,
  DEFAULT_PLAYER_EXPRESSION_PROFILE,
  ExpressionInputs,
  VisualExpressionState,
  ExpressionBlendState,
} from './player-expression-profile';
import { DeformationController } from './controllers/deformation-controller';
import { MaterialController } from './controllers/material-controller';
import { TrailController } from './controllers/trail-controller';
import { MovementState, Vector3State } from '../movement/movement-types';
import { MovementEventDispatcher } from '../movement/movement-events';

export class PlayerExpressionController {
  private profile: PlayerExpressionProfile;
  private deformationController: DeformationController;
  private materialController: MaterialController;
  private trailController: TrailController;
  private dispatcher: MovementEventDispatcher | null = null;
  private unsubscribeEvents: Array<() => void> = [];

  private latestVisualState: VisualExpressionState;

  constructor(
    profile: PlayerExpressionProfile = DEFAULT_PLAYER_EXPRESSION_PROFILE,
    dispatcher: MovementEventDispatcher | null = null
  ) {
    this.profile = profile;
    this.deformationController = new DeformationController(this.profile);
    this.materialController = new MaterialController(this.profile);
    this.trailController = new TrailController(this.profile);

    this.latestVisualState = this.createInitialVisualState();

    if (dispatcher) {
      this.attachEventDispatcher(dispatcher);
    }
  }

  public setProfile(profile: PlayerExpressionProfile): boolean {
    if (!profile || typeof profile.expressionIntensity !== 'number' || typeof profile.maxHorizontalStretch !== 'number') {
      console.warn('[PlayerExpressionController] Rejected invalid PlayerExpressionProfile:', profile);
      return false;
    }

    this.profile = profile;
    this.deformationController.setProfile(profile);
    this.materialController.setProfile(profile);
    this.trailController.setProfile(profile);
    return true;
  }

  public attachEventDispatcher(dispatcher: MovementEventDispatcher): void {
    this.detachEventDispatcher();
    this.dispatcher = dispatcher;

    const unSubJump = dispatcher.subscribe('JumpStarted', () => {
      this.deformationController.triggerJumpLaunchCompression();
    });

    const unSubLand = dispatcher.subscribe('Landed', (payload) => {
      const impactVel = (payload.extraData?.landingResult as any)?.impactVelocity ?? payload.velocity.y;
      this.deformationController.triggerLandingImpact(impactVel);
    });

    this.unsubscribeEvents.push(unSubJump, unSubLand);
  }

  public detachEventDispatcher(): void {
    this.unsubscribeEvents.forEach((unsub) => unsub());
    this.unsubscribeEvents = [];
    this.dispatcher = null;
  }

  private createInitialVisualState(): VisualExpressionState {
    return {
      blendState: {
        idleBlend: 1.0,
        speedBlend: 0.0,
        airborneBlend: 0.0,
        landingBlend: 0.0,
        accelerationBlend: 0.0,
      },
      scaleTransform: { x: 1.0, y: 1.0, z: 1.0 },
      material: {
        emissiveIntensity: this.profile.baseEmissiveIntensity,
        glowAlpha: 0.22,
        pulsePhase: 0,
        rimPower: this.profile.fresnelGlowPower,
        surfaceOpacity: 0.85,
      },
      trail: {
        opacity: 0.3,
        length: 2.0,
        width: 0.3,
        intensity: 0.0,
      },
      activeProfileId: this.profile.id,
    };
  }

  public extractInputs(movementState: MovementState, position: Vector3State = { x: 0, y: 0, z: 0 }): ExpressionInputs {
    const curSpeed = Math.sqrt(
      movementState.currentHorizontalVelocityVector.x ** 2 +
        movementState.currentHorizontalVelocityVector.z ** 2
    );

    // Map momentumScore (0-100) to high-level movementEnergy (0.0-1.0)
    const energy = Math.max(0, Math.min(1.0, movementState.momentumScore / 100.0));

    return {
      spatial: {
        position: { ...position },
      },
      motion: {
        velocity: {
          x: movementState.currentHorizontalVelocityVector.x,
          y: movementState.verticalVelocity,
          z: movementState.currentHorizontalVelocityVector.z,
        },
        speed: curSpeed,
        airborneHeight: movementState.airborneHeight,
        verticalVelocity: movementState.verticalVelocity,
        isGrounded: movementState.isGrounded,
      },
      presentationHints: {
        movementEnergy: energy,
        landingImpact: movementState.landingImpact,
        gravityPhase: movementState.activeGravityPhase,
      },
      events: {
        jumpEventCounter: movementState.jumpId,
        lastJumpIndex: movementState.currentJumpCount,
        justLanded: movementState.landingImpact > 0,
      },
    };
  }

  public update(
    movementState: MovementState,
    position: Vector3State = { x: 0, y: 0, z: 0 },
    deltaTimeSeconds: number = 0.016
  ): VisualExpressionState {
    const inputs = this.extractInputs(movementState, position);

    // 1. Evaluate Continuous Blend State
    const speedBlend = Math.min(1.0, inputs.motion.speed / 20.0);
    const idleBlend = Math.max(0, 1.0 - speedBlend * 2.0);

    let airborneBlend = 0;
    if (!inputs.motion.isGrounded) {
      if (inputs.motion.verticalVelocity > 2.5) {
        airborneBlend = Math.min(1.0, inputs.motion.verticalVelocity / 10.0);
      } else if (inputs.motion.verticalVelocity < -2.5) {
        airborneBlend = Math.max(-1.0, inputs.motion.verticalVelocity / 20.0);
      }
    }

    const landingBlend = inputs.motion.isGrounded ? Math.min(1.0, inputs.presentationHints.landingImpact / 20.0) : 0;
    const accelerationBlend = speedBlend > 0.1 ? speedBlend : 0;

    const blendState: ExpressionBlendState = {
      idleBlend,
      speedBlend,
      airborneBlend,
      landingBlend,
      accelerationBlend,
    };

    // 2. Delegate to Sub-Controllers
    const scaleTransform = this.deformationController.update(inputs, deltaTimeSeconds);
    const material = this.materialController.update(inputs, deltaTimeSeconds);
    const trail = this.trailController.update(inputs, deltaTimeSeconds);

    this.latestVisualState = {
      blendState,
      scaleTransform,
      material,
      trail,
      activeProfileId: this.profile.id,
    };

    return { ...this.latestVisualState };
  }

  public getVisualExpressionState(): VisualExpressionState {
    return { ...this.latestVisualState };
  }

  public getProfile(): PlayerExpressionProfile {
    return this.profile;
  }

  public reset(): void {
    this.deformationController.reset();
    this.materialController.reset();
    this.trailController.reset();
    this.latestVisualState = this.createInitialVisualState();
  }

  public dispose(): void {
    this.detachEventDispatcher();
    this.reset();
  }
}
