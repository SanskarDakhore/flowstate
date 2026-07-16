import {
  CameraBehaviorProfile,
  CameraIntent,
  CameraMode,
  CameraPresentationState,
} from './presentation-profile';

export class CameraPresentationController {
  private profile: CameraBehaviorProfile;

  // Zero-Allocation Pre-Allocated Internal Vector Buffers
  private curPos = { x: 0, y: 5.0, z: -10.0 };
  private curLookTarget = { x: 0, y: 1.0, z: 5.0 };
  private desiredTarget = { x: 0, y: 1.0, z: 5.0 };
  private desiredCamPos = { x: 0, y: 5.0, z: -10.0 };

  private baseOffset = { x: 0, y: 3.8, z: -8.5 };

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

    // 2. Compute Target Look-Ahead Vector
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
    this.desiredCamPos.x = intent.targetPosition.x + this.baseOffset.x;
    this.desiredCamPos.y = intent.targetPosition.y + this.baseOffset.y - this.currentLandingOffset;
    this.desiredCamPos.z = intent.targetPosition.z + this.baseOffset.z;

    // 3. Analytical Exponential Decay Filtering
    const prevPosX = this.curPos.x;
    const prevPosY = this.curPos.y;
    const prevPosZ = this.curPos.z;

    this.curLookTarget.x += (this.desiredTarget.x - this.curLookTarget.x) * decayFactor;
    this.curLookTarget.y += (this.desiredTarget.y - this.curLookTarget.y) * decayFactor;
    this.curLookTarget.z += (this.desiredTarget.z - this.curLookTarget.z) * decayFactor;

    this.curPos.x += (this.desiredCamPos.x - this.curPos.x) * decayFactor;
    this.curPos.y += (this.desiredCamPos.y - this.curPos.y) * decayFactor;
    this.curPos.z += (this.desiredCamPos.z - this.curPos.z) * decayFactor;

    // 4. Calculate Diagnostic Telemetry (Camera Error & Tracking Speed)
    const dxErr = this.desiredTarget.x - this.curLookTarget.x;
    const dyErr = this.desiredTarget.y - this.curLookTarget.y;
    const dzErr = this.desiredTarget.z - this.curLookTarget.z;
    this.cameraErrorDistance = Math.sqrt(dxErr * dxErr + dyErr * dyErr + dzErr * dzErr);

    const moveDx = this.curPos.x - prevPosX;
    const moveDy = this.curPos.y - prevPosY;
    const moveDz = this.curPos.z - prevPosZ;
    this.actualFollowSpeed = Math.sqrt(moveDx * moveDx + moveDy * moveDy + moveDz * moveDz) / clampedDt;

    // 5. Conservative FOV Expansion
    const maxSpeed = 20.0;
    const normalizedSpeed = Math.min(1.0, intent.speed / maxSpeed);
    const targetFov = this.profile.fov.baseFov + normalizedSpeed * this.profile.fov.maxFovSpeedExpansion;
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
      x: position.x + this.baseOffset.x,
      y: position.y + this.baseOffset.y,
      z: position.z + this.baseOffset.z,
    };
    this.currentLandingOffset = 0;
    this.landingRecoveryTimerMs = 0;
    this.currentFov = this.profile.fov.baseFov;
    this.activeMode = 'Playing';
    this.cameraErrorDistance = 0;
    this.actualFollowSpeed = 0;
  }
}
