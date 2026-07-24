export class MistLayer {
  private fogDensity: number = 0.005;
  private mistHeight: number = 10.0;

  public update(density: number): void {
    this.fogDensity = density;
    this.mistHeight = 10.0 + (density * 50.0);
  }

  public getFogDensity(): number {
    return this.fogDensity;
  }

  public getMistHeight(): number {
    return this.mistHeight;
  }
}
