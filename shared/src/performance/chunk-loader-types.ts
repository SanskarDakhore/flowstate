export type TrackChunkLoadPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ChunkMemoryBudgetConfig {
  readonly maxMemoryBudgetMb: number; // 64MB limit
  readonly maxLoadedChunkCount: number;
}

export interface ChunkLoaderMetrics {
  readonly totalLoadedChunks: number;
  readonly pendingQueueLength: number;
  readonly memoryUsedMb: number;
  readonly memoryLimitMb: number;
  readonly evictionsCount: number;
}
