import { PresentationPhase } from './presentation-profile';
import { LivingWorldState } from '../world/living-world-state';

export interface PresentationFrameState {
  readonly frame: {
    readonly frameIndex: number;
    readonly timestamp: number;
  };
  readonly phase: PresentationPhase;
  readonly activeProfileId: string;
  readonly isTransitioning: boolean;
  readonly transitionProgress: number; // 0.0 to 1.0
  readonly player: {
    readonly scaleTransform: { readonly x: number; readonly y: number; readonly z: number };
    readonly emissiveLumenOutput: number;
    readonly trailAlpha: number;
  };
  readonly camera: {
    readonly position: { readonly x: number; readonly y: number; readonly z: number };
    readonly target: { readonly x: number; readonly y: number; readonly z: number };
    readonly fieldOfView: number;
  };
  readonly environment: {
    readonly vertexDisplacementUniforms: {
      readonly playerPos: readonly [number, number, number];
      readonly influenceRadius: number;
    };
    readonly activeSurfaceResponseTag: string;
    readonly primaryGlobalColor: { readonly r: number; readonly g: number; readonly b: number; readonly intensity: number };
  };
  readonly world: {
    readonly reservedWorldState: LivingWorldState | null; // Integrated Living World Simulation State
  };
  readonly diagnostics: {
    readonly totalPresentationCostMs: number;
    readonly appliedIntensity: number;
  };
}

export function createInitialFrameState(): PresentationFrameState {
  const initial: PresentationFrameState = {
    frame: {
      frameIndex: 0,
      timestamp: 0,
    },
    phase: PresentationPhase.BOOT,
    activeProfileId: 'UNIFIED_LIVING_VALLEY',
    isTransitioning: false,
    transitionProgress: 0.0,
    player: {
      scaleTransform: { x: 1.0, y: 1.0, z: 1.0 },
      emissiveLumenOutput: 0.65,
      trailAlpha: 0.0,
    },
    camera: {
      position: { x: 0.0, y: 3.5, z: -10.0 },
      target: { x: 0.0, y: 1.0, z: 0.0 },
      fieldOfView: 0.8,
    },
    environment: {
      vertexDisplacementUniforms: {
        playerPos: [0, 0, 0],
        influenceRadius: 2.8,
      },
      activeSurfaceResponseTag: 'GRASS_MUD',
      primaryGlobalColor: { r: 0.92, g: 0.98, b: 0.95, intensity: 0.85 },
    },
    world: {
      reservedWorldState: null,
    },
    diagnostics: {
      totalPresentationCostMs: 0.0,
      appliedIntensity: 1.0,
    },
  };

  return Object.freeze(initial);
}
