import { WindDisplacementSolver } from '../../src/rendering/environment/vegetation/wind-displacement-solver';
import { InstanceBufferManager } from '../../src/rendering/environment/vegetation/instance-buffer-manager';

describe('GPU Instanced Vegetation Wind Shaders & Sway Systems', () => {
  let solver: WindDisplacementSolver;
  let bufferManager: InstanceBufferManager;

  beforeEach(() => {
    solver = new WindDisplacementSolver();
    bufferManager = new InstanceBufferManager();
  });

  it('should evaluate quadratic height bending stiffness correctly (0 displacement at base y=0)', () => {
    const baseDisplacement = solver.computeVertexDisplacement(0.0, 2.0, 10.0, 10.0, 1.0, 1.5, 0.5);
    expect(baseDisplacement.dx).toBe(0.0);
    expect(baseDisplacement.dz).toBe(0.0);

    const tipDisplacement = solver.computeVertexDisplacement(2.0, 2.0, 10.0, 10.0, 1.0, 1.5, 0.5);
    expect(Math.abs(tipDisplacement.dx)).toBeGreaterThan(0.0);
  });

  it('should pack GPU instance transform matrices without allocation overhead', () => {
    const buffer = bufferManager.updateInstanceBuffer(100);
    expect(buffer.length).toBe(1600);

    // Identity matrix verification for first instance
    expect(buffer[0]).toBe(1.0);
    expect(buffer[5]).toBe(1.0);
    expect(buffer[10]).toBe(1.0);
    expect(buffer[15]).toBe(1.0);
  });
});
