import { BiomeManager } from '../../src/rendering/environment/biome/biome-manager';
import { SplatMaterialEngine } from '../../src/rendering/environment/biome/splat-material-engine';
import { BiomeTypeEnum } from '@flowstate/shared';

describe('Data-Driven Biomes & Procedural Splat Materials', () => {
  let manager: BiomeManager;
  let splatEngine: SplatMaterialEngine;

  beforeEach(() => {
    manager = new BiomeManager();
    splatEngine = new SplatMaterialEngine();
  });

  it('should retrieve correct configuration for all registered biomes', () => {
    const valley = manager.getBiomeConfig(BiomeTypeEnum.Valley);
    expect(valley.name).toBe('The Living Valley');
    expect(valley.splatWeights).toEqual([0.6, 0.2, 0.2, 0.0]);

    const canyon = manager.getBiomeConfig(BiomeTypeEnum.DesertCanyon);
    expect(canyon.name).toBe('Desert Canyon');
    expect(canyon.splatWeights).toEqual([0.0, 0.3, 0.1, 0.6]);
  });

  it('should calculate smooth normalized splat weight blending between biomes', () => {
    const valleyWeights: [number, number, number, number] = [0.6, 0.2, 0.2, 0.0];
    const canyonWeights: [number, number, number, number] = [0.0, 0.3, 0.1, 0.6];

    const blendedHalf = splatEngine.computeBlendedSplatWeights(valleyWeights, canyonWeights, 0.5);
    expect(blendedHalf[0]).toBeCloseTo(0.3);
    expect(blendedHalf[3]).toBeCloseTo(0.3);

    const sum = blendedHalf[0] + blendedHalf[1] + blendedHalf[2] + blendedHalf[3];
    expect(sum).toBeCloseTo(1.0);
  });
});
