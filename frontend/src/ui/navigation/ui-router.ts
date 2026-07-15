import { RouteId } from './route-id';
import { GameEventBus } from '../../core/events/game-event-bus';
import { TitleScreen } from '../screens/title-screen';
import { PlayerHud, PlayerHudData } from '../hud/player-hud';
import { ResultsScreen, ResultsScreenData } from '../screens/results-screen';

export type RouteChangeListener = (route: RouteId, previousRoute: RouteId) => void;

export class UIRouter {
  private activeRoute: RouteId = RouteId.NONE;
  private modalStack: RouteId[] = [];
  private eventBus: GameEventBus;

  private titleScreen: TitleScreen | null = null;
  private playerHud: PlayerHud | null = null;
  private resultsScreen: ResultsScreen | null = null;
  private routeListeners: Set<RouteChangeListener> = new Set();

  constructor(eventBus: GameEventBus) {
    this.eventBus = eventBus;
  }

  public getActiveRoute(): RouteId {
    return this.activeRoute;
  }

  public getPlayerHud(): PlayerHud | null {
    return this.playerHud;
  }

  public onRouteChanged(listener: RouteChangeListener): void {
    this.routeListeners.add(listener);
  }

  public navigateTo(route: RouteId, onTitleStart?: () => void): void {
    if (this.activeRoute === route) return;

    const previousRoute = this.activeRoute;
    this.activeRoute = route;

    // Clean up active views from previous route
    this.unmountActiveViews();

    // Mount view corresponding to new route
    switch (route) {
      case RouteId.TITLE:
        this.titleScreen = new TitleScreen(() => {
          if (onTitleStart) {
            onTitleStart();
          }
        });
        break;

      case RouteId.HUD:
        this.playerHud = new PlayerHud();
        break;

      default:
        break;
    }

    console.log(`[UIRouter] Navigated UI: ${previousRoute} -> ${route}`);
    this.notifyRouteListeners(previousRoute);
  }

  public showResults(
    data: ResultsScreenData,
    onRetry?: () => void,
    onReturnToVoid?: () => void
  ): void {
    const previousRoute = this.activeRoute;
    this.activeRoute = RouteId.RESULTS_SCREEN;

    this.unmountActiveViews();

    this.resultsScreen = new ResultsScreen(data, onRetry, onReturnToVoid);

    console.log(`[UIRouter] Navigated UI: ${previousRoute} -> RESULTS_SCREEN`);
    this.notifyRouteListeners(previousRoute);
  }

  public updateHud(data: PlayerHudData): void {
    if (this.playerHud) {
      this.playerHud.update(data);
    }
  }

  public unmountActiveViews(): void {
    if (this.titleScreen) {
      this.titleScreen.dispose();
      this.titleScreen = null;
    }
    if (this.playerHud) {
      this.playerHud.dispose();
      this.playerHud = null;
    }
    if (this.resultsScreen) {
      this.resultsScreen.dispose();
      this.resultsScreen = null;
    }
  }

  public pushModal(modalRoute: RouteId): void {
    this.modalStack.push(modalRoute);
    console.log(`[UIRouter] Pushed Modal: ${modalRoute}`);
  }

  public popModal(): RouteId | undefined {
    const popped = this.modalStack.pop();
    if (popped) {
      console.log(`[UIRouter] Popped Modal: ${popped}`);
    }
    return popped;
  }

  private notifyRouteListeners(previousRoute: RouteId): void {
    for (const listener of this.routeListeners) {
      listener(this.activeRoute, previousRoute);
    }
  }

  public dispose(): void {
    this.unmountActiveViews();
    this.routeListeners.clear();
  }
}
