import {
  ChunkLoaderMetrics,
  ChunkMemoryBudgetConfig,
  TrackChunkLoadPriority,
} from '@flowstate/shared';

export const DEFAULT_BUDGET_CONFIG: ChunkMemoryBudgetConfig = {
  maxMemoryBudgetMb: 64,
  maxLoadedChunkCount: 16,
};

interface LoadRequest {
  readonly chunkId: string;
  readonly priority: TrackChunkLoadPriority;
  readonly sizeMb: number;
}

export class TrackChunkLoader {
  private config: ChunkMemoryBudgetConfig;
  private loadedChunks: Map<string, number> = new Map(); // chunkId -> sizeMb
  private pendingQueue: LoadRequest[] = [];
  private totalMemoryMb: number = 0;
  private evictionCounter: number = 0;

  constructor(config: ChunkMemoryBudgetConfig = DEFAULT_BUDGET_CONFIG) {
    this.config = config;
  }

  public requestChunkLoad(
    chunkId: string,
    priority: TrackChunkLoadPriority = 'MEDIUM',
    sizeMb: number = 2.0
  ): void {
    if (this.loadedChunks.has(chunkId)) return;

    this.pendingQueue.push({ chunkId, priority, sizeMb });
    this.pendingQueue.sort((a, b) => {
      const pMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return pMap[b.priority] - pMap[a.priority];
    });
  }

  public processNextChunk(): boolean {
    if (this.pendingQueue.length === 0) return false;

    const request = this.pendingQueue.shift()!;

    // Evict trailing chunks if loading this chunk exceeds memory budget
    while (
      this.totalMemoryMb + request.sizeMb > this.config.maxMemoryBudgetMb ||
      this.loadedChunks.size >= this.config.maxLoadedChunkCount
    ) {
      if (!this.evictOldestChunk()) break;
    }

    this.loadedChunks.set(request.chunkId, request.sizeMb);
    this.totalMemoryMb += request.sizeMb;
    return true;
  }

  private evictOldestChunk(): boolean {
    const firstKey = this.loadedChunks.keys().next().value;
    if (!firstKey) return false;

    const size = this.loadedChunks.get(firstKey) ?? 0;
    this.loadedChunks.delete(firstKey);
    this.totalMemoryMb -= size;
    this.evictionCounter++;
    return true;
  }

  public cancelRequest(chunkId: string): boolean {
    const initLen = this.pendingQueue.length;
    this.pendingQueue = this.pendingQueue.filter((r) => r.chunkId !== chunkId);
    return this.pendingQueue.length < initLen;
  }

  public getMetrics(): ChunkLoaderMetrics {
    return {
      totalLoadedChunks: this.loadedChunks.size,
      pendingQueueLength: this.pendingQueue.length,
      memoryUsedMb: this.totalMemoryMb,
      memoryLimitMb: this.config.maxMemoryBudgetMb,
      evictionsCount: this.evictionCounter,
    };
  }
}
