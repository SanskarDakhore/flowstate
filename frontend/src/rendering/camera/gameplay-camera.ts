import { Scene, TargetCamera, Vector3 } from '@babylonjs/core';
import { CameraPresentationController } from '../../game/presentation/camera-presentation-controller';
import {
  CameraMode as PresentationCameraMode,
  CameraPresentationState,
  DEFAULT_PRESENTATION_PROFILE,
} from '../../game/presentation/presentation-profile';

export type CameraMode =
  | 'CINEMATIC_IDLE'
  | 'PLAYING'
  | 'LOW_ANGLE_CHASE'
  | 'DYNAMIC_ORBIT'
  | 'CLOSE_ACTION'
  | 'BIRDS_EYE';

const CAMERA_MODE_CYCLE: CameraMode[] = [
  'PLAYING',
  'LOW_ANGLE_CHASE',
  'DYNAMIC_ORBIT',
  'CLOSE_ACTION',
  'BIRDS_EYE',
];

export class GameplayCamera {
  private camera: TargetCamera;
  private currentTarget = new Vector3(0, 0, 0);
  private baseFov: number = 0.8;

  // Cinematic / Title Orbit State
  private mode: CameraMode = 'PLAYING';
  private idleAngle: number = 0;
  private transitionAlpha: number = 0; // 0 = fully cinematic, 1 = fully gameplay

  private cameraController: CameraPresentationController;

  constructor(scene: Scene, _canvas: HTMLCanvasElement) {
    this.camera = new TargetCamera('gameplayCamera', new Vector3(0, 5.0, -10.0), scene);
    this.camera.fov = this.baseFov;
    this.camera.setTarget(new Vector3(0, 1.0, 5.0));

    this.cameraController = new CameraPresentationController(DEFAULT_PRESENTATION_PROFILE.camera);
  }

  public getCameraController(): CameraPresentationController {
    return this.cameraController;
  }

  public setMode(newMode: CameraMode): void {
    if (this.mode === newMode) return;
    this.mode = newMode;
    this.transitionAlpha = 0;

    const presMode = this.mapModeToPresentation(newMode);
    this.cameraController.setMode(presMode);
  }

  public cycleCameraAngle(): CameraMode {
    const currentIndex = CAMERA_MODE_CYCLE.indexOf(this.mode);
    const nextIndex = (currentIndex + 1) % CAMERA_MODE_CYCLE.length;
    const nextMode = CAMERA_MODE_CYCLE[nextIndex];
    this.setMode(nextMode);
    return nextMode;
  }

  private mapModeToPresentation(mode: CameraMode): PresentationCameraMode {
    switch (mode) {
      case 'PLAYING':
        return 'Playing';
      case 'LOW_ANGLE_CHASE':
        return 'LowAngleChase';
      case 'DYNAMIC_ORBIT':
        return 'DynamicOrbit';
      case 'CLOSE_ACTION':
        return 'CloseAction';
      case 'BIRDS_EYE':
        return 'BirdsEye';
      case 'CINEMATIC_IDLE':
      default:
        return 'Idle';
    }
  }

  public getMode(): CameraMode {
    return this.mode;
  }

  private shakeIntensity: number = 0;
  private shakeTimer: number = 0;

  public triggerScreenShake(intensity: number = 0.5): void {
    this.shakeIntensity = intensity;
    this.shakeTimer = 0.3; // Shake duration in seconds
  }

  public applyPresentationState(state: CameraPresentationState, deltaTimeSeconds: number = 0.016): void {
    if (this.mode === 'CINEMATIC_IDLE') {
      this.updateCinematicOrbit(state.lookTarget, deltaTimeSeconds);
      return;
    }

    // Apply Screen Shake Offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      this.shakeTimer -= deltaTimeSeconds;
      const currentIntensity = this.shakeIntensity * (this.shakeTimer / 0.3);
      shakeX = (Math.random() - 0.5) * 2.0 * currentIntensity;
      shakeY = (Math.random() - 0.5) * 2.0 * currentIntensity;
      if (this.shakeTimer <= 0) {
        this.shakeIntensity = 0;
      }
    }

    // Passive Adapter Execution: Apply calculated camera position, target, and FOV directly
    const targetPos = new Vector3(state.lookTarget.x, state.lookTarget.y, state.lookTarget.z);
    const camPos = new Vector3(state.position.x + shakeX, state.position.y + shakeY, state.position.z);

    if (this.transitionAlpha < 1.0) {
      this.transitionAlpha = Math.min(1.0, this.transitionAlpha + 1.8 * deltaTimeSeconds);
      const easeAlpha = this.easeInOutCubic(this.transitionAlpha);

      Vector3.LerpToRef(this.currentTarget, targetPos, easeAlpha, this.currentTarget);
      Vector3.LerpToRef(this.camera.position, camPos, easeAlpha, this.camera.position);
    } else {
      this.currentTarget.copyFrom(targetPos);
      this.camera.position.copyFrom(camPos);
    }

    this.camera.setTarget(this.currentTarget);
    this.camera.rotation.z = state.rollAngle; // Locked to 0.0 for stability
    this.camera.fov = state.fov;
  }

  public updateTarget(
    targetPosition: { x: number; y: number; z: number },
    forward: { x: number; y: number; z: number } = { x: 0, y: 0, z: 1 },
    speed: number = 10,
    _lateralIntent: number = 0,
    deltaTimeSeconds: number = 0.016
  ): void {
    if (this.mode === 'CINEMATIC_IDLE') {
      this.updateCinematicOrbit(targetPosition, deltaTimeSeconds);
      return;
    }

    // Fallback adapter path: run presentation controller tick directly
    const cameraState = this.cameraController.update(
      {
        targetPosition,
        velocity: { x: forward.x * speed, y: forward.y * speed, z: forward.z * speed },
        desiredFacingDirection: forward,
        speed,
        isGrounded: true,
        verticalVelocity: forward.y * speed,
        landingImpact: 0,
      },
      deltaTimeSeconds
    );

    this.applyPresentationState(cameraState, deltaTimeSeconds);
  }

  private updateCinematicOrbit(
    originPos: { x: number; y: number; z: number },
    deltaTimeSeconds: number
  ): void {
    this.idleAngle += 0.2 * deltaTimeSeconds;

    const lookAnchor = new Vector3(originPos.x, originPos.y - 2.0, originPos.z + 55.0);
    const orbitRadius = 45.0;
    const camX = lookAnchor.x + Math.sin(this.idleAngle) * orbitRadius;
    const camY = originPos.y + 20.0 + Math.sin(this.idleAngle * 0.7) * 2.0;
    const camZ = lookAnchor.z + Math.cos(this.idleAngle) * orbitRadius;

    const desiredCamPos = new Vector3(camX, camY, camZ);
    const desiredTargetPos = lookAnchor;

    const lerpFactor = Math.min(1.0, 4.0 * deltaTimeSeconds);
    Vector3.LerpToRef(this.camera.position, desiredCamPos, lerpFactor, this.camera.position);
    Vector3.LerpToRef(this.currentTarget, desiredTargetPos, lerpFactor, this.currentTarget);

    this.camera.setTarget(this.currentTarget);
    this.camera.rotation.z = 0;
    this.camera.fov = this.baseFov;
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  public resetPosition(targetPosition: { x: number; y: number; z: number }): void {
    this.currentTarget.set(targetPosition.x, targetPosition.y, targetPosition.z);
    this.cameraController.reset(targetPosition);
    const state = this.cameraController.getState();
    this.camera.position.set(state.position.x, state.position.y, state.position.z);
    this.camera.setTarget(this.currentTarget);
    this.camera.rotation.z = 0;
    this.camera.fov = this.baseFov;
  }

  public getCamera(): TargetCamera {
    return this.camera;
  }

  public dispose(): void {
    this.camera.dispose();
  }
}
