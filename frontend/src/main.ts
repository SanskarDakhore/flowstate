import { GameBootstrap } from './core/bootstrap/game-bootstrap';
import { MovementController } from './game/movement/movement-controller';
import { MovementModelId } from './game/movement/movement-types';
import { MathFlowPath } from './game/movement/flow-path';
import { InputRouter } from './game/input/input-router';
import { generateCourseTargets } from './game/prototype/prototype-target';
import { PrototypeInteractionSystem } from './game/prototype/prototype-interaction-system';
import { PrototypeSession } from './game/prototype/prototype-session';
import { PrototypeMetrics } from './game/prototype/prototype-metrics';
import { DebugOverlay } from './ui/debug-overlay';

async function main() {
  console.log('Starting FLOWSTATE Core Movement Lab v0.1...');

  const canvas = typeof document !== 'undefined' ? (document.getElementById('renderCanvas') as HTMLCanvasElement) : undefined;
  const bootstrapper = new GameBootstrap();
  const context = await bootstrapper.initialize(canvas);

  const activeScene = context.renderingEngine.getActiveScene();
  if (!activeScene || !canvas) {
    console.error('Core Movement Lab initialization aborted: missing active 3D scene or canvas');
    return;
  }

  // 1. Core Movement & Flow Path Setup
  const path = new MathFlowPath(600, 10, 2, 4, 3);
  const movementController = new MovementController('guided-flow');

  // Build elevated 3D ribbon path geometry sampling directly from authoritative FlowPath math
  activeScene.environmentView.ribbonPath.buildPathMesh(path);

  // Generate background environment floating islands & landmark crystals
  activeScene.environmentView.worldProps.generateEnvironmentProps(path);

  // 2. Prototype System Initialization
  const targets = generateCourseTargets(path, 30);
  const interactionSystem = new PrototypeInteractionSystem();
  interactionSystem.setTargets(targets);

  const session = new PrototypeSession(60); // 60-second prototype session
  const metrics = new PrototypeMetrics();
  metrics.setModel(movementController.getActiveModelId());

  // 3. Render 3D Targets in Presentation Layer with authoritative TrackFrame rotation
  activeScene.renderTargets(targets, path);

  // 4. Input Integration
  const inputRouter = new InputRouter();
  inputRouter.attachCanvas(canvas);

  // 5. Live Telemetry Overlay
  const debugOverlay = new DebugOverlay();

  // Helper for resetting test session and player state on switch/restart
  const resetSessionAndState = () => {
    movementController.reset();
    interactionSystem.reset();
    metrics.reset();
    metrics.setModel(movementController.getActiveModelId());
    session.start();

    // Reset presentation visual state cleanly
    activeScene.updateTargetVisualStates(interactionSystem.getTargetStates());
    const initialState = movementController.getPlayerState();
    activeScene.playerView.setPosition(initialState.position.x, initialState.position.y, initialState.position.z);
    activeScene.playerView.resetVisualState();
    activeScene.camera.resetPosition(initialState.position);

    console.log(`[Core Movement Lab] Reset & Restarted Session with Model: ${movementController.getActiveModelId()}`);
  };

  // Keyboard shortcut listeners for switching movement models
  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      movementController.switchModel('guided-flow');
      resetSessionAndState();
    } else if (e.key === '2') {
      movementController.switchModel('free-flow');
      resetSessionAndState();
    } else if (e.key === '3') {
      movementController.switchModel('branching-flow');
      resetSessionAndState();
    } else if (e.key === 'r' || e.key === 'R') {
      resetSessionAndState();
    }
  });

  // Start initial prototype session
  session.start();

  let lastTime = performance.now();

  // 6. Authoritative Game Loop Tick Sync
  const updateLoop = () => {
    const now = performance.now();
    const deltaTimeSeconds = Math.min(0.1, (now - lastTime) / 1000.0);
    lastTime = now;

    if (session.getState() === 'RUNNING') {
      // a. Read normalized movement intent
      const intent = inputRouter.getCurrentIntent();

      // b. Tick movement simulation controller -> yields updated PlayerState
      const playerState = movementController.update(intent, deltaTimeSeconds);

      // c. Evaluate target interactions using framework-neutral simulation data
      const events = interactionSystem.evaluate(playerState);
      for (const event of events) {
        metrics.recordInteraction(event);
      }

      // d. Estimate path deviation for metrics tracking
      const closestProg = path.getClosestProgress(playerState.position);
      const pathPoint = path.getPosition(closestProg);
      const dx = playerState.position.x - pathPoint.x;
      const dy = playerState.position.y - pathPoint.y;
      const pathDeviation = Math.sqrt(dx * dx + dy * dy);

      metrics.recordFrame(playerState, intent, pathDeviation, deltaTimeSeconds);

      // e. Advance prototype session progress
      session.update(deltaTimeSeconds, closestProg);

      // f. Presentation Bridge: Sync simulation PlayerState -> Babylon 3D Mesh & Camera
      activeScene.updateTargetVisualStates(interactionSystem.getTargetStates());

      // Sync 3D scene visual updates, landing squash animation, and chase camera look-ahead
      activeScene.update(
        deltaTimeSeconds,
        playerState,
        intent.horizontal
      );

      // TEMPORARY PROTOTYPE BEHAVIOR: Drive harmony visual level from course completion progress
      const temporaryHarmonyLevel = session.getCourseProgress();
      activeScene.environmentView.setHarmonyLevel(temporaryHarmonyLevel);

      if (session.getState() === 'COMPLETED') {
        console.log('[Core Movement Lab] Session Completed!');
        metrics.printSummaryToConsole();
      }
    }

    // g. Update debug overlay
    const currentPState = movementController.getPlayerState();
    debugOverlay.update({
      modelId: movementController.getActiveModelId(),
      position: currentPState.position,
      speed: currentPState.speed,
      intent: inputRouter.getCurrentIntent(),
      sessionProgress: session.getCourseProgress(),
      remainingTime: session.getRemainingTime(),
      metrics: metrics.getSummary(),
      playerState: currentPState,
    });

    requestAnimationFrame(updateLoop);
  };

  requestAnimationFrame(updateLoop);

  console.log('FLOWSTATE Core Movement Lab v0.1 is ready!');
}

main().catch((err) => {
  console.error('Fatal error in Core Movement Lab execution:', err);
});
