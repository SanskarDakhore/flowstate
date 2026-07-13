import { GameplayEventPayloads, GameEventName } from '@flowstate/shared';

type EventCallback<K extends GameEventName> = (payload: GameplayEventPayloads[K]) => void;

export class GameEventBus {
  private listeners = new Map<string, Set<EventCallback<any>>>();

  public on<K extends GameEventName>(event: K, callback: EventCallback<K>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off<K extends GameEventName>(event: K, callback: EventCallback<K>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  public emit<K extends GameEventName>(event: K, payload: GameplayEventPayloads[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[GameEventBus] Error in listener for event '${event}':`, err);
        }
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
