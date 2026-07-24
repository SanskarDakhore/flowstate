export interface WildlifeState {
  readonly populationDensity: number;
  readonly flockCohesion: number;
  readonly activityLevel: number;
  readonly activeSpeciesCount: number;
  readonly timestamp: number;
}

export interface PresentationWildlifeState {
  readonly creatureDensity: number;
  readonly flockCohesion: number;
  readonly activityLevel: number;
  readonly spiritAuraIntensity: number;
}

export function createDefaultWildlifeState(): WildlifeState {
  return {
    populationDensity: 0.0,
    flockCohesion: 0.5,
    activityLevel: 0.0,
    activeSpeciesCount: 0,
    timestamp: Date.now(),
  };
}

export function createDefaultPresentationWildlifeState(): PresentationWildlifeState {
  return {
    creatureDensity: 0.0,
    flockCohesion: 0.5,
    activityLevel: 0.0,
    spiritAuraIntensity: 0.0,
  };
}
