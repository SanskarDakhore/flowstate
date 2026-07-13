export interface PlayerView {
  setPosition(x: number, y: number, z: number): void;
  getPosition(): { x: number; y: number; z: number };
  dispose(): void;
}
