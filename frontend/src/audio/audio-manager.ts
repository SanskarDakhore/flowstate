import { Service } from '../core/architecture/service';

export class AudioManager implements Service {
  public readonly serviceName = 'AudioManager';
  private isMuted = false;

  public initialize(): void {
    console.log('[AudioManager] Audio service initialized.');
  }

  public playSfx(sfxId: string): void {
    if (this.isMuted) return;
    console.log(`[AudioManager] Playing SFX: ${sfxId}`);
  }

  public setAdaptiveMusicLayer(layerIndex: number): void {
    console.log(`[AudioManager] Setting adaptive music layer: ${layerIndex}`);
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
  }
}
