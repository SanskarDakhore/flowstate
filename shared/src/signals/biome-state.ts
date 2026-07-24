export enum BiomeTypeEnum {
  Valley = 0,
  AlpineMeadow = 1,
  DesertCanyon = 2,
  MysticForest = 3,
  TranscendentVoid = 4,
}

export interface BiomeConfig {
  readonly biomeType: BiomeTypeEnum;
  readonly name: string;
  readonly primaryColorHex: string;
  readonly secondaryColorHex: string;
  readonly roughnessMultiplier: number;
  readonly heightBlendThreshold: number;
  readonly splatWeights: [number, number, number, number]; // [Grass, Rock, Dirt, Sand]
}

export interface PresentationBiomeState {
  readonly activeBiome: BiomeTypeEnum;
  readonly blendRatio: number;
  readonly colorGradingHex: string;
  readonly splatWeights: [number, number, number, number];
}

export function createDefaultPresentationBiomeState(): PresentationBiomeState {
  return {
    activeBiome: BiomeTypeEnum.Valley,
    blendRatio: 1.0,
    colorGradingHex: '#10b981',
    splatWeights: [0.6, 0.2, 0.2, 0.0],
  };
}
