export class SplatMaterialEngine {
  public computeBlendedSplatWeights(
    weightsA: [number, number, number, number],
    weightsB: [number, number, number, number],
    ratio: number
  ): [number, number, number, number] {
    const t = Math.min(1.0, Math.max(0.0, ratio));
    const invT = 1.0 - t;

    const w0 = (weightsA[0] * invT) + (weightsB[0] * t);
    const w1 = (weightsA[1] * invT) + (weightsB[1] * t);
    const w2 = (weightsA[2] * invT) + (weightsB[2] * t);
    const w3 = (weightsA[3] * invT) + (weightsB[3] * t);

    const sum = w0 + w1 + w2 + w3;
    if (sum <= 0) return [1.0, 0.0, 0.0, 0.0];

    return [w0 / sum, w1 / sum, w2 / sum, w3 / sum];
  }
}
