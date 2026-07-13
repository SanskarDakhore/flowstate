import { GameBootstrap } from '../../src/core/bootstrap/game-bootstrap';
import { ApplicationState } from '../../src/core/state-machine/game-state';

describe('GameBootstrap Unit Tests', () => {
  it('should initialize context and transition to MAIN_MENU state', async () => {
    const bootstrap = new GameBootstrap();
    const context = await bootstrap.initialize();

    expect(context).toBeDefined();
    expect(context.stateMachine.getCurrentState()).toBe(ApplicationState.MAIN_MENU);
  });
});
