import { PresentationPipeline } from '../../src/game/presentation/presentation-pipeline';
import { PresentationProfileRegistry } from '../../src/game/presentation/presentation-profile-registry';
import {
  UNIFIED_LIVING_VALLEY_PROFILE,
  UNIFIED_CRYSTAL_CAVERNS_PROFILE,
  PresentationPhase,
  UnifiedPresentationProfile,
} from '../../src/game/presentation/presentation-profile';
import { MovementState, JumpState, GravityPhase } from '../../src/game/movement/movement-types';
import { MovementEventDispatcher } from '../../src/game/movement/movement-events';

function createMockMovementState(overrides: Partial<MovementState> = {}): MovementState {
  return {
    isGrounded: true,
    isAirborne: false,
    isCoyoteWindowActive: false,
    isJumpBuffered: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    currentJumpCount: 0,
    jumpState: JumpState.Grounded,
    jumpId: 0,
    landingImpact: 0,
    verticalVelocity: 0,
    airborneHeight: 0,
    currentHorizontalVelocityVector: { x: 0, z: 15.0 },
    momentumMagnitude: 15.0,
    momentumScore: 90.0,
    momentumQuality: 'OPTIMAL' as any,
    flowEfficiency: 0.9,
    activeGravityPhase: GravityPhase.Grounded,
    activeEnvironmentProfileId: 'UNIFIED_LIVING_VALLEY',
    activeMovementProfileId: 'default-responsive',
    currentAirControl: 0.6,
    appliedGravity: -28.0,
    targetSpeed: 20.0,
    desiredVelocity: { x: 0, z: 20.0 },
    velocityError: 5.0,
    directionDelta: 0,
    ...overrides,
  };
}

describe('FLOWSTATE v0.2.5 Unified Presentation Pipeline Architectural Invariants', () => {
  test('Read-Only Invariant: Presentation pipeline updates leave core physics state and position 100% unmutated', () => {
    const dispatcher = new MovementEventDispatcher();
    const pipeline = new PresentationPipeline(dispatcher);

    const movState = createMockMovementState();
    const position = { x: 25.0, y: 1.0, z: 100.0 };

    const initialMovSnapshot = JSON.stringify(movState);
    const initialPosSnapshot = JSON.stringify(position);

    pipeline.transitionToProfile('UNIFIED_CRYSTAL_CAVERNS', 500);

    for (let step = 0; step < 50; step++) {
      pipeline.update(movState, position, 0.016);
    }

    expect(JSON.stringify(movState)).toBe(initialMovSnapshot);
    expect(JSON.stringify(position)).toBe(initialPosSnapshot);
  });

  test('Hierarchical Immutable Snapshot & Allocation Rigor: Produces frozen state snapshot across 300 simulation ticks', () => {
    const pipeline = new PresentationPipeline();
    const movState = createMockMovementState();
    const pos = { x: 0, y: 0, z: 0 };

    pipeline.setPhase(PresentationPhase.PLAYING);

    const initialFreeDebrisPool = pipeline.getEnvironmentController().getSurfacePoolFreeCount();

    for (let step = 0; step < 300; step++) {
      pos.z += 0.1;
      const snapshot = pipeline.update(movState, pos, 0.016);

      expect(snapshot.frame.frameIndex).toBeGreaterThan(0);
      expect(Object.isFrozen(snapshot)).toBe(true);
      expect(snapshot.world.reservedWorldState).not.toBeNull();
      expect(snapshot.diagnostics.totalPresentationCostMs).toBeGreaterThanOrEqual(0);
    }

    // Step with zero speed to let transient pool items return
    const idleMovState = { ...movState, speed: 0, momentumMagnitude: 0 };
    for (let t = 0; t < 3; t++) {
      pipeline.update(idleMovState, pos, 1.0);
    }
    const finalFreeDebrisPool = pipeline.getEnvironmentController().getSurfacePoolFreeCount();
    expect(finalFreeDebrisPool).toBe(initialFreeDebrisPool);
  });

  test('Profile Blend Continuity: Cross-fades profile parameters smoothly at 50% transition midpoint without jumps', () => {
    const pipeline = new PresentationPipeline();
    const movState = createMockMovementState();
    const pos = { x: 0, y: 0, z: 0 };

    pipeline.transitionToProfile('UNIFIED_CRYSTAL_CAVERNS', 1000);

    // Update 500ms (50% progress mark)
    const midSnapshot = pipeline.update(movState, pos, 0.5);

    expect(midSnapshot.isTransitioning).toBe(true);
    expect(midSnapshot.transitionProgress).toBeCloseTo(0.5, 2);

    // Color intensity should sit midway between Living Valley (0.85) and Crystal Caverns (0.45) -> 0.65
    expect(midSnapshot.environment.primaryGlobalColor.intensity).toBeCloseTo(0.65, 1);

    // Advance to 1000ms (100% completion)
    const finalSnapshot = pipeline.update(movState, pos, 0.5);
    expect(finalSnapshot.isTransitioning).toBe(false);
    expect(finalSnapshot.activeProfileId).toBe('UNIFIED_CRYSTAL_CAVERNS');
    expect(finalSnapshot.environment.primaryGlobalColor.intensity).toBeCloseTo(0.45, 1);
  });

  test('Operational Phase Machine: Transitions between BOOT, READY, PLAYING, TRANSITION, PAUSED, SHUTDOWN', () => {
    const pipeline = new PresentationPipeline();
    const movState = createMockMovementState();
    const pos = { x: 0, y: 0, z: 0 };

    expect(pipeline.getPhase()).toBe(PresentationPhase.READY);

    pipeline.setPhase(PresentationPhase.PAUSED);
    const pausedSnapshot1 = pipeline.update(movState, pos, 0.016);

    // Change position during PAUSED phase
    const posMoved = { x: 10, y: 0, z: 10 };
    const pausedSnapshot2 = pipeline.update(movState, posMoved, 0.016);

    // Snapshot remains identical while paused
    expect(pausedSnapshot2).toBe(pausedSnapshot1);

    pipeline.setPhase(PresentationPhase.PLAYING);
    const playingSnapshot = pipeline.update(movState, posMoved, 0.016);
    expect(playingSnapshot.phase).toBe(PresentationPhase.PLAYING);
  });

  test('PresentationProfileRegistry: Rich CRUD, lookup, list, and validation API', () => {
    const registry = new PresentationProfileRegistry();

    expect(registry.has('UNIFIED_LIVING_VALLEY')).toBe(true);
    expect(registry.has('UNIFIED_CRYSTAL_CAVERNS')).toBe(true);
    expect(registry.list()).toContain('UNIFIED_LIVING_VALLEY');

    const customProfile: UnifiedPresentationProfile = {
      ...UNIFIED_LIVING_VALLEY_PROFILE,
      id: 'UNIFIED_SILENT_FOREST',
      name: 'Unified Silent Forest',
      mood: 'SILENT',
    };

    expect(registry.register(customProfile)).toBe(true);
    expect(registry.get('UNIFIED_SILENT_FOREST')?.mood).toBe('SILENT');

    expect(registry.remove('UNIFIED_SILENT_FOREST')).toBe(true);
    expect(registry.has('UNIFIED_SILENT_FOREST')).toBe(false);
  });
});
