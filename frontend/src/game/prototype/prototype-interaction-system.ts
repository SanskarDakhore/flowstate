import { PlayerState } from '../movement/movement-types';
import { PrototypeTargetDefinition, PrototypeTargetState, createInitialTargetState } from './prototype-target';

export interface InteractionEvent {
  targetId: string;
  type: 'PASS' | 'HIT' | 'MISS';
  targetType: string;
}

export class PrototypeInteractionSystem {
  private targetDefinitions: PrototypeTargetDefinition[] = [];
  private targetStates: Map<string, PrototypeTargetState> = new Map();

  public setTargets(definitions: PrototypeTargetDefinition[]): void {
    this.targetDefinitions = [...definitions];
    this.reset();
  }

  public evaluate(playerState: PlayerState): InteractionEvent[] {
    const events: InteractionEvent[] = [];
    const playerPos = playerState.position;

    for (const target of this.targetDefinitions) {
      let state = this.targetStates.get(target.id);
      if (!state) {
        state = createInitialTargetState();
        this.targetStates.set(target.id, state);
      }

      if (state.passed || state.hit || state.missed) {
        continue;
      }

      const dx = playerPos.x - target.position.x;
      const dy = playerPos.y - target.position.y;
      const dz = playerPos.z - target.position.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      // 1. Contact collision check
      if (distSq <= target.radius * target.radius) {
        if (target.type === 'BLOCKER') {
          state.hit = true;
          events.push({ targetId: target.id, type: 'HIT', targetType: target.type });
        } else {
          state.passed = true;
          events.push({ targetId: target.id, type: 'PASS', targetType: target.type });
        }
        continue;
      }

      // 2. Miss check (player passed target along forward Z axis by > 3 units without hit)
      if (playerPos.z > target.position.z + 3.0) {
        state.missed = true;
        events.push({ targetId: target.id, type: 'MISS', targetType: target.type });
      }
    }

    return events;
  }

  public getTargetStates(): Map<string, PrototypeTargetState> {
    return this.targetStates;
  }

  public reset(): void {
    this.targetStates.clear();
    for (const def of this.targetDefinitions) {
      this.targetStates.set(def.id, createInitialTargetState());
    }
  }
}
