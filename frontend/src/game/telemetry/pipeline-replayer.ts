import { GameplaySignalSnapshot, WorldStateSnapshot, PresentationSnapshot } from '@flowstate/shared';
import { PipelineFrameDiagnostic } from './pipeline-telemetry';

export interface RecordedPipelineFrame {
  readonly frameIndex: number;
  readonly gameplay: GameplaySignalSnapshot;
  readonly world: WorldStateSnapshot;
  readonly presentation: PresentationSnapshot;
  readonly diagnostic: PipelineFrameDiagnostic;
}

export type PlaybackState = 'idle' | 'recording' | 'playing' | 'paused';

export class PipelineReplayer {
  private frameLog: RecordedPipelineFrame[] = [];
  private playbackState: PlaybackState = 'idle';
  private playbackIndex: number = 0;

  public startRecording(): void {
    this.frameLog = [];
    this.playbackState = 'recording';
    this.playbackIndex = 0;
  }

  public stopRecording(): void {
    if (this.playbackState === 'recording') {
      this.playbackState = 'idle';
    }
  }

  public recordFrame(
    gameplay: GameplaySignalSnapshot,
    world: WorldStateSnapshot,
    presentation: PresentationSnapshot,
    diagnostic: PipelineFrameDiagnostic
  ): void {
    if (this.playbackState !== 'recording') return;

    this.frameLog.push({
      frameIndex: diagnostic.frameIndex,
      gameplay,
      world,
      presentation,
      diagnostic,
    });
  }

  public play(): void {
    if (this.frameLog.length > 0) {
      this.playbackState = 'playing';
    }
  }

  public pause(): void {
    if (this.playbackState === 'playing') {
      this.playbackState = 'paused';
    }
  }

  public stepFrame(): RecordedPipelineFrame | null {
    if (this.frameLog.length === 0) return null;
    if (this.playbackIndex >= this.frameLog.length) {
      this.playbackIndex = 0;
    }
    const frame = this.frameLog[this.playbackIndex];
    this.playbackIndex = (this.playbackIndex + 1) % this.frameLog.length;
    return frame;
  }

  public jumpToFrame(index: number): RecordedPipelineFrame | null {
    if (index < 0 || index >= this.frameLog.length) return null;
    this.playbackIndex = index;
    return this.frameLog[this.playbackIndex];
  }

  public getFrameCount(): number {
    return this.frameLog.length;
  }

  public getPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  public clearBuffer(): void {
    this.frameLog = [];
    this.playbackState = 'idle';
    this.playbackIndex = 0;
  }
}
