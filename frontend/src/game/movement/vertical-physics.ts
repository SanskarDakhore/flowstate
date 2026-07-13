import { MovementPhysicsConfig, DEFAULT_PHYSICS_CONFIG } from './movement-config';

export interface VerticalPhysicsResult {
  airborneHeight: number;
  verticalVelocity: number;
  isGrounded: boolean;
  impactVelocity: number;
  justLanded: boolean;
  jumpsUsed: number;
  jumpTriggered: boolean;
  jumpIndex: number; // 1 for first launch, 2 for second mid-air impulse
}

export class VerticalPhysics {
  private config: MovementPhysicsConfig;

  private airborneHeight: number = 0;
  private verticalVelocity: number = 0;
  private isGrounded: boolean = true;
  private impactVelocity: number = 0;
  private justLanded: boolean = false;
  private jumpsUsed: number = 0;

  constructor(config: MovementPhysicsConfig = DEFAULT_PHYSICS_CONFIG) {
    this.config = config;
  }

  public update(jumpRequested: boolean, deltaTime: number): VerticalPhysicsResult {
    this.justLanded = false;
    let jumpTriggered = false;
    let jumpIndex = 0;

    if (deltaTime <= 0) {
      return this.getResult(jumpTriggered, jumpIndex);
    }

    const effectiveGravity = this.config.gravity * (this.config.gravityScale ?? 1.0);

    // Discrete jump request evaluation (edge-triggered)
    if (jumpRequested && this.jumpsUsed < this.config.maxJumps) {
      if (this.isGrounded || this.jumpsUsed === 0) {
        // First Jump: Launch from track
        this.jumpsUsed = 1;
        this.verticalVelocity = this.config.jumpImpulse;
        this.isGrounded = false;
        jumpTriggered = true;
        jumpIndex = 1;
      } else if (this.jumpsUsed === 1) {
        // Second Jump: Mid-air controlled energy impulse (Velocity Overwrite)
        this.jumpsUsed = 2;
        this.verticalVelocity = this.config.secondaryJumpImpulse;
        this.isGrounded = false;
        jumpTriggered = true;
        jumpIndex = 2;
      }
    }

    // Continuous gravity integration when airborne
    if (!this.isGrounded) {
      this.verticalVelocity += effectiveGravity * deltaTime;

      if (this.verticalVelocity < this.config.maxFallSpeed) {
        this.verticalVelocity = this.config.maxFallSpeed;
      }

      this.airborneHeight += this.verticalVelocity * deltaTime;

      // Landing resolution
      if (this.airborneHeight <= 0) {
        this.airborneHeight = 0;
        this.isGrounded = true;
        this.impactVelocity = this.verticalVelocity; // Capture impact strength before zeroing
        this.verticalVelocity = 0;
        this.jumpsUsed = 0; // Reset jump charges upon surface contact
        this.justLanded = true;
      }
    }

    return this.getResult(jumpTriggered, jumpIndex);
  }

  public reset(): void {
    this.airborneHeight = 0;
    this.verticalVelocity = 0;
    this.isGrounded = true;
    this.impactVelocity = 0;
    this.justLanded = false;
    this.jumpsUsed = 0;
  }

  public getResult(jumpTriggered: boolean = false, jumpIndex: number = 0): VerticalPhysicsResult {
    return {
      airborneHeight: this.airborneHeight,
      verticalVelocity: this.verticalVelocity,
      isGrounded: this.isGrounded,
      impactVelocity: this.impactVelocity,
      justLanded: this.justLanded,
      jumpsUsed: this.jumpsUsed,
      jumpTriggered,
      jumpIndex,
    };
  }

  public getState(): VerticalPhysicsResult {
    return this.getResult();
  }
}
