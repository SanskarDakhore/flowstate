import { MovementEventDispatcher, MovementEventPayload, MovementEventType } from '../movement/movement-events';
import { MovementState, Vector3State } from '../movement/movement-types';
import { CameraIntent } from './presentation-profile';

export type SnapshotListener = (state: MovementState, position: Vector3State, intent: CameraIntent) => void;

export class PresentationEventBus {
  private dispatcher: MovementEventDispatcher | null = null;
  private unsubscribeMap: Array<() => void> = [];
  private snapshotListeners: Set<SnapshotListener> = new Set();
  private eventCount: number = 0;

  constructor(dispatcher: MovementEventDispatcher | null = null) {
    if (dispatcher) {
      this.attachMovementDispatcher(dispatcher);
    }
  }

  public attachMovementDispatcher(dispatcher: MovementEventDispatcher): void {
    this.detachMovementDispatcher();
    this.dispatcher = dispatcher;
  }

  public detachMovementDispatcher(): void {
    this.unsubscribeMap.forEach((unsub) => unsub());
    this.unsubscribeMap = [];
    this.dispatcher = null;
  }

  public subscribeEvent(
    type: MovementEventType,
    listener: (payload: MovementEventPayload) => void
  ): () => void {
    if (!this.dispatcher) {
      return () => {};
    }
    const unsub = this.dispatcher.subscribe(type, (payload) => {
      this.eventCount++;
      listener(payload);
    });
    this.unsubscribeMap.push(unsub);
    return unsub;
  }

  public subscribeSnapshot(listener: SnapshotListener): () => void {
    this.snapshotListeners.add(listener);
    return () => {
      this.snapshotListeners.delete(listener);
    };
  }

  public broadcastSnapshot(state: MovementState, position: Vector3State, intent: CameraIntent): void {
    this.snapshotListeners.forEach((listener) => {
      try {
        listener(state, position, intent);
      } catch (e) {
        console.warn('[PresentationEventBus] Error in snapshot listener:', e);
      }
    });
  }

  public getEventCount(): number {
    return this.eventCount;
  }

  public reset(): void {
    this.eventCount = 0;
    this.snapshotListeners.clear();
    this.detachMovementDispatcher();
  }
}
