import { ParticlePoolManager } from './particle-pool-manager';

export class ParticleKinematicsSolver {
  private static readonly DRAG = 0.5;

  public integrate(buffer: Float32Array, activeCount: number, deltaTime: number, turbulence: number): void {
    if (deltaTime <= 0 || activeCount <= 0) return;

    const stride = ParticlePoolManager.STRIDE;
    const dragFactor = Math.exp(-ParticleKinematicsSolver.DRAG * deltaTime);

    for (let i = 0; i < activeCount; i++) {
      const idx = i * stride;

      // 1. Update Lifetime
      buffer[idx + 6] += deltaTime; // life
      const maxLife = buffer[idx + 7];
      if (buffer[idx + 6] >= maxLife) {
        // Recycle particle
        buffer[idx + 6] = 0.0;
        buffer[idx + 1] = 0.0; // py ground
      }

      // 2. Velocity Integration with Atmospheric Drag & Buoyancy
      let vx = buffer[idx + 3] * dragFactor;
      let vy = (buffer[idx + 4] + 0.5 * deltaTime) * dragFactor; // Anti-gravity buoyancy
      let vz = buffer[idx + 5] * dragFactor;

      buffer[idx + 3] = vx;
      buffer[idx + 4] = vy;
      buffer[idx + 5] = vz;

      // 3. Position Integration
      buffer[idx + 0] += vx * deltaTime;
      buffer[idx + 1] += vy * deltaTime;
      buffer[idx + 2] += vz * deltaTime;

      // 4. Alpha Fade Curve Equation: 4.0 * tau * (1.0 - tau)
      const tau = Math.min(1.0, Math.max(0.0, buffer[idx + 6] / maxLife));
      buffer[idx + 12] = 4.0 * tau * (1.0 - tau); // alpha
    }
  }
}
