import { BiomeConfig, BiomeTypeEnum } from '@flowstate/shared';

export class BiomeManager {
  private configs = new Map<BiomeTypeEnum, BiomeConfig>();

  constructor() {
    this.registerDefaultBiomes();
  }

  private registerDefaultBiomes(): void {
    this.configs.set(BiomeTypeEnum.Valley, {
      biomeType: BiomeTypeEnum.Valley,
      name: 'The Living Valley',
      primaryColorHex: '#10b981',
      secondaryColorHex: '#047857',
      roughnessMultiplier: 1.0,
      heightBlendThreshold: 0.1,
      splatWeights: [0.6, 0.2, 0.2, 0.0],
    });

    this.configs.set(BiomeTypeEnum.AlpineMeadow, {
      biomeType: BiomeTypeEnum.AlpineMeadow,
      name: 'Alpine Meadow',
      primaryColorHex: '#06b6d4',
      secondaryColorHex: '#0891b2',
      roughnessMultiplier: 0.8,
      heightBlendThreshold: 0.15,
      splatWeights: [0.7, 0.1, 0.2, 0.0],
    });

    this.configs.set(BiomeTypeEnum.DesertCanyon, {
      biomeType: BiomeTypeEnum.DesertCanyon,
      name: 'Desert Canyon',
      primaryColorHex: '#f59e0b',
      secondaryColorHex: '#b45309',
      roughnessMultiplier: 1.2,
      heightBlendThreshold: 0.2,
      splatWeights: [0.0, 0.3, 0.1, 0.6],
    });

    this.configs.set(BiomeTypeEnum.MysticForest, {
      biomeType: BiomeTypeEnum.MysticForest,
      name: 'Mystic Forest',
      primaryColorHex: '#8b5cf6',
      secondaryColorHex: '#6d28d9',
      roughnessMultiplier: 0.9,
      heightBlendThreshold: 0.1,
      splatWeights: [0.5, 0.2, 0.3, 0.0],
    });

    this.configs.set(BiomeTypeEnum.TranscendentVoid, {
      biomeType: BiomeTypeEnum.TranscendentVoid,
      name: 'Transcendent Void',
      primaryColorHex: '#ec4899',
      secondaryColorHex: '#be185d',
      roughnessMultiplier: 0.5,
      heightBlendThreshold: 0.05,
      splatWeights: [0.0, 0.8, 0.0, 0.2],
    });
  }

  public getBiomeConfig(biome: BiomeTypeEnum): BiomeConfig {
    return this.configs.get(biome) ?? this.configs.get(BiomeTypeEnum.Valley)!;
  }
}
