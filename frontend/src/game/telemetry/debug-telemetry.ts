export interface TelemetryHistoryRecord<T = unknown> {
  current: T;
  previous: T | null;
  timestamp: number;
}

export type TelemetryProvider<T = unknown> = () => T;

export class DebugTelemetry {
  private static providers: Map<string, TelemetryProvider> = new Map();
  private static history: Map<string, TelemetryHistoryRecord> = new Map();

  public static register<T>(category: string, provider: TelemetryProvider<T>): void {
    this.providers.set(category, provider as TelemetryProvider);
  }

  public static unregister(category: string): void {
    this.providers.delete(category);
    this.history.delete(category);
  }

  public static update(): void {
    const now = performance.now();
    for (const [category, provider] of this.providers.entries()) {
      try {
        const val = provider();
        const existing = this.history.get(category);
        if (!existing) {
          this.history.set(category, { current: val, previous: null, timestamp: now });
        } else if (JSON.stringify(existing.current) !== JSON.stringify(val)) {
          this.history.set(category, { current: val, previous: existing.current, timestamp: now });
        }
      } catch (err) {
        console.error(`[DebugTelemetry] Error capturing telemetry for category ${category}:`, err);
      }
    }
  }

  public static getSnapshot<T = unknown>(category: string): TelemetryHistoryRecord<T> | null {
    const provider = this.providers.get(category);
    if (!provider) return null;
    const now = performance.now();
    const val = provider() as T;
    const existing = this.history.get(category) as TelemetryHistoryRecord<T> | undefined;
    if (!existing) {
      const record: TelemetryHistoryRecord<T> = { current: val, previous: null, timestamp: now };
      this.history.set(category, record as TelemetryHistoryRecord);
      return record;
    }
    if (JSON.stringify(existing.current) !== JSON.stringify(val)) {
      const record: TelemetryHistoryRecord<T> = { current: val, previous: existing.current, timestamp: now };
      this.history.set(category, record as TelemetryHistoryRecord);
      return record;
    }
    return existing;
  }

  public static clear(): void {
    this.providers.clear();
    this.history.clear();
  }
}
