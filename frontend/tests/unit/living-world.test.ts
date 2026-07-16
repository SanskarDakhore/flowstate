import { LivingWorldController } from '../../src/game/world/living-world-controller';
import {
  BiomePhase,
  LivingWorldEventType,
  LivingWorldEventPriority,
  DEFAULT_LIVING_WORLD_CONFIG,
  getBiomePhaseOrder,
} from '../../src/game/world/living-world-types';
import { PresentationPipeline } from '../../src/game/presentation/presentation-pipeline';
import { MovementState } from '../../src/game/movement/movement-types';

describe('FLOWSTATE v0.3.0 Living World Foundation Simulation Invariants', () => {
  let controller: LivingWorldController;

  beforeEach(() => {
    controller = new LivingWorldController(DEFAULT_LIVING_WORLD_CONFIG);
  });

  const createMockMovementState = (overrides: Partial<MovementState> = {}): MovementState => ({
    isGrounded: true,
    isAirborne: false,
    isCoyoteWindowActive: false,
    isJumpBuffered: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    currentJumpCount: 0,
    jumpState: 0,
    jumpId: 0,
    landingImpact: 0,
    verticalVelocity: 0,
    airborneHeight: 0,
    currentHorizontalVelocityVector: { x: 15, z: 0 },
    momentumMagnitude: 15.0,
    momentumScore: 100,
    momentumQuality: 'EXCELLENT',
    flowEfficiency: 1.0,
    activeGravityPhase: 0,
    activeEnvironmentProfileId: 'LIVING_VALLEY',
    activeMovementProfileId: 'default-responsive',
    currentAirControl: 1.0,
    appliedGravity: -25,
    targetSpeed: 20.0,
    desiredVelocity: { x: 15, z: 0 },
    velocityError: 0,
    directionDelta: 0,
    ...overrides,
  });

  it('Invariant A & D & G: should initialize frozen snapshot with correct version and derived outputs', () => {
    const snapshot = controller.getLatestSnapshot();

    expect(snapshot.version).toEqual(1);
    expect(snapshot.flowState).toEqual(0.0);
    expect(snapshot.worldResonance).toEqual(0.0);
    expect(snapshot.biomeHealthPercentage).toEqual(0.0);
    expect(snapshot.biomeInfluence).toEqual(0.0);
    expect(snapshot.biomePhase).toEqual(BiomePhase.DORMANT);
    expect(Object.isFrozen(snapshot)).toBe(true);
  });

  it('Invariant A: should accumulate Flow State during continuous flow movement and decay when idle', () => {
    const activeMovement = createMockMovementState({
      momentumMagnitude: 18.0,
      flowEfficiency: 1.0,
    });

    // 1. Update with active movement for 10 ticks
    for (let i = 0; i < 10; i++) {
      controller.update(activeMovement, { x: i * 0.3, y: 0, z: 0 }, 0.016);
    }

    const midSnapshot = controller.getLatestSnapshot();
    expect(midSnapshot.flowState).toBeGreaterThan(0.0);
    expect(midSnapshot.flowState).toBeLessThanOrEqual(100.0);

    // 2. Idle movement (speed 0)
    const idleMovement = createMockMovementState({
      momentumMagnitude: 0.0,
      flowEfficiency: 0.0,
    });

    for (let i = 0; i < 30; i++) {
      controller.update(idleMovement, { x: 3.0, y: 0, z: 0 }, 0.016);
    }

    const idleSnapshot = controller.getLatestSnapshot();
    expect(idleSnapshot.flowState).toBeLessThan(midSnapshot.flowState);
  });

  it('Invariant B & C: should guarantee World Resonance is strictly monotonic (never decreases)', () => {
    const activeMovement = createMockMovementState({
      momentumMagnitude: 20.0,
      flowEfficiency: 1.0,
    });

    // Build up resonance over time
    for (let i = 0; i < 60; i++) {
      controller.update(activeMovement, { x: i * 0.5, y: 0, z: 0 }, 0.016);
    }

    const peakResonance = controller.getLatestSnapshot().worldResonance;
    expect(peakResonance).toBeGreaterThan(0.0);

    // Completely stop and simulate decay in Flow State
    const deadStop = createMockMovementState({
      momentumMagnitude: 0.0,
      flowEfficiency: 0.0,
    });

    for (let i = 0; i < 300; i++) {
      controller.update(deadStop, { x: 30, y: 0, z: 0 }, 0.016);
    }

    const postStopSnapshot = controller.getLatestSnapshot();
    expect(postStopSnapshot.flowState).toEqual(0.0); // Flow state decayed
    expect(postStopSnapshot.worldResonance).toBeGreaterThanOrEqual(peakResonance); // World Resonance preserved (Monotonic)
  });

  it('Invariant E: should evaluate BiomePhase and order rank helpers correctly', () => {
    expect(getBiomePhaseOrder(BiomePhase.DORMANT)).toBe(0);
    expect(getBiomePhaseOrder(BiomePhase.AWAKENING)).toBe(1);
    expect(getBiomePhaseOrder(BiomePhase.LIVING)).toBe(2);
    expect(getBiomePhaseOrder(BiomePhase.BLOOMING)).toBe(3);
    expect(getBiomePhaseOrder(BiomePhase.RADIANT)).toBe(4);

    // Initial phase should be DORMANT
    expect(controller.getLatestSnapshot().biomePhase).toBe(BiomePhase.DORMANT);
  });

  it('Invariant F: should dispatch prioritized events with incrementing eventIndex sequence', () => {
    const receivedEvents: Array<{ index: number; type: LivingWorldEventType; priority: LivingWorldEventPriority }> = [];

    controller.getEventStream().subscribe((event) => {
      receivedEvents.push({
        index: event.eventIndex,
        type: event.type,
        priority: event.priority,
      });
    });

    const highFlowMovement = createMockMovementState({
      momentumMagnitude: 20.0,
      flowEfficiency: 1.0,
    });

    // Update simulation enough to cross threshold (Flow State > 75%)
    for (let i = 0; i < 200; i++) {
      controller.update(highFlowMovement, { x: i * 0.5, y: 0, z: 0 }, 0.016);
    }

    expect(receivedEvents.length).toBeGreaterThan(0);
    // Verify sequence indices increase strictly by 1
    for (let i = 1; i < receivedEvents.length; i++) {
      expect(receivedEvents[i].index).toEqual(receivedEvents[i - 1].index + 1);
    }
  });

  it('Invariant G: should guarantee presentation pipeline integration consumes world state without mutation passbacks', () => {
    const pipeline = new PresentationPipeline(null, undefined, controller);

    const movement = createMockMovementState({
      momentumMagnitude: 15.0,
      flowEfficiency: 1.0,
    });

    const presentationSnapshot = pipeline.update(movement, { x: 1, y: 0, z: 2 }, 0.016);

    expect(presentationSnapshot.world.reservedWorldState).not.toBeNull();
    const worldState = presentationSnapshot.world.reservedWorldState!;

    expect(worldState.version).toEqual(1);
    expect(worldState.flowState).toBeGreaterThan(0);
    expect(Object.isFrozen(worldState)).toBe(true);

    pipeline.dispose();
  });

  it('Deterministic Execution: should yield identical snapshot outputs given identical movement inputs', () => {
    const runA = new LivingWorldController(DEFAULT_LIVING_WORLD_CONFIG);
    const runB = new LivingWorldController(DEFAULT_LIVING_WORLD_CONFIG);

    const movement = createMockMovementState({
      momentumMagnitude: 15.0,
      flowEfficiency: 1.0,
    });

    for (let i = 0; i < 50; i++) {
      runA.update(movement, { x: i * 0.2, y: 0, z: 0 }, 0.016);
      runB.update(movement, { x: i * 0.2, y: 0, z: 0 }, 0.016);
    }

    const snapshotA = runA.getLatestSnapshot();
    const snapshotB = runB.getLatestSnapshot();

    expect(snapshotA.flowState).toEqual(snapshotB.flowState);
    expect(snapshotA.worldResonance).toEqual(snapshotB.worldResonance);
    expect(snapshotA.biomeInfluence).toEqual(snapshotB.biomeInfluence);
    expect(snapshotA.biomePhase).toEqual(snapshotB.biomePhase);
    expect(snapshotA.elapsedSimulationTime).toEqual(snapshotB.elapsedSimulationTime);
  });
});
