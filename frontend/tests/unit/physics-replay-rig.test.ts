import { PhysicsReplayRig } from '../../src/game/simulation/physics-replay-rig';
import { MovementIntent } from '../../src/game/movement/movement-intent';
import { SimulationChecksum } from '@flowstate/shared';

describe('Phase 18 — Determinism Verification & Physics Replay Rig', () => {
  let rig: PhysicsReplayRig;

  const mockIntent: MovementIntent = {
    horizontal: 1.0,
    vertical: 0.0,
    action: false,
    jumpPressed: false,
    actionHeld: false,
  };

  beforeEach(() => {
    rig = new PhysicsReplayRig();
  });

  describe('Frame Input & Checksum Logging', () => {
    it('should record inputs and generate deterministic position checksum hashes', () => {
      rig.recordFrame(0, 0.016, mockIntent);
      const checksum = rig.recordChecksum(0, { x: 10.5, y: 2.0, z: 100.0 }, { x: 0, y: 0, z: 25.0 });

      expect(checksum.positionHash).toBeGreaterThan(0);
      expect(rig.getRecordedInputs().length).toBe(1);
    });
  });

  describe('Replay Validation & Divergence Detection', () => {
    it('should validate two identical simulation checksum sequences as 100% deterministic', () => {
      for (let f = 0; f < 100; f++) {
        rig.recordChecksum(f, { x: f * 0.1, y: 0, z: f * 2.0 }, { x: 0, y: 0, z: 20 });
      }

      const copyChecksums = [...rig.getRecordedChecksums()];
      const result = rig.compareReplayRun(copyChecksums);

      expect(result.isDeterministic).toBe(true);
      expect(result.checksumsMatch).toBe(true);
    });

    it('should detect divergence index when secondary run position differs', () => {
      for (let f = 0; f < 10; f++) {
        rig.recordChecksum(f, { x: f * 0.1, y: 0, z: f * 2.0 }, { x: 0, y: 0, z: 20 });
      }

      const divergent: SimulationChecksum[] = JSON.parse(JSON.stringify(rig.getRecordedChecksums()));
      divergent[5] = { ...divergent[5], positionHash: 999999 };

      const result = rig.compareReplayRun(divergent);

      expect(result.isDeterministic).toBe(false);
      expect(result.divergentFrameIndex).toBe(5);
    });
  });
});
