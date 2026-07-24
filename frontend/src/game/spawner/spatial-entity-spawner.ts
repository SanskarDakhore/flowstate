export type SpatialEntityType = 'RESONANCE_NODE' | 'CORRUPTION_HAZARD';

export interface SpatialEntity {
  id: number;
  type: SpatialEntityType;
  position: { x: number; y: number; z: number };
  active: boolean;
  radius: number;
  value: number;
  collected: boolean;
}

export class SpatialEntitySpawner {
  private pool: SpatialEntity[];
  private activeEntities: SpatialEntity[] = [];
  private poolSize: number;
  private nextId: number = 0;

  constructor(poolSize: number = 100) {
    this.poolSize = poolSize;
    this.pool = new Array<SpatialEntity>(poolSize);

    // Pre-allocate full pool memory to enforce zero runtime allocations
    for (let i = 0; i < poolSize; i++) {
      this.pool[i] = {
        id: ++this.nextId,
        type: 'RESONANCE_NODE',
        position: { x: 0, y: 0, z: 0 },
        active: false,
        radius: 1.2,
        value: 1.0,
        collected: false,
      };
    }
  }

  public spawnEntity(
    type: SpatialEntityType,
    x: number,
    y: number,
    z: number,
    radius: number = 1.2,
    value: number = 1.0
  ): SpatialEntity | null {
    // Find inactive node in pool
    for (let i = 0; i < this.poolSize; i++) {
      const entity = this.pool[i];
      if (!entity.active) {
        entity.type = type;
        entity.position.x = x;
        entity.position.y = y;
        entity.position.z = z;
        entity.radius = radius;
        entity.value = value;
        entity.active = true;
        entity.collected = false;

        this.activeEntities.push(entity);
        return entity;
      }
    }
    return null; // Pool exhausted
  }

  public recycleEntity(entity: SpatialEntity): void {
    entity.active = false;
    entity.collected = false;
    const index = this.activeEntities.indexOf(entity);
    if (index !== -1) {
      this.activeEntities.splice(index, 1);
    }
  }

  public getActiveEntities(): ReadonlyArray<SpatialEntity> {
    return this.activeEntities;
  }

  public updateSpatialWindow(playerZ: number, despawnDistanceAhead: number = 200, despawnDistanceBehind: number = 30): void {
    const minZ = playerZ - despawnDistanceBehind;
    const maxZ = playerZ + despawnDistanceAhead;

    for (let i = this.activeEntities.length - 1; i >= 0; i--) {
      const entity = this.activeEntities[i];
      if (entity.position.z < minZ || entity.position.z > maxZ) {
        this.recycleEntity(entity);
      }
    }
  }

  public checkCollisions(
    playerPosition: { x: number; y: number; z: number },
    playerRadius: number = 1.0
  ): { collectedResonance: SpatialEntity[]; hitHazards: SpatialEntity[] } {
    const collectedResonance: SpatialEntity[] = [];
    const hitHazards: SpatialEntity[] = [];

    for (let i = 0; i < this.activeEntities.length; i++) {
      const entity = this.activeEntities[i];
      if (!entity.active || entity.collected) continue;

      const dx = entity.position.x - playerPosition.x;
      const dy = entity.position.y - playerPosition.y;
      const dz = entity.position.z - playerPosition.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      const minDist = playerRadius + entity.radius;

      if (distSq <= minDist * minDist) {
        entity.collected = true;
        if (entity.type === 'RESONANCE_NODE') {
          collectedResonance.push(entity);
        } else if (entity.type === 'CORRUPTION_HAZARD') {
          hitHazards.push(entity);
        }
      }
    }

    return { collectedResonance, hitHazards };
  }

  public reset(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool[i].active = false;
      this.pool[i].collected = false;
    }
    this.activeEntities.length = 0;
  }
}
