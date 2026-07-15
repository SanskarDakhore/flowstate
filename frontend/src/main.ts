import { GameBootstrap } from './core/bootstrap/game-bootstrap';
import { MovementController } from './game/movement/movement-controller';
import { MathFlowPath } from './game/movement/flow-path';
import { InputRouter } from './game/input/input-router';
import { generateCourseTargets } from './game/prototype/prototype-target';
import { PrototypeInteractionSystem } from './game/prototype/prototype-interaction-system';
import { PrototypeSession } from './game/prototype/prototype-session';
import { PrototypeMetrics } from './game/prototype/prototype-metrics';
import { DebugOverlay } from './ui/debug-overlay';
import { UIRouter } from './ui/navigation/ui-router';
import { RouteId } from './ui/navigation/route-id';
import { ApplicationState } from './core/state-machine/game-state';
import { GameMode, SessionStatus } from '@flowstate/shared';
import { ResonanceFeedbackController } from './rendering/vfx/resonance-feedback';

async function main() {
  console.log('Starting FLOWSTATE Living Resonance Title & Gameplay Journey...');

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

  // Build elevated 3D ribbon path geometry & Living Valley macro environment
  activeScene.environmentView.ribbonPath.buildPathMesh(path);
  activeScene.environmentView.initLivingValley(path);
  activeScene.environmentView.worldProps.generateEnvironmentProps(path);

  // 2. Prototype System Initialization
  const targets = generateCourseTargets(path, 30);
  const interactionSystem = new PrototypeInteractionSystem();
  interactionSystem.setTargets(targets);

  const session = new PrototypeSession(60);
  const metrics = new PrototypeMetrics();
  metrics.setModel(movementController.getActiveModelId());

  let sessionEndedEmitted = false;

  // 3. Render 3D Targets & Initialize Resonance Feedback Layer
  activeScene.renderTargets(targets, path);
  const resonanceFeedback = new ResonanceFeedbackController(activeScene);

  // 4. Input Integration & UI Routing
  const inputRouter = new InputRouter();
  inputRouter.attachCanvas(canvas);

  const uiRouter = new UIRouter(context.eventBus);
  const debugOverlay = new DebugOverlay();

  // Helper for preparing/resetting session & presentation state without starting session timer
  const prepareSessionAndState = () => {
    sessionEndedEmitted = false;
    movementController.reset();
    interactionSystem.reset();
    metrics.reset();
    metrics.setModel(movementController.getActiveModelId());

    // Reset presentation visual state
    activeScene.updateTargetVisualStates(interactionSystem.getTargetStates());
    const initialState = movementController.getPlayerState();
    activeScene.playerView.setPosition(initialState.position.x, initialState.position.y, initialState.position.z);
    activeScene.playerView.resetVisualState();
    activeScene.camera.resetPosition(initialState.position);
    resonanceFeedback.reset();
  };

  // Explicit action callback triggered to start active gameplay run
  const startPlaySession = () => {
    console.log('[FLOWSTATE] Initializing active gameplay session');

    context.eventBus.emit('session:started', {
      sessionId: `session_${Date.now()}`,
      mode: GameMode.ZEN,
      timestamp: Date.now(),
    });

    context.stateMachine.transitionTo(ApplicationState.PLAYING);
    activeScene.camera.setMode('PLAYING');

    uiRouter.navigateTo(RouteId.HUD);
    prepareSessionAndState();
    session.start(); // Timer ONLY ticks after active session starts
  };

  // Event Bus Listener for Session Ended Milestone
  context.eventBus.on('session:ended', (payload) => {
    console.log('[FLOWSTATE] session:ended event payload received:', payload);

    context.stateMachine.transitionTo(ApplicationState.RESULTS);
    activeScene.camera.setMode('CINEMATIC_IDLE');

    const summary = metrics.getSummary();
    const targetsCleared = summary.targetsPassed;
    const totalCourseTargets = 30;
    const harmonyPct = Math.round(session.getCourseProgress() * 100);
    const calculatedScore = payload.finalScore > 0 ? payload.finalScore : Math.round(targetsCleared * 250 + harmonyPct * 10);

    const resultsData = {
      targetsPassed: targetsCleared,
      totalTargets: totalCourseTargets,
      finalScore: calculatedScore,
      harmonyPct: harmonyPct,
      durationSeconds: 60,
    };

    uiRouter.showResults(
      resultsData,
      // Retry Callback: Re-Resonate
      () => {
        console.log('[FLOWSTATE] Re-Resonating run from Results Screen');
        startPlaySession();
      },
      // Return Callback: Return to Void
      () => {
        console.log('[FLOWSTATE] Returning to Void / Title Screen');
        context.stateMachine.transitionTo(ApplicationState.TITLE);
        activeScene.camera.setMode('CINEMATIC_IDLE');
        uiRouter.navigateTo(RouteId.TITLE, startPlaySession);
        prepareSessionAndState(); // Visuals reset, timer stays stopped!
      }
    );
  });

  // Keyboard shortcut listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      movementController.switchModel('guided-flow');
      startPlaySession();
    } else if (e.key === '2') {
      movementController.switchModel('free-flow');
      startPlaySession();
    } else if (e.key === '3') {
      movementController.switchModel('branching-flow');
      startPlaySession();
    } else if (e.key === 'r' || e.key === 'R') {
      if (context.stateMachine.getCurrentState() === ApplicationState.PLAYING) {
        startPlaySession();
      }
    }
  });

  // Set initial application state & camera idle mode
  context.stateMachine.transitionTo(ApplicationState.TITLE);
  activeScene.camera.setMode('CINEMATIC_IDLE');

  // Mount Title Screen as initial route
  uiRouter.navigateTo(RouteId.TITLE, startPlaySession);

  let lastTime = performance.now();

  // 5. Authoritative Game Loop Tick Sync
  const updateLoop = () => {
    const now = performance.now();
    const deltaTimeSeconds = Math.min(0.1, (now - lastTime) / 1000.0);
    lastTime = now;

    const appState = context.stateMachine.getCurrentState();

    if (appState === ApplicationState.TITLE || appState === ApplicationState.RESULTS) {
      // 3D Scene remains fully visible behind Title/Results UI, executing slow cinematic camera orbit
      const initialPState = movementController.getPlayerState();
      activeScene.camera.updateTarget(
        initialPState.position,
        { x: 0, y: 0, z: 1 },
        0,
        0,
        deltaTimeSeconds
      );
      if (appState === ApplicationState.TITLE) {
        activeScene.environmentView.setHarmonyLevel(0.2);
      }
    } else if (appState === ApplicationState.PLAYING && session.getState() === 'RUNNING') {
      // Read input intent
      const intent = inputRouter.getCurrentIntent();

      // Tick movement simulation controller
      const playerState = movementController.update(intent, deltaTimeSeconds);

      // Evaluate target interactions
      const events = interactionSystem.evaluate(playerState);
      for (const event of events) {
        metrics.recordInteraction(event);
      }
      resonanceFeedback.onInteractionEvents(events);

      // Estimate path deviation
      const closestProg = path.getClosestProgress(playerState.position);
      const pathPoint = path.getPosition(closestProg);
      const dx = playerState.position.x - pathPoint.x;
      const dy = playerState.position.y - pathPoint.y;
      const pathDeviation = Math.sqrt(dx * dx + dy * dy);

      metrics.recordFrame(playerState, intent, pathDeviation, deltaTimeSeconds);

      // Advance prototype session progress
      session.update(deltaTimeSeconds, closestProg);

      // Presentation Bridge: Sync 3D scene, visual landing squash, & camera chase
      activeScene.updateTargetVisualStates(interactionSystem.getTargetStates());
      activeScene.update(deltaTimeSeconds, playerState, intent.horizontal);

      // Drive visual world vitality from hybrid harmony interpolation (30% journey progress + 70% target pass accuracy)
      const courseProgress = session.getCourseProgress();
      const summaryMetrics = metrics.getSummary();
      const performanceRatio = summaryMetrics.targetsPassed / 30.0;
      resonanceFeedback.setHarmonyLevel(courseProgress, performanceRatio, deltaTimeSeconds);

      // Update Player HUD via UIRouter
      resonanceFeedback.setPlayerHud(uiRouter.getPlayerHud());
      uiRouter.updateHud({
        sessionProgress: courseProgress,
        remainingTime: session.getRemainingTime(),
        metrics: metrics.getSummary(),
        playerState,
      });

      if (session.getState() === 'COMPLETED' && !sessionEndedEmitted) {
        sessionEndedEmitted = true;
        console.log('[FLOWSTATE] Prototype Session Completed -> Emitting session:ended');
        const summary = metrics.getSummary();
        const score = Math.round(summary.targetsPassed * 250 + courseProgress * 1000);
        context.eventBus.emit('session:ended', {
          sessionId: `session_${Date.now()}`,
          status: SessionStatus.COMPLETED,
          finalScore: score,
        });
      }
    }

    // Update telemetry overlay
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

  console.log('FLOWSTATE Title, HUD & Results Journey is ready!');
}

main().catch((err) => {
  console.error('Fatal error in FLOWSTATE main execution:', err);
});
