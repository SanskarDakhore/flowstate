import { Vector3State, JumpState } from './movement-types';

export type MovementEventType =
  | 'JumpBuffered'
  | 'JumpConsumed'
  | 'JumpStarted'
  | 'JumpReleased'
  | 'CoyoteJump'
  | 'GroundLeft'
  | 'GroundEntered'
  | 'Landed';

export interface MovementEventPayload {
  jumpId: number;
  position: Vector3State;
  velocity: Vector3State;
  timestamp: number;
  jumpState: JumpState;
  extraData?: Record<string, unknown>;
}

export type MovementEventListener = (payload: MovementEventPayload) => void;
export type GlobalMovementEventListener = (eventType: MovementEventType, payload: MovementEventPayload) => void;

export class MovementEventDispatcher {
  private listeners: Map<MovementEventType, Set<MovementEventListener>> = new Map();
  private globalListeners: Set<GlobalMovementEventListener> = new Set();

  public subscribe(eventType: MovementEventType, listener: MovementEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const set = this.listeners.get(eventType)!;
    set.add(listener);

    return () => {
      set.delete(listener);
    };
  }

  public onAll(listener: GlobalMovementEventListener): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  public emit(eventType: MovementEventType, payload: MovementEventPayload): void {
    for (const globalListener of this.globalListeners) {
      try {
        globalListener(eventType, payload);
      } catch (err) {
        console.error(`[MovementEventDispatcher] Error handling global listener for ${eventType}:`, err);
      }
    }

    const set = this.listeners.get(eventType);
    if (set) {
      for (const listener of set) {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[MovementEventDispatcher] Error handling event ${eventType}:`, err);
        }
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
    this.globalListeners.clear();
  }
}
