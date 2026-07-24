import { GameplaySignalSnapshot } from '@flowstate/shared';

export type SignalListener = (snapshot: Readonly<GameplaySignalSnapshot>) => void;

export class GameplaySignalEmitter {
  private listeners: SignalListener[] = [];
  private lastSnapshot: GameplaySignalSnapshot | null = null;

  public subscribe(listener: SignalListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public emit(snapshot: GameplaySignalSnapshot): void {
    this.lastSnapshot = snapshot;
    const count = this.listeners.length;
    for (let i = 0; i < count; i++) {
      this.listeners[i](snapshot);
    }
  }

  public getLastSnapshot(): Readonly<GameplaySignalSnapshot> | null {
    return this.lastSnapshot;
  }

  public clear(): void {
    this.listeners = [];
    this.lastSnapshot = null;
  }
}
