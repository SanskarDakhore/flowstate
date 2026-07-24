import { PipelineTelemetry } from '../../src/game/telemetry/pipeline-telemetry';
import { PipelineReplayer } from '../../src/game/telemetry/pipeline-replayer';
import {
  createDefaultSignalSnapshot,
  createDefaultWorldStateSnapshot,
  createDefaultPresentationSnapshot,
} from '@flowstate/shared';

describe('Pipeline Telemetry & Deterministic Replayer', () => {
  let telemetry: PipelineTelemetry;
  let replayer: PipelineReplayer;

  beforeEach(() => {
    telemetry = new PipelineTelemetry();
    replayer = new PipelineReplayer();
  });

  it('should record frame timing diagnostics and evaluate budget compliance', () => {
    const diagWithin = telemetry.recordFrame(0.2, 0.3, 0.2, 1.5, 6, 0, 0.016);
    expect(diagWithin.isWithinBudget).toBe(true);
    expect(diagWithin.totalCpuTimeMs).toBeCloseTo(2.2);

    const diagOver = telemetry.recordFrame(0.8, 0.3, 0.2, 1.5, 6, 0, 0.016);
    expect(diagOver.isWithinBudget).toBe(false); // Gameplay exceeded 0.5ms SLA
  });

  it('should maintain rolling ring buffer capped at 120 frame records', () => {
    for (let i = 0; i < 150; i++) {
      telemetry.recordFrame(0.1, 0.1, 0.1, 1.0, 6, 0, 0.016);
    }
    const history = telemetry.getHistory();
    expect(history.length).toBe(120);
    expect(history[0].frameIndex).toBe(31);
    expect(history[history.length - 1].frameIndex).toBe(150);
  });

  it('should record and replay snapshot trajectories deterministically', () => {
    replayer.startRecording();
    expect(replayer.getPlaybackState()).toBe('recording');

    const gameplay = createDefaultSignalSnapshot();
    const world = createDefaultWorldStateSnapshot();
    const presentation = createDefaultPresentationSnapshot();
    const diag = telemetry.recordFrame(0.2, 0.2, 0.2, 1.0, 6, 0, 0.016);

    replayer.recordFrame(gameplay, world, presentation, diag);
    expect(replayer.getFrameCount()).toBe(1);

    replayer.stopRecording();
    replayer.play();
    expect(replayer.getPlaybackState()).toBe('playing');

    const replayedFrame = replayer.stepFrame();
    expect(replayedFrame?.frameIndex).toBe(1);
    expect(replayedFrame?.gameplay.flowRatio).toBe(gameplay.flowRatio);
  });
});
