export interface RenderingEngine {
  readonly engineName: string;
  initialize(containerElementId: string): Promise<void> | void;
  renderFrame(deltaTimeSeconds: number): void;
}

export const RENDERING_FRAMEWORK_STATUS = 'TBD';
