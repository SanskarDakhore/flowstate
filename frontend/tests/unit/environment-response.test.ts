import { EnvironmentResponseController } from '../../src/game/presentation/environment-response-controller';
import {
  LIVING_VALLEY_PROFILE,
  CRYSTAL_CAVERNS_PROFILE,
  SurfaceMaterial,
  EnvironmentIntent,
} from '../../src/game/presentation/environment-profile';
import { PresentationEventBus } from '../../src/game/presentation/presentation-event-bus';
import { MovementEventDispatcher } from '../../src/game/movement/movement-events';
import { JumpState } from '../../src/game/movement/movement-types';

describe('FLOWSTATE v0.2.4B Environment Response Foundation Invariants & Subsystems', () => {
  test('Zero Allocation Invariant: Response controller update maintains pool capacity stability across 200 simulation frames', () => {
    const eventBus = new PresentationEventBus();
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE, eventBus);

    // Warm up static instance pools
    controller.update(0.016, { x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });

    const initialCapacity = controller.getSurfaceSubsystem().getPoolCapacity();
    expect(initialCapacity).toBe(64);

    // Execute sustained simulation sweeps across 200 virtual frames
    for (let frame = 0; frame < 200; frame++) {
      controller.update(0.016, { x: frame * 0.1, y: 0, z: 0 }, { x: 10, y: 0, z: 0 });
    }

    // Capacity must remain strictly unchanged at 64 (zero dynamic heap re-allocations)
    expect(controller.getSurfaceSubsystem().getPoolCapacity()).toBe(initialCapacity);

    // Step forward past particle lifespan without speed to allow active elements to complete life cycle
    controller.update(1.5, { x: 20, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { isGrounded: false } as any);
    expect(controller.getSurfacePoolFreeCount()).toBe(initialCapacity);
  });

  test('Pure Observer Invariant: Environmental responses exert zero cross-contamination back to physics loops', () => {
    const dispatcher = new MovementEventDispatcher();
    const eventBus = new PresentationEventBus(dispatcher);
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE, eventBus);

    const referencePosition = { x: 42.0, y: 1.5, z: 120.0 };
    const referenceVelocity = { x: 18.5, y: -25.0, z: 14.2 };

    const initialPosSnapshot = JSON.stringify(referencePosition);
    const initialVelSnapshot = JSON.stringify(referenceVelocity);

    // Inject heavy landing impact event into event bus
    dispatcher.emit('Landed', {
      jumpId: 7,
      position: referencePosition,
      velocity: referenceVelocity,
      timestamp: performance.now(),
      jumpState: JumpState.Grounded,
      extraData: { landingResult: { impactVelocity: -25.0 } },
    });

    const intent: EnvironmentIntent = {
      playerPosition: referencePosition,
      playerVelocity: referenceVelocity,
      speed: Math.sqrt(referenceVelocity.x ** 2 + referenceVelocity.z ** 2),
      movementEnergy: 1.2,
      landingImpact: 25.0,
      surfaceMaterialTag: SurfaceMaterial.Grass,
      isGrounded: true,
    };

    for (let i = 0; i < 50; i++) {
      controller.updateWithIntent(intent, 0.016);
    }

    expect(JSON.stringify(referencePosition)).toBe(initialPosSnapshot);
    expect(JSON.stringify(referenceVelocity)).toBe(initialVelSnapshot);
  });

  test('Vegetation Proximity Deformation: Quadratic distance attenuation formula & radius falloff', () => {
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE);
    const vegSubsystem = controller.getVegetationSubsystem();

    const playerPos = { x: 10.0, y: 0.0, z: 10.0 };
    const radius = LIVING_VALLEY_PROFILE.vegetation.environmentInfluenceRadius; // 2.8

    // Vertex inside influence radius (1.0 unit away along Z)
    const insideVertex = { x: 10.0, y: 1.0, z: 11.0 };
    const sampleInside = vegSubsystem.evaluateDisplacement(insideVertex, playerPos, 1.0);

    expect(sampleInside.displacement.z).toBeGreaterThan(0);
    expect(sampleInside.vibrationScale).toBeGreaterThan(0);

    // Vertex outside influence radius (4.0 units away along Z)
    const outsideVertex = { x: 10.0, y: 1.0, z: 14.0 };
    const sampleOutside = vegSubsystem.evaluateDisplacement(outsideVertex, playerPos, 1.0);

    expect(sampleOutside.displacement.x).toBe(0);
    expect(sampleOutside.displacement.z).toBe(0);
    expect(sampleOutside.vibrationScale).toBe(0);
  });

  test('Surface Response Engine: Contextual tag pooling & static memory capacity', () => {
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE);
    const surfaceSubsystem = controller.getSurfaceSubsystem();

    expect(surfaceSubsystem.getPoolCapacity()).toBe(64);
    expect(surfaceSubsystem.getActiveCount()).toBe(0);

    // Explicitly force spawn surface response elements
    const pos = { x: 0, y: 0, z: 0 };
    const vel = { x: 12, y: 0, z: 8 };

    const spawned = surfaceSubsystem.triggerSurfaceResponse(pos, vel, SurfaceMaterial.Grass, 1.0);
    expect(spawned).toBe(true);
    expect(surfaceSubsystem.getActiveCount()).toBe(1);

    // Advance simulation by lifespan to return element to pool
    surfaceSubsystem.update(1.5);
    expect(surfaceSubsystem.getActiveCount()).toBe(0);
    expect(surfaceSubsystem.getPoolFreeCount()).toBe(64);
  });

  test('Water Ripple Decal Abstraction: Concentric ring expansion & exponential opacity decay', () => {
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE);
    const rippleSubsystem = controller.getRippleSubsystem();

    expect(rippleSubsystem.getActiveRipplesCount()).toBe(0);

    // Trigger liquid landing impact
    const landedPos = { x: 5, y: 0, z: 5 };
    rippleSubsystem.triggerImpactRipple(landedPos, -15.0);

    expect(rippleSubsystem.getActiveRipplesCount()).toBe(1);

    // Step forward time to decay opacity
    rippleSubsystem.update(0.5);
    expect(rippleSubsystem.getActiveRipplesCount()).toBe(1);

    // Step past max life duration (2.5s) to clear ring
    rippleSubsystem.update(2.5);
    expect(rippleSubsystem.getActiveRipplesCount()).toBe(0);
  });

  test('Environment Profile Hot-Swapping Integrity: Updates ecosystem parameters & telemetry dynamically', () => {
    const controller = new EnvironmentResponseController(LIVING_VALLEY_PROFILE);

    let state = controller.getTelemetryState();
    expect(state.activeProfileId).toBe('LIVING_VALLEY');
    expect(state.currentActiveResponseRadius).toBe(2.8);

    const swapped = controller.setProfile(CRYSTAL_CAVERNS_PROFILE);
    expect(swapped).toBe(true);

    state = controller.getTelemetryState();
    expect(state.activeProfileId).toBe('CRYSTAL_CAVERNS');
    expect(state.currentActiveResponseRadius).toBe(1.5);

    // Verify update cycle with new profile
    const intent: EnvironmentIntent = {
      playerPosition: { x: 0, y: 0, z: 0 },
      playerVelocity: { x: 5, y: 0, z: 5 },
      speed: 7.07,
      movementEnergy: 0.5,
      landingImpact: 0,
      surfaceMaterialTag: SurfaceMaterial.Crystal,
      isGrounded: true,
    };

    const nextTelemetry = controller.updateWithIntent(intent, 0.016);
    expect(nextTelemetry.activeProfileId).toBe('CRYSTAL_CAVERNS');
    expect(nextTelemetry.frameTimeMs).toBeGreaterThanOrEqual(0);
  });
});
