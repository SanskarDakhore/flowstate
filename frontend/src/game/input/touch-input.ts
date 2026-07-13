import { RawInputEvent } from './input-types';

export class TouchInputAdapter {
  public parseTouchEvent(event: { type: string; touches: Array<{ clientX: number; clientY: number; identifier: number }> }): RawInputEvent[] {
    const timestamp = Date.now();
    let type: RawInputEvent['type'] = 'touchmove';
    if (event.type === 'touchstart') type = 'touchstart';
    if (event.type === 'touchend') type = 'touchend';

    return event.touches.map((t) => ({
      type,
      x: t.clientX,
      y: t.clientY,
      timestamp,
      identifier: t.identifier,
    }));
  }
}
