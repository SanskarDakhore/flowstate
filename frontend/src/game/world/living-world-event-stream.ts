import {
  LivingWorldEvent,
  LivingWorldEventType,
  LivingWorldEventPriority,
} from './living-world-types';

export type LivingWorldEventListener = (event: LivingWorldEvent) => void;

export class LivingWorldEventStream {
  private listeners: Set<LivingWorldEventListener> = new Set();
  private eventIndexCounter: number = 0;

  public subscribe(listener: LivingWorldEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public unsubscribe(listener: LivingWorldEventListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Emits a discrete one-shot LivingWorldEvent to all current subscribers.
   * Per Invariant F, events are ephemeral and not retained in historical log memory.
   */
  public emit(
    type: LivingWorldEventType,
    priority: LivingWorldEventPriority,
    timestamp: number,
    payload?: Record<string, unknown>
  ): LivingWorldEvent {
    this.eventIndexCounter++;

    const event: LivingWorldEvent = Object.freeze({
      eventIndex: this.eventIndexCounter,
      type,
      priority,
      timestamp,
      payload: payload ? Object.freeze({ ...payload }) : undefined,
    });

    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[LivingWorldEventStream] Listener execution error:', err);
      }
    }

    return event;
  }

  public getCurrentSequence(): number {
    return this.eventIndexCounter;
  }

  public clearListeners(): void {
    this.listeners.clear();
  }
}
