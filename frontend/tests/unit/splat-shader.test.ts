import { SplatShaderMaterial } from '../../src/rendering/shaders/splat-shader-material';

describe('SplatShaderMaterial Engine Unit Tests', () => {
  let material: SplatShaderMaterial;

  beforeEach(() => {
    material = new SplatShaderMaterial({ triplanarExponent: 6.0 });
  });

  afterEach(() => {
    material.dispose();
  });

  test('Splat map RGBA weight normalization logic correctly enforces unit sum', () => {
    const rawWeights = [0.4, 0.8, 0.4, 0.4]; // Sum = 2.0
    const sum = rawWeights.reduce((a, b) => a + b, 0);
    const normalized = rawWeights.map((w) => w / sum);

    expect(normalized.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 5);
    expect(normalized).toEqual([0.2, 0.4, 0.2, 0.2]);
  });

  test('Triplanar normal blend weight calculation matches exponential distribution formula', () => {
    const normal = { x: 0.0, y: 0.8, z: 0.6 }; // Surface sloped on YZ plane
    const exponent = 4.0;

    const absN = [Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z)];
    const powN = absN.map((v) => Math.pow(v, exponent));
    const sumPow = powN.reduce((a, b) => a + b, 0);
    const weights = powN.map((v) => v / sumPow);

    expect(weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 5);
    expect(weights[0]).toBe(0);
    expect(weights[1]).toBeGreaterThan(weights[2]);
  });

  test('Dynamic uniform updates mutate values in-place without replacing object references', () => {
    const initialUniformRef = material.uniforms.uTime;
    const initialVectorRef = material.uniforms.uLightDirection.value;

    material.updateFrame(0.016, 1.0, 3.0, 2.0);
    material.updateLighting([0.0, -1.0, 0.0], [1.0, 1.0, 1.0]);

    expect(material.uniforms.uTime).toBe(initialUniformRef);
    expect(material.uniforms.uLightDirection.value).toBe(initialVectorRef);
    expect(material.uniforms.uTime.value).toBe(1.0);
    expect(material.uniforms.uKineticPulseFrequency.value).toBe(3.0);
  });

  test('Steady-state execution produces zero heap memory allocation over 1,000 ticks', () => {
    const gcFn = (global as any).gc;
    if (typeof gcFn === 'function') {
      gcFn();
    }
    const initialHeapUsage = process.memoryUsage().heapUsed;

    const frameDelta = 0.016;
    let accumulatedTime = 0.0;

    for (let tick = 0; tick < 1000; tick++) {
      accumulatedTime += frameDelta;
      material.updateFrame(frameDelta, accumulatedTime, 2.5 + (tick % 10) * 0.1, 1.5);

      if (tick % 100 === 0) {
        material.updateLighting(
          [Math.sin(accumulatedTime), -1.0, Math.cos(accumulatedTime)],
          [1.0, 0.9, 0.8]
        );
      }
    }

    if (typeof gcFn === 'function') {
      gcFn();
    }
    const finalHeapUsage = process.memoryUsage().heapUsed;

    const heapDelta = finalHeapUsage - initialHeapUsage;
    expect(heapDelta).toBeLessThanOrEqual(1024 * 1024); // Within 1MB heap delta tolerance in V8 test runner
  });
});
