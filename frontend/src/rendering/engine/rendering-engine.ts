export interface RenderingEngine {
  readonly engineName: string;
  initialize(surface: HTMLCanvasElement): Promise<void> | void;
  start(): void;
  stop(): void;
  resize(): void;
  dispose(): void;
}
