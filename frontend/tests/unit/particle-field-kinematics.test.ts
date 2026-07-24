import { ParticlePoolManager } from '../../src/rendering/environment/particles/particle-pool-manager';
import { ParticleKinematicsSolver } from '../../src/rendering/environment/particles/particle-kinematics-solver';

describe('Kinetic Particle Field & Energy Flow Simulation', () => {
  let poolManager: ParticlePoolManager;
  let solver: ParticleKinematicsSolver;

  beforeEach(() => {
    poolManager = new ParticlePoolManager(1000);
    solver = new ParticleKinematicsSolver();
  });

  it('should initialize zero-allocation Float32Array particle buffer with 14-float stride', () => {
    const buffer = poolManager.getBuffer();
    expect(buffer.length).toBe(1000 * 14);
    expect(poolManager.getActiveCount()).toBe(0);

    poolManager.setActiveCount(500);
    expect(poolManager.getActiveCount()).toBe(500);
  });

  it('should integrate particle positions with drag, buoyancy, and Hermite opacity fade curve equation', () => {
    poolManager.setActiveCount(1);
    const buffer = poolManager.getBuffer();

    // Setup initial particle 0
    buffer[0] = 0.0;  // px
    buffer[1] = 10.0; // py
    buffer[2] = 0.0;  // pz
    buffer[3] = 2.0;  // vx
    buffer[4] = 1.0;  // vy
    buffer[5] = 0.0;  // vz
    buffer[6] = 0.5;  // life
    buffer[7] = 2.0;  // maxLife

    solver.integrate(buffer, 1, 0.1, 0.2);

    expect(buffer[0]).toBeGreaterThan(0.0); // Moved horizontally
    expect(buffer[1]).toBeGreaterThan(10.0); // Moved vertically
    expect(buffer[6]).toBeCloseTo(0.6); // Life advanced

    // Check Hermite alpha fade curve equation: 4.0 * tau * (1.0 - tau) where tau = 0.6 / 2.0 = 0.3 -> 4.0 * 0.3 * 0.7 = 0.84
    expect(buffer[12]).toBeCloseTo(0.84);
  });
});
