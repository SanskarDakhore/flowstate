import {
  CameraBehaviorProfile,
  CameraIntent,
  CameraMode,
  CameraPresentationState,
} from './presentation-profile';

export interface CameraOffsetPreset {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly fovOffset: number;
}

export const CAMERA_ANGLE_PRESETS: Record<CameraMode, CameraOffsetPreset> = {
  Playing: { x: 0, y: 3.8, z: -8.5, fovOffset: 0.0 },
  LowAngleChase: { x: 0, y: 1.2, z: -6.0, fovOffset: 0.15 },
  DynamicOrbit: { x: 0, y: 4.5, z: -9.0, fovOffset: 0.05 },
  CloseAction: { x: 0, y: 2.0, z: -4.0, fovOffset: -0.1 },
  BirdsEye: { x: 0, y: 22.0, z: -3.0, fovOffset: 0.2 },
  Idle: { x: 0, y: 3.8, z: -8.5, fovOffset: 0.0 },
  Landing: { x: 0, y: 3.0, z: -7.5, fovOffset: 0.0 },
  Airborne: { x: 0, y: 5.0, z: -10.0, fovOffset: 0.05 },
  Transition: { x: 0, y: 3.8, z: -8.5, fovOffset: 0.0 },
};

export class CameraPresentationController {
  private profile: CameraBehaviorProfile;

  // Zero-Allocation Pre-Allocated Internal Vector Buffers
  private curPos = { x: 0, y: 5.0, z: -10.0 };
  private curLookTarget = { x: 0, y: 1.0, z: 5.0 };
  private desiredTarget = { x: 0, y: 1.0, z: 5.0 };
  private desiredCamPos = { x: 0, y: 5.0, z: -10.0 };

  private activeOffset = { x: 0, y: 3.8, z: -8.5 };
  private orbitAngle: number = 0;

  // Smooth State Counters
  private currentLandingOffset: number = 0;
  private landingRecoveryTimerMs: number = 0;
  private currentFov: number = 0.8;
  private activeMode: CameraMode = 'Playing';

  private cameraErrorDistance: number = 0;
  private actualFollowSpeed: number = 0;

  constructor(profile: CameraBehaviorProfile) {
    this.profile = profile;
    this.currentFov = profile.fov.baseFov;
  }

  public setProfile(profile: CameraBehaviorProfile): void {
    this.profile = profile;
  }

  public setMode(mode: CameraMode): void {
    this.activeMode = mode;
  }

  public getMode(): CameraMode {
    return this.activeMode;
  }

  public triggerLandingCushion(impactVelocity: number): void {
    const absorption = this.profile.landing.landingCushionAbsorption;
    const normalizedImpact = Math.min(1.0, Math.abs(impactVelocity) / 25.0);
    // Inject soft downward Y cushion offset (weighty settling without oscillating bounce)
    this.currentLandingOffset = normalizedImpact * 1.5 * absorption;
    this.landingRecoveryTimerMs = this.profile.landing.cushionRecoveryMs;
  }

  public update(intent: CameraIntent, dt: number): CameraPresentationState {
    if (dt <= 0) {
      return this.getState();
    }

    const clampedDt = Math.min(0.1, dt);
    const lambda = this.profile.follow.followStiffness;
    const decayFactor = 1.0 - Math.exp(-lambda * clampedDt);

    // 1. Process Landing Cushion Recovery Offset (Easing dissipation)
    if (this.landingRecoveryTimerMs > 0) {
      this.landingRecoveryTimerMs -= clampedDt * 1000;
      const progress = Math.max(0, this.landingRecoveryTimerMs / this.profile.landing.cushionRecoveryMs);
      this.currentLandingOffset *= progress;
    } else {
      this.currentLandingOffset = 0;
    }

    // 2. Select Active Camera Preset & Smooth Blend Offset
    const preset = CAMERA_ANGLE_PRESETS[this.activeMode] ?? CAMERA_ANGLE_PRESETS.Playing;
    let targetOffsetX = preset.x;
    let targetOffsetY = preset.y;
    let targetOffsetZ = preset.z;

    // Special handling for DYNAMIC_ORBIT mode (360 deg orbital rotation around player)
    if (this.activeMode === 'DynamicOrbit') {
      this.orbitAngle += clampedDt * 0.8;
      const radius = 9.0;
      targetOffsetX = Math.sin(this.orbitAngle) * radius;
      targetOffsetZ = -Math.cos(this.orbitAngle) * radius;
    }

    // Blend active offset vector smoothly
    this.activeOffset.x += (targetOffsetX - this.activeOffset.x) * decayFactor;
    this.activeOffset.y += (targetOffsetY - this.activeOffset.y) * decayFactor;
    this.activeOffset.z += (targetOffsetZ - this.activeOffset.z) * decayFactor;

    // 3. Compute Target Look-Ahead Vector
    const maxDist = this.profile.lookAhead.maxDistance;
    const lookAheadScalar = Math.min(maxDist, intent.speed * this.profile.lookAhead.lookAheadFactor);

    let facingX = intent.desiredFacingDirection.x;
    let facingZ = intent.desiredFacingDirection.z;
    const facingLen = Math.sqrt(facingX * facingX + facingZ * facingZ);
    if (facingLen > 0.001) {
      facingX /= facingLen;
      facingZ /= facingLen;
    } else {
      facingX = 0;
      facingZ = 1;
    }

    // Upward framing bias during jump ascent
    let verticalBias = 0;
    if (!intent.isGrounded && intent.verticalVelocity > 2.0) {
      verticalBias = this.profile.jump.verticalFramingBias;
    }

    this.desiredTarget.x = intent.targetPosition.x + facingX * lookAheadScalar;
    this.desiredTarget.y = intent.targetPosition.y + verticalBias - this.currentLandingOffset;
    this.desiredTarget.z = intent.targetPosition.z + facingZ * lookAheadScalar;

    // Ideal camera position offset
    this.desiredCamPos.x = intent.targetPosition.x + this.activeOffset.x;
    this.desiredCamPos.y = intent.targetPosition.y + this.activeOffset.y - this.currentLandingOffset;
    this.desiredCamPos.z = intent.targetPosition.z + this.activeOffset.z;

    // 4. Analytical Exponential Decay Filtering
    const prevPosX = this.curPos.x;
    const prevPosY = this.curPos.y;
    const prevPosZ = this.curPos.z;

    this.curLookTarget.x += (this.desiredTarget.x - this.curLookTarget.x) * decayFactor;
    this.curLookTarget.y += (this.desiredTarget.y - this.curLookTarget.y) * decayFactor;
    this.curLookTarget.z += (this.desiredTarget.z - this.curLookTarget.z) * decayFactor;

    this.curPos.x += (this.desiredCamPos.x - this.curPos.x) * decayFactor;
    this.curPos.y += (this.desiredCamPos.y - this.curPos.y) * decayFactor;
    this.curPos.z += (this.desiredCamPos.z - this.curPos.z) * decayFactor;

    // 5. Diagnostic Telemetry
    const dxErr = this.desiredTarget.x - this.curLookTarget.x;
    const dyErr = this.desiredTarget.y - this.curLookTarget.y;
    const dzErr = this.desiredTarget.z - this.curLookTarget.z;
    this.cameraErrorDistance = Math.sqrt(dxErr * dxErr + dyErr * dyErr + dzErr * dzErr);

    const moveDx = this.curPos.x - prevPosX;
    const moveDy = this.curPos.y - prevPosY;
    const moveDz = this.curPos.z - prevPosZ;
    this.actualFollowSpeed = Math.sqrt(moveDx * moveDx + moveDy * moveDy + moveDz * moveDz) / clampedDt;

    // 6. Dynamic FOV Scaling Expansion
    const maxSpeed = 20.0;
    const normalizedSpeed = Math.min(1.0, intent.speed / maxSpeed);
    const targetFov =
      this.profile.fov.baseFov +
      preset.fovOffset +
      normalizedSpeed * this.profile.fov.maxFovSpeedExpansion;

    this.currentFov += (targetFov - this.currentFov) * decayFactor;

    return this.getState();
  }

  public getState(): CameraPresentationState {
    return {
      position: { ...this.curPos },
      lookTarget: { ...this.curLookTarget },
      fov: this.currentFov,
      rollAngle: 0.0, // Locked to zero for comfort
      framingBias: !this.profile ? 0 : this.profile.jump.verticalFramingBias,
      landingOffset: this.currentLandingOffset,
      activeMode: this.activeMode,
      cameraError: this.cameraErrorDistance,
      currentFollowSpeed: this.actualFollowSpeed,
    };
  }

  public reset(position: { x: number; y: number; z: number }): void {
    this.curLookTarget = { ...position };
    this.curPos = {
      x: position.x + this.activeOffset.x,
      y: position.y + this.activeOffset.y,
      z: position.z + this.activeOffset.z,
    };
    this.currentLandingOffset = 0;
    this.landingRecoveryTimerMs = 0;
    this.currentFov = this.profile.fov.baseFov;
    this.activeMode = 'Playing';
    this.cameraErrorDistance = 0;
    this.actualFollowSpeed = 0;
  }
}
