import { RawInputEvent } from './input-types';

export class PointerInputAdapter {
  public parseMouseEvent(event: { type: string; clientX: number; clientY: number }): RawInputEvent {
    let type: RawInputEvent['type'] = 'pointermove';
    if (event.type === 'mousedown') type = 'pointerdown';
    if (event.type === 'mouseup') type = 'pointerup';

    return {
      type,
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    };
  }
}
