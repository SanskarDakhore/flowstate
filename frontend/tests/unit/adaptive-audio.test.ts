import { AudioOrchestrator } from '../../src/audio/audio-orchestrator';
import { MusicSystem } from '../../src/audio/music-system';
import { AmbientSystem } from '../../src/audio/ambient-system';
import { SFXSystem } from '../../src/audio/sfx-system';
import { HapticSystem } from '../../src/audio/haptic-system';
import { PresentationResolver } from '../../src/game/presentation/presentation-resolver';
import { WorldStateEnum, createDefaultWorldStateSnapshot } from '@flowstate/shared';

describe('Adaptive Audio & Haptics Pipeline', () => {
  let music: MusicSystem;
  let ambient: AmbientSystem;
  let sfx: SFXSystem;
  let haptics: HapticSystem;
  let orchestrator: AudioOrchestrator;
  let resolver: PresentationResolver;

  beforeEach(() => {
    music = new MusicSystem();
    ambient = new AmbientSystem();
    sfx = new SFXSystem();
    haptics = new HapticSystem();

    orchestrator = new AudioOrchestrator({
      music,
      ambient,
      sfx,
      haptics,
    });

    resolver = new PresentationResolver();
  });

  it('should delegate substate updates to audio subsystems on initial frame', () => {
    const worldState = createDefaultWorldStateSnapshot();
    const presentation = resolver.resolve(worldState);

    orchestrator.update(presentation);

    expect(music.getUpdateCount()).toBe(1);
    expect(ambient.getUpdateCount()).toBe(1);
    expect(sfx.getUpdateCount()).toBe(1);
    expect(haptics.getTriggerCount()).toBe(1);
  });

  it('should skip audio parameter updates when snapshot is unchanged (Change Detection)', () => {
    const worldState = createDefaultWorldStateSnapshot();
    const presentation = resolver.resolve(worldState);

    orchestrator.update(presentation);
    expect(music.getUpdateCount()).toBe(1);

    // Second update with identical presentation snapshot
    orchestrator.update(presentation);
    expect(music.getUpdateCount()).toBe(1);
    expect(ambient.getUpdateCount()).toBe(1);
  });

  it('should trigger haptic feedback and increase music intensity as world energy grows', () => {
    const worldStateThriving = {
      ...createDefaultWorldStateSnapshot(),
      currentState: WorldStateEnum.THRIVING,
      energyBuffer: 85.0,
    };
    const presentation = resolver.resolve(worldStateThriving);

    orchestrator.update(presentation);

    const musicState = music.getCachedState();
    const hapticState = haptics.getCachedState();

    expect(musicState?.intensity).toBeGreaterThan(0.5);
    expect(musicState?.filterCutoff).toBeGreaterThan(10000);
    expect(hapticState?.intensity).toBeGreaterThan(0.5);
    expect(hapticState?.style).toBe('heavy');
  });
});
