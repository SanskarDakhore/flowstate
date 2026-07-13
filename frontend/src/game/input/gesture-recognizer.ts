import { RawInputEvent, NormalizedGameCommand, InputGestureType } from './input-types';

export class GestureRecognizer {
  private startEvent: RawInputEvent | null = null;
  private minSwipeDistance = 30;

  public processInput(raw: RawInputEvent): NormalizedGameCommand | null {
    if (raw.type === 'pointerdown' || raw.type === 'touchstart') {
      this.startEvent = raw;
      return null;
    }

    if ((raw.type === 'pointerup' || raw.type === 'touchend') && this.startEvent) {
      const deltaX = raw.x - this.startEvent.x;
      const deltaY = raw.y - this.startEvent.y;
      const durationMs = raw.timestamp - this.startEvent.timestamp;
      const distSq = deltaX * deltaX + deltaY * deltaY;

      const start = this.startEvent;
      this.startEvent = null;

      if (distSq >= this.minSwipeDistance * this.minSwipeDistance) {
        return {
          gesture: InputGestureType.SWIPE,
          positionX: raw.x,
          positionY: raw.y,
          deltaX,
          deltaY,
          durationMs,
          timestamp: raw.timestamp,
        };
      } else if (durationMs >= 300) {
        return {
          gesture: InputGestureType.HOLD,
          positionX: raw.x,
          positionY: raw.y,
          durationMs,
          timestamp: raw.timestamp,
        };
      } else {
        return {
          gesture: InputGestureType.TAP,
          positionX: start.x,
          positionY: start.y,
          durationMs,
          timestamp: raw.timestamp,
        };
      }
    }

    return null;
  }
}
