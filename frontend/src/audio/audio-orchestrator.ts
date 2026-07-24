import { PresentationSnapshot, RenderFrameContext } from '@flowstate/shared';
import { MusicSystem } from './music-system';
import { AmbientSystem } from './ambient-system';
import { SFXSystem } from './sfx-system';
import { HapticSystem } from './haptic-system';
import { AudioSubsystem } from './audio-subsystem';

export interface AudioOrchestratorDependencies {
  music: AudioSubsystem<any>;
  ambient: AudioSubsystem<any>;
  sfx: AudioSubsystem<any>;
  haptics: AudioSubsystem<any>;
}

export class AudioOrchestrator {
  private deps: AudioOrchestratorDependencies;

  constructor(deps?: Partial<AudioOrchestratorDependencies>) {
    this.deps = {
      music: deps?.music ?? new MusicSystem(),
      ambient: deps?.ambient ?? new AmbientSystem(),
      sfx: deps?.sfx ?? new SFXSystem(),
      haptics: deps?.haptics ?? new HapticSystem(),
    };
  }

  public update(snapshot: Readonly<PresentationSnapshot>, context?: Readonly<RenderFrameContext>): void {
    const audioState = snapshot.audio;

    this.deps.music.update(audioState.music, context);
    this.deps.ambient.update(audioState.ambient, context);
    this.deps.sfx.update(audioState.sfx, context);
    this.deps.haptics.update(audioState.haptics, context);
  }

  public getDependencies(): Readonly<AudioOrchestratorDependencies> {
    return this.deps;
  }

  public dispose(): void {
    this.deps.music.dispose?.();
    this.deps.ambient.dispose?.();
    this.deps.sfx.dispose?.();
    this.deps.haptics.dispose?.();
  }
}
