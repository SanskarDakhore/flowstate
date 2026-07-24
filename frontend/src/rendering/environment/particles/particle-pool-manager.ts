export class ParticlePoolManager {
  public static readonly STRIDE = 14; // 14 floats per particle

  private particleBuffer: Float32Array;
  private maxCount: number;
  private activeCount: number = 0;

  constructor(maxCount: number = 50000) {
    this.maxCount = maxCount;
    this.particleBuffer = new Float32Array(maxCount * ParticlePoolManager.STRIDE);
  }

  public setActiveCount(count: number): void {
    this.activeCount = Math.min(this.maxCount, Math.max(0, count));
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  public getBuffer(): Float32Array {
    return this.particleBuffer;
  }
}
