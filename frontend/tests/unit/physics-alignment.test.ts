import { MathFlowPath } from '../../src/game/movement/flow-path';
import { VerticalPhysics } from '../../src/game/movement/vertical-physics';
import { GuidedFlowMovement } from '../../src/game/movement/models/guided-flow-movement';
import { FreeFlowMovement } from '../../src/game/movement/models/free-flow-movement';
import { BranchingFlowMovement } from '../../src/game/movement/models/branching-flow-movement';
import { MovementController } from '../../src/game/movement/movement-controller';
import { DEFAULT_PHYSICS_CONFIG } from '../../src/game/movement/movement-config';
import { PlayerState } from '../../src/game/movement/movement-types';
import {
  isTargetPlacementValid,
  isBlockerPlacementValid,
  generateCourseTargets,
  resolveTargetTransform,
} from '../../src/game/prototype/prototype-target';
import { createEmptyIntent } from '../../src/game/movement/movement-intent';

describe('Core Movement Physics & Track Alignment v0.1.2 Unit Tests', () => {
  let path: MathFlowPath;

  beforeEach(() => {
    path = new MathFlowPath(600, 10, 2, 4, 3);
  });

  describe('1. TrackFrame Basis & Authoritative Target Transform Resolver', () => {
    it('should produce normalized, orthogonal frame vectors across path progression', () => {
      const samples = [0.0, 0.25, 0.5, 0.75, 1.0];
      for (const s of samples) {
        const frame = path.getTrackFrame(s);

        const fLen = Math.sqrt(frame.forward.x ** 2 + frame.forward.y ** 2 + frame.forward.z ** 2);
        const rLen = Math.sqrt(frame.right.x ** 2 + frame.right.y ** 2 + frame.right.z ** 2);
        const uLen = Math.sqrt(frame.up.x ** 2 + frame.up.y ** 2 + frame.up.z ** 2);

        expect(fLen).toBeCloseTo(1.0, 5);
        expect(rLen).toBeCloseTo(1.0, 5);
        expect(uLen).toBeCloseTo(1.0, 5);

        const fDotR = frame.forward.x * frame.right.x + frame.forward.y * frame.right.y + frame.forward.z * frame.right.z;
        const fDotU = frame.forward.x * frame.up.x + frame.forward.y * frame.up.y + frame.forward.z * frame.up.z;
        const rDotU = frame.right.x * frame.up.x + frame.right.y * frame.up.y + frame.right.z * frame.up.z;

        expect(Math.abs(fDotR)).toBeLessThan(1e-4);
        expect(Math.abs(fDotU)).toBeLessThan(1e-4);
        expect(Math.abs(rDotU)).toBeLessThan(1e-4);
      }
    });

    it('should resolve target transform via resolveTargetTransform matching stored lateral and elevation offsets', () => {
      const targets = generateCourseTargets(path, 30, 3.0);
      for (const target of targets) {
        const resolved = resolveTargetTransform(target, path);
        const frame = path.getTrackFrame(target.progressOnPath);

        const offsetVec = {
          x: resolved.position.x - frame.center.x,
          y: resolved.position.y - frame.center.y,
          z: resolved.position.z - frame.center.z,
        };

        const dotRight = offsetVec.x * frame.right.x + offsetVec.y * frame.right.y + offsetVec.z * frame.right.z;
        const dotUp = offsetVec.x * frame.up.x + offsetVec.y * frame.up.y + offsetVec.z * frame.up.z;

        expect(dotRight).toBeCloseTo(target.lateralOffset, 4);
        expect(dotUp).toBeCloseTo(target.elevation, 4);
      }
    });
  });

  describe('2. Grounded Clearance & Track Alignment Verification', () => {
    it('should position grounded player with exact playerRadius clearance along track up vector', () => {
      const guided = new GuidedFlowMovement(undefined, path);
      const initialPos = path.trackToWorld(0, 0, DEFAULT_PHYSICS_CONFIG.playerRadius);

      guided.initialize({
        position: initialPos,
        velocity: { x: 0, y: 0, z: 0 },
        forward: { x: 0, y: 0, z: 1 },
        speed: 12,
        airborneHeight: 0,
        verticalVelocity: 0,
        isGrounded: true,
        impactVelocity: 0,
        justLanded: false,
        jumpsUsed: 0,
        maxJumps: 2,
        jumpEventCounter: 0,
        lastJumpIndex: 0,
      });

      const intent = createEmptyIntent();
      const updatedState = guided.update({
        position: initialPos,
        velocity: { x: 0, y: 0, z: 0 },
        forward: { x: 0, y: 0, z: 1 },
        speed: 12,
        airborneHeight: 0,
        verticalVelocity: 0,
        isGrounded: true,
        impactVelocity: 0,
        justLanded: false,
        jumpsUsed: 0,
        maxJumps: 2,
        jumpEventCounter: 0,
        lastJumpIndex: 0,
      }, intent, 0.016);

      const frame = path.getTrackFrame(guided.getProgress());
      const offsetVec = {
        x: updatedState.position.x - frame.center.x,
        y: updatedState.position.y - frame.center.y,
        z: updatedState.position.z - frame.center.z,
      };

      const dotUp = offsetVec.x * frame.up.x + offsetVec.y * frame.up.y + offsetVec.z * frame.up.z;
      expect(dotUp).toBeCloseTo(DEFAULT_PHYSICS_CONFIG.playerRadius, 4);
      expect(updatedState.isGrounded).toBe(true);
    });
  });

  describe('3. Extensible Jump-Count System (Double Jump)', () => {
    let verticalPhys: VerticalPhysics;

    beforeEach(() => {
      verticalPhys = new VerticalPhysics(DEFAULT_PHYSICS_CONFIG);
    });

    it('1. Initial grounded state has jumpsUsed = 0', () => {
      const res = verticalPhys.getResult();
      expect(res.isGrounded).toBe(true);
      expect(res.jumpsUsed).toBe(0);
    });

    it('2. First jump consumes one charge: jumpsUsed = 1, velocity = jumpImpulse', () => {
      const res = verticalPhys.update(true, 0.016);
      expect(res.isGrounded).toBe(false);
      expect(res.jumpsUsed).toBe(1);
      expect(res.jumpIndex).toBe(1);
      expect(res.jumpTriggered).toBe(true);
    });

    it('3. Second jump while airborne: jumpsUsed = 2, velocity overwrites to secondaryJumpImpulse', () => {
      verticalPhys.update(true, 0.016);
      verticalPhys.update(false, 0.3);

      const res = verticalPhys.update(true, 0.016);
      expect(res.isGrounded).toBe(false);
      expect(res.jumpsUsed).toBe(2);
      expect(res.jumpIndex).toBe(2);
      expect(res.jumpTriggered).toBe(true);

      const expectedSpeed = DEFAULT_PHYSICS_CONFIG.secondaryJumpImpulse + DEFAULT_PHYSICS_CONFIG.gravity * 0.016;
      expect(res.verticalVelocity).toBeCloseTo(expectedSpeed, 3);
    });

    it('4. Third jump is rejected: jumpsUsed stays 2, velocity untouched', () => {
      verticalPhys.update(true, 0.016);
      verticalPhys.update(false, 0.1);
      verticalPhys.update(true, 0.016);
      verticalPhys.update(false, 0.1);

      const velocityBefore = verticalPhys.getResult().verticalVelocity;
      const res = verticalPhys.update(true, 0.016);

      expect(res.jumpsUsed).toBe(2);
      expect(res.jumpTriggered).toBe(false);
      expect(res.verticalVelocity).toBeLessThan(velocityBefore);
    });

    it('5. Landing resets jumpsUsed -> 0 and sets isGrounded -> true', () => {
      verticalPhys.update(true, 0.016);
      let res = verticalPhys.update(false, 0.016);

      let step = 0;
      while (!res.isGrounded && step < 200) {
        res = verticalPhys.update(false, 0.016);
        step++;
      }

      expect(res.isGrounded).toBe(true);
      expect(res.jumpsUsed).toBe(0);
      expect(res.airborneHeight).toBe(0);
    });

    it('6. Holding jump key does not auto-consume both jumps without discrete trigger', () => {
      const res1 = verticalPhys.update(true, 0.016);
      expect(res1.jumpsUsed).toBe(1);

      const res2 = verticalPhys.update(false, 0.016);
      expect(res2.jumpsUsed).toBe(1);
    });

    it('7 & 8. Second jump overwrites velocity whether rising or falling', () => {
      const physA = new VerticalPhysics(DEFAULT_PHYSICS_CONFIG);
      physA.update(true, 0.016);
      physA.update(false, 0.4);
      const resA = physA.update(true, 0.016);
      expect(resA.verticalVelocity).toBeGreaterThan(0);

      const physB = new VerticalPhysics(DEFAULT_PHYSICS_CONFIG);
      physB.update(true, 0.016);
      const resB = physB.update(true, 0.016);
      const expectedB = DEFAULT_PHYSICS_CONFIG.secondaryJumpImpulse + DEFAULT_PHYSICS_CONFIG.gravity * 0.016;
      expect(resB.verticalVelocity).toBeCloseTo(expectedB, 3);
    });

    it('9. Full double-jump sequence is deterministic under step timing', () => {
      const dt = 0.016;
      const sim1 = new VerticalPhysics(DEFAULT_PHYSICS_CONFIG);
      const sim2 = new VerticalPhysics(DEFAULT_PHYSICS_CONFIG);

      sim1.update(true, dt);
      sim2.update(true, dt);

      for (let i = 0; i < 5; i++) {
        sim1.update(false, dt);
        sim2.update(false, dt);
      }

      sim1.update(true, dt);
      sim2.update(true, dt);

      expect(sim1.getState().airborneHeight).toBe(sim2.getState().airborneHeight);
      expect(sim1.getState().verticalVelocity).toBe(sim2.getState().verticalVelocity);
    });

    it('10. All three movement models support double jump via shared physics', () => {
      const guided = new GuidedFlowMovement(undefined, path);
      const free = new FreeFlowMovement(undefined, path);
      const branching = new BranchingFlowMovement(undefined, path);

      const createDummyState = (): PlayerState => ({
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        forward: { x: 0, y: 0, z: 1 },
        speed: 10,
        airborneHeight: 0,
        verticalVelocity: 0,
        isGrounded: true,
        impactVelocity: 0,
        justLanded: false,
        jumpsUsed: 0,
        maxJumps: 2,
        jumpEventCounter: 0,
        lastJumpIndex: 0,
      });

      guided.initialize(createDummyState());
      free.initialize(createDummyState());
      branching.initialize(createDummyState());

      const intent = { horizontal: 0, vertical: 0, actionHeld: false, jumpPressed: true };
      const sGuided1 = guided.update(createDummyState(), intent, 0.016);
      const sGuided2 = guided.update(sGuided1, intent, 0.016);

      const sFree1 = free.update(createDummyState(), intent, 0.016);
      const sFree2 = free.update(sFree1, intent, 0.016);

      const sBranch1 = branching.update(createDummyState(), intent, 0.016);
      const sBranch2 = branching.update(sBranch1, intent, 0.016);

      expect(sGuided2.jumpsUsed).toBe(2);
      expect(sFree2.jumpsUsed).toBe(2);
      expect(sBranch2.jumpsUsed).toBe(2);
    });
  });

  describe('4. Target Placement & Geometry Validation Rules', () => {
    it('11. Ring center elevation resolves correctly along local track Up', () => {
      const targets = generateCourseTargets(path, 30, 3.0);
      const rings = targets.filter((t) => t.type === 'RING');

      for (const r of rings) {
        const resolved = resolveTargetTransform(r, path);
        const frame = path.getTrackFrame(r.progressOnPath);
        const elevationVec = {
          x: resolved.position.x - resolved.surfaceAnchor.x,
          y: resolved.position.y - resolved.surfaceAnchor.y,
          z: resolved.position.z - resolved.surfaceAnchor.z,
        };
        const dotUp = elevationVec.x * frame.up.x + elevationVec.y * frame.up.y + elevationVec.z * frame.up.z;
        expect(dotUp).toBeCloseTo(r.elevation, 4);
      }
    });

    it('12. Blocker seating resolves correctly relative to track surface', () => {
      const targets = generateCourseTargets(path, 30, 3.0);
      const blockers = targets.filter((t) => t.type === 'BLOCKER');

      for (const b of blockers) {
        expect(b.elevation).toBe(b.radius);
        const resolved = resolveTargetTransform(b, path);
        const distToSurface = Math.sqrt(
          (resolved.position.x - resolved.surfaceAnchor.x) ** 2 +
          (resolved.position.y - resolved.surfaceAnchor.y) ** 2 +
          (resolved.position.z - resolved.surfaceAnchor.z) ** 2
        );
        expect(distToSurface).toBeCloseTo(b.radius, 4);
      }
    });

    it('15. Blocker full geometry stays inside usable track bounds', () => {
      const targets = generateCourseTargets(path, 30, 3.0);
      const blockers = targets.filter((t) => t.type === 'BLOCKER');

      for (const b of blockers) {
        expect(isBlockerPlacementValid(b.lateralOffset, b.radius, 3.0)).toBe(true);
      }
    });

    it('16. Model switch and reset resets jump event counters cleanly without replaying stale VFX', () => {
      const controller = new MovementController('guided-flow');
      controller.update({ jumpPressed: true }, 0.016);
      controller.update({ jumpPressed: true }, 0.016);

      expect(controller.getPlayerState().jumpEventCounter).toBe(2);

      controller.switchModel('free-flow');
      expect(controller.getPlayerState().jumpEventCounter).toBe(0);
      expect(controller.getPlayerState().lastJumpIndex).toBe(0);
    });
  });
});
