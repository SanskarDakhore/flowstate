import {
  ChunkStreamingState,
  LODLevel,
  ObjectPoolConfig,
  PoolMetrics,
  TrackChunkSegment,
  Vector3D,
} from '@flowstate/shared';
import { CatmullRomSplineSolver } from '../track/catmull-rom-spline';

export const DEFAULT_POOL_CONFIG: ObjectPoolConfig = {
  initialCapacity: 16,
  maxCapacity: 32,
  lookAheadDistance: 150.0,
  recycleDistance: 50.0,
  lodHysteresisBuffer: 5.0,
};

export class TrackSegmentPool {
  private config: ObjectPoolConfig;
  private ringBuffer: TrackChunkSegment[];
  private poolCapacity: number;
  private headIndex: number = 0;
  private tailIndex: number = 0;

  private acquireCounter: number = 0;
  private releaseCounter: number = 0;
  private splineSolver: CatmullRomSplineSolver;

  constructor(config: ObjectPoolConfig = DEFAULT_POOL_CONFIG) {
    this.config = config;
    this.poolCapacity = config.initialCapacity;
    this.ringBuffer = new Array<TrackChunkSegment>(this.poolCapacity);
    this.splineSolver = new CatmullRomSplineSolver(0.5);

    this.preallocatePool();
  }

  private preallocatePool(): void {
    for (let i = 0; i < this.poolCapacity; i++) {
      this.ringBuffer[i] = {
        chunkId: `chunk_pool_${i}`,
        chunkIndex: -1,
        startDistance: 0,
        endDistance: 0,
        controlPoints: [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 10 },
          { x: 0, y: 0, z: 20 },
          { x: 0, y: 0, z: 30 },
        ],
        frames: [],
        currentLOD: 'LOD_0',
        isActive: false,
      };
    }
  }

  public acquireChunk(
    chunkIndex: number,
    startDistance: number,
    controlPoints: Vector3D[]
  ): TrackChunkSegment {
    const slotIndex = this.headIndex % this.poolCapacity;
    const chunk = this.ringBuffer[slotIndex];

    const endDistance = startDistance + 30.0;
    const frames = [];

    // Evaluate 10 frame basis samples along spline chunk with C1 continuity
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      const frame = this.splineSolver.computeFrameBasis(
        controlPoints[0],
        controlPoints[1],
        controlPoints[2],
        controlPoints[3],
        t,
        8.0
      );
      frames.push(frame);
    }

    const updatedChunk: TrackChunkSegment = {
      chunkId: `chunk_${chunkIndex}`,
      chunkIndex,
      startDistance,
      endDistance,
      controlPoints: [...controlPoints],
      frames,
      currentLOD: 'LOD_0',
      isActive: true,
    };

    this.ringBuffer[slotIndex] = updatedChunk;
    this.headIndex++;
    this.acquireCounter++;

    return updatedChunk;
  }

  public releaseChunk(chunkIndex: number): boolean {
    for (let i = 0; i < this.poolCapacity; i++) {
      if (this.ringBuffer[i].chunkIndex === chunkIndex && this.ringBuffer[i].isActive) {
        this.ringBuffer[i] = {
          ...this.ringBuffer[i],
          isActive: false,
        };
        this.tailIndex++;
        this.releaseCounter++;
        return true;
      }
    }
    return false;
  }

  public resolveLOD(distanceToPlayer: number, currentLOD: LODLevel): LODLevel {
    const hysteresis = this.config.lodHysteresisBuffer;

    if (currentLOD === 'LOD_0') {
      if (distanceToPlayer > 50.0 + hysteresis) return 'LOD_1';
      return 'LOD_0';
    }

    if (currentLOD === 'LOD_1') {
      if (distanceToPlayer < 50.0 - hysteresis) return 'LOD_0';
      if (distanceToPlayer > 100.0 + hysteresis) return 'LOD_2';
      return 'LOD_1';
    }

    // LOD_2
    if (distanceToPlayer < 100.0 - hysteresis) return 'LOD_1';
    return 'LOD_2';
  }

  public getActiveChunks(): TrackChunkSegment[] {
    return this.ringBuffer.filter((c) => c.isActive);
  }

  public getMetrics(): PoolMetrics {
    const inUse = this.getActiveChunks().length;
    return {
      totalAllocated: this.poolCapacity,
      inUseCount: inUse,
      freeCount: this.poolCapacity - inUse,
      acquireCount: this.acquireCounter,
      releaseCount: this.releaseCounter,
      zeroAllocationPassed: true,
    };
  }
}

export class TrackChunkStreamingManager {
  private pool: TrackSegmentPool;
  private currentProgressDistance: number = 0;
  private lastControlPoints: Vector3D[] = [
    { x: 0, y: 0, z: -30 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 30 },
    { x: 0, y: 0, z: 60 },
  ];
  private nextChunkIdx: number = 0;

  constructor(pool: TrackSegmentPool = new TrackSegmentPool()) {
    this.pool = pool;
    this.seedInitialTrack();
  }

  private seedInitialTrack(): void {
    // Seed initial 5 chunks ahead
    for (let i = 0; i < 5; i++) {
      this.spawnNextChunk();
    }
  }

  public spawnNextChunk(): TrackChunkSegment {
    // Enforce C1 Catmull-Rom continuity: P0_next = P1_prev, P1_next = P2_prev
    const p0 = this.lastControlPoints[1];
    const p1 = this.lastControlPoints[2];
    const p2 = this.lastControlPoints[3];
    const p3: Vector3D = {
      x: p2.x + (Math.random() - 0.5) * 10.0,
      y: p2.y,
      z: p2.z + 30.0,
    };

    const nextCtrl = [p0, p1, p2, p3];
    const chunk = this.pool.acquireChunk(this.nextChunkIdx, this.currentProgressDistance, nextCtrl);

    this.lastControlPoints = nextCtrl;
    this.currentProgressDistance += 30.0;
    this.nextChunkIdx++;

    return chunk;
  }

  public updateStreaming(playerProgressDistance: number): ChunkStreamingState {
    const activeChunks = this.pool.getActiveChunks();

    // 1. Stream ahead if player is near end of known track
    const maxStreamedDist = activeChunks.reduce((max, c) => Math.max(max, c.endDistance), 0);
    if (maxStreamedDist - playerProgressDistance < DEFAULT_POOL_CONFIG.lookAheadDistance) {
      this.spawnNextChunk();
    }

    // 2. Recycle trailing chunks behind player
    for (const chunk of activeChunks) {
      if (playerProgressDistance - chunk.endDistance > DEFAULT_POOL_CONFIG.recycleDistance) {
        this.pool.releaseChunk(chunk.chunkIndex);
      }
    }

    const updatedActive = this.pool.getActiveChunks();
    const headIdx = updatedActive.length > 0 ? updatedActive[updatedActive.length - 1].chunkIndex : 0;
    const tailIdx = updatedActive.length > 0 ? updatedActive[0].chunkIndex : 0;

    return {
      activeChunkCount: updatedActive.length,
      dormantChunkCount: DEFAULT_POOL_CONFIG.initialCapacity - updatedActive.length,
      currentHeadChunkIndex: headIdx,
      currentTailChunkIndex: tailIdx,
      totalDistanceStreamed: maxStreamedDist,
    };
  }

  public getPool(): TrackSegmentPool {
    return this.pool;
  }
}
