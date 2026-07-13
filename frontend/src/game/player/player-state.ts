export interface PlayerTransform {
  positionX: number;
  positionY: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

export interface PlayerStats {
  energy: number;
  maxEnergy: number;
  comboCount: number;
  harmonyLevel: number;
  score: number;
}
