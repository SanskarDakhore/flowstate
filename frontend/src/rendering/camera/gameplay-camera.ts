import { Scene, TargetCamera, Vector3 } from '@babylonjs/core';

export class GameplayCamera {
  private camera: TargetCamera;
  private baseOffset = new Vector3(0, 3.8, -8.5);
  private currentTarget = new Vector3(0, 0, 0);
  private currentRoll: number = 0;
  private baseFov: number = 0.8;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new TargetCamera('gameplayCamera', new Vector3(0, 3.8, -8.5), scene);
    this.camera.fov = this.baseFov;
    this.camera.setTarget(Vector3.Zero());
  }

  public updateTarget(
    targetPosition: { x: number; y: number; z: number },
    forward: { x: number; y: number; z: number } = { x: 0, y: 0, z: 1 },
    speed: number = 10,
    lateralIntent: number = 0,
    deltaTimeSeconds: number = 0.016
  ): void {
    // 1. Compute dynamic look-ahead target vector
    const lookAheadDistance = Math.min(6.0, 2.0 + (speed / 20.0) * 4.0);
    const desiredTarget = new Vector3(
      targetPosition.x + forward.x * lookAheadDistance,
      targetPosition.y + forward.y * lookAheadDistance,
      targetPosition.z + forward.z * lookAheadDistance
    );

    // Smooth lerp to camera target point
    const lerpFactor = Math.min(1.0, 12.0 * deltaTimeSeconds);
    Vector3.LerpToRef(this.currentTarget, desiredTarget, lerpFactor, this.currentTarget);

    // 2. Compute dynamic camera position offset
    const desiredCameraPos = new Vector3(
      targetPosition.x + this.baseOffset.x,
      targetPosition.y + this.baseOffset.y,
      targetPosition.z + this.baseOffset.z
    );

    Vector3.LerpToRef(this.camera.position, desiredCameraPos, lerpFactor, this.camera.position);
    this.camera.setTarget(this.currentTarget);

    // 3. Smooth lateral banking (roll rotation) on turning
    const targetRoll = -lateralIntent * 0.08; // Max ~4.5 degrees subtle banking
    this.currentRoll += (targetRoll - this.currentRoll) * Math.min(1.0, 8.0 * deltaTimeSeconds);
    this.camera.rotation.z = this.currentRoll;

    // 4. Smooth FOV widen at high speed
    const normalizedSpeed = Math.min(1.0, Math.max(0, (speed - 8.0) / 15.0));
    const targetFov = this.baseFov + normalizedSpeed * 0.12; // Widen FOV slightly at speed
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1.0, 5.0 * deltaTimeSeconds);
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
