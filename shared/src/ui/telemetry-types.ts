import { Vector3D } from '../track/track-types';

export interface TelemetryDrawerState {
  readonly isOpen: boolean;
  readonly activeTab: 'OVERVIEW' | 'PHYSICS' | 'PERFORMANCE' | 'MEMORY';
  readonly isPinned: boolean;
}

export interface HUDScrimConfig {
  readonly opacity: number;
  readonly blurPx: number;
  readonly scrimColor: string; // CSS Token e.g. var(--flow-text-scrim)
}

export interface DevTelemetryMetrics {
  readonly fps: number;
  readonly frameTimeMs: number;
  readonly position: Vector3D;
  readonly velocity: Vector3D;
  readonly trackCurvature: number;
  readonly bankAngleDeg: number;
  readonly collisionImpulse: number;
  readonly heapUsedMb: number;
  readonly activeChunksCount: number;
}

export interface PlayerHUDState {
  readonly speedKmh: number;
  readonly resonancePercent: number;
  readonly momentumScore: number;
  readonly currentLapTimeMs: number;
}
