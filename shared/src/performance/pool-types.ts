import { TrackFrameBasis, Vector3D } from '../track/track-types';

export type LODLevel = 'LOD_0' | 'LOD_1' | 'LOD_2';

export interface ObjectPoolConfig {
  readonly initialCapacity: number;  // Default N = 16
  readonly maxCapacity: number;      // Maximum growth limit N_max = 32
  readonly lookAheadDistance: number;// Streaming look-ahead radius (150m)
  readonly recycleDistance: number;  // Trailing recycling radius (50m)
  readonly lodHysteresisBuffer: number; // 5.0m overlap hysteresis buffer
}

export interface TrackChunkSegment {
  readonly chunkId: string;
  readonly chunkIndex: number;
  readonly startDistance: number;
  readonly endDistance: number;
  readonly controlPoints: Vector3D[];
  readonly frames: TrackFrameBasis[];
  readonly currentLOD: LODLevel;
  readonly isActive: boolean;
}

export interface ChunkStreamingState {
  readonly activeChunkCount: number;
  readonly dormantChunkCount: number;
  readonly currentHeadChunkIndex: number;
  readonly currentTailChunkIndex: number;
  readonly totalDistanceStreamed: number;
}

export interface PoolMetrics {
  readonly totalAllocated: number;
  readonly inUseCount: number;
  readonly freeCount: number;
  readonly acquireCount: number;
  readonly releaseCount: number;
  readonly zeroAllocationPassed: boolean;
}
