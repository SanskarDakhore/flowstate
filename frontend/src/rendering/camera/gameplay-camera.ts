import { Scene, TargetCamera, Vector3 } from '@babylonjs/core';

export type CameraMode = 'CINEMATIC_IDLE' | 'PLAYING';

export class GameplayCamera {
  private camera: TargetCamera;
  private baseOffset = new Vector3(0, 3.8, -8.5);
  private currentTarget = new Vector3(0, 0, 0);
  private currentRoll: number = 0;
  private baseFov: number = 0.8;

  // Cinematic / Title Orbit State
  private mode: CameraMode = 'CINEMATIC_IDLE';
  private idleAngle: number = 0;
  private transitionAlpha: number = 0; // 0 = fully cinematic, 1 = fully gameplay

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new TargetCamera('gameplayCamera', new Vector3(0, 5.0, -10.0), scene);
    this.camera.fov = this.baseFov;
    this.camera.setTarget(new Vector3(0, 1.0, 5.0));
  }

  public setMode(newMode: CameraMode): void {
    if (this.mode === newMode) return;
    this.mode = newMode;

    if (newMode === 'PLAYING') {
      this.transitionAlpha = 0; // Start smooth interpolation swing into chase perspective
    } else {
      this.transitionAlpha = 0;
    }
  }

  public getMode(): CameraMode {
    return this.mode;
  }

  public updateTarget(
    targetPosition: { x: number; y: number; z: number },
    forward: { x: number; y: number; z: number } = { x: 0, y: 0, z: 1 },
    speed: number = 10,
    lateralIntent: number = 0,
    deltaTimeSeconds: number = 0.016
  ): void {
    if (this.mode === 'CINEMATIC_IDLE') {
      this.updateCinematicOrbit(targetPosition, deltaTimeSeconds);
      return;
    }

    // 1. Compute dynamic look-ahead target vector for active gameplay
    const lookAheadDistance = Math.min(6.0, 2.0 + (speed / 20.0) * 4.0);
    const desiredTarget = new Vector3(
      targetPosition.x + forward.x * lookAheadDistance,
      targetPosition.y + forward.y * lookAheadDistance,
      targetPosition.z + forward.z * lookAheadDistance
    );

    // Compute dynamic camera position offset
    const desiredCameraPos = new Vector3(
      targetPosition.x + this.baseOffset.x,
      targetPosition.y + this.baseOffset.y,
      targetPosition.z + this.baseOffset.z
    );

    // If swinging from Cinematic into Playing, perform a smooth blend transition
    if (this.transitionAlpha < 1.0) {
      this.transitionAlpha = Math.min(1.0, this.transitionAlpha + 1.8 * deltaTimeSeconds);
      const easeAlpha = this.easeInOutCubic(this.transitionAlpha);

      Vector3.LerpToRef(this.currentTarget, desiredTarget, easeAlpha, this.currentTarget);
      Vector3.LerpToRef(this.camera.position, desiredCameraPos, easeAlpha, this.camera.position);
    } else {
      // Standard gameplay frame lerp
      const lerpFactor = Math.min(1.0, 12.0 * deltaTimeSeconds);
      Vector3.LerpToRef(this.currentTarget, desiredTarget, lerpFactor, this.currentTarget);
      Vector3.LerpToRef(this.camera.position, desiredCameraPos, lerpFactor, this.camera.position);
    }

    this.camera.setTarget(this.currentTarget);

    // 2. Smooth lateral banking (roll rotation) on turning
    const targetRoll = -lateralIntent * 0.08; // Max ~4.5 degrees subtle banking
    this.currentRoll += (targetRoll - this.currentRoll) * Math.min(1.0, 8.0 * deltaTimeSeconds);
    this.camera.rotation.z = this.currentRoll;

    // 3. Smooth FOV widen at high speed
    const normalizedSpeed = Math.min(1.0, Math.max(0, (speed - 8.0) / 15.0));
    const targetFov = this.baseFov + normalizedSpeed * 0.12;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1.0, 5.0 * deltaTimeSeconds);
  }

  private updateCinematicOrbit(
    originPos: { x: number; y: number; z: number },
    deltaTimeSeconds: number
  ): void {
    // Slow, relaxing orbital rotation around starting track area — pulled back
    // and raised to an establishing angle so the title screen frames the valley
    // (widened terrain + rising walls) instead of being filled by track/rail.
    this.idleAngle += 0.2 * deltaTimeSeconds;

    // Orbit around a point well down-track (not the origin itself) so the
    // circling camera stays pointed toward the opening-zone trees/landform
    // cluster (~40-90m ahead) instead of the empty start of the path.
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
    this.camera.position.set(
      targetPosition.x + this.baseOffset.x,
      targetPosition.y + this.baseOffset.y,
      targetPosition.z + this.baseOffset.z
    );
    this.camera.setTarget(this.currentTarget);
    this.camera.rotation.z = 0;
    this.currentRoll = 0;
    this.camera.fov = this.baseFov;
  }

  public getCamera(): TargetCamera {
    return this.camera;
  }

  public dispose(): void {
    this.camera.dispose();
  }
}
