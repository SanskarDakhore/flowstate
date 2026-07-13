export enum InputGestureType {
  TAP = 'TAP',
  SWIPE = 'SWIPE',
  HOLD = 'HOLD',
  STEER = 'STEER',
}

export interface RawInputEvent {
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'touchstart' | 'touchmove' | 'touchend';
  x: number;
  y: number;
  timestamp: number;
  identifier?: number;
}

export interface NormalizedGameCommand {
  gesture: InputGestureType;
  positionX: number;
  positionY: number;
  deltaX?: number;
  deltaY?: number;
  durationMs?: number;
  timestamp: number;
}
