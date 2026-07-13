import { RouteId } from './route-id';
import { GameEventBus } from '../../core/events/game-event-bus';

export class UIRouter {
  private activeRoute: RouteId = RouteId.NONE;
  private modalStack: RouteId[] = [];
  private eventBus: GameEventBus;

  constructor(eventBus: GameEventBus) {
    this.eventBus = eventBus;
  }

  public getActiveRoute(): RouteId {
    return this.activeRoute;
  }

  public navigateTo(route: RouteId): void {
    const previousRoute = this.activeRoute;
    this.activeRoute = route;
    console.log(`[UIRouter] Navigated UI: ${previousRoute} -> ${route}`);
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
}
