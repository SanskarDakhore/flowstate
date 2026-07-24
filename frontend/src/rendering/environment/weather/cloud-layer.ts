export class CloudLayer {
  private opacity: number = 0.1;
  private movementSpeed: number = 1.0;

  public update(cloudOpacity: number, windStrength: number): void {
    this.opacity = cloudOpacity;
    this.movementSpeed = 1.0 + (windStrength * 2.0);
  }

  public getOpacity(): number {
    return this.opacity;
  }

  public getMovementSpeed(): number {
    return this.movementSpeed;
  }
}
