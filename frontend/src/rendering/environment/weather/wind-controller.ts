export class WindController {
  private swayMultiplier: number = 0.1;

  public update(windStrength: number): void {
    this.swayMultiplier = windStrength;
  }

  public getSwayMultiplier(): number {
    return this.swayMultiplier;
  }
}
