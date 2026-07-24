import {
  ActivePointerState,
  GestureType,
  InputDeadzoneConfig,
  RoutedInputState,
  TouchZoneType,
} from '@flowstate/shared';
import { MovementIntent } from '../movement/movement-intent';

export const DEFAULT_DEADZONE: InputDeadzoneConfig = {
  innerRadius: 0.15,
  outerRadius: 0.95,
};

export class TouchPointerRouter {
  private deadzone: InputDeadzoneConfig;
  private activePointers: Map<number, ActivePointerState> = new Map();
  private lastTapTimeMs: number = 0;

  private keyboardState = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  };

  private pendingJumpTrigger: boolean = false;
  private currentGesture: GestureType = 'NONE';

  constructor(deadzone: InputDeadzoneConfig = DEFAULT_DEADZONE) {
    this.deadzone = deadzone;
  }

  public handlePointerDown(
    pointerId: number,
    x: number,
    y: number,
    screenWidth: number,
    timeMs: number
  ): void {
    const zone: TouchZoneType = x < screenWidth * 0.5 ? 'LEFT_JOYSTICK' : 'RIGHT_ACTION';

    const pointerState: ActivePointerState = {
      pointerId,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      zone,
      startTimeMs: timeMs,
    };

    this.activePointers.set(pointerId, pointerState);

    if (zone === 'RIGHT_ACTION') {
      this.pendingJumpTrigger = true;
    }
  }

  public handlePointerMove(pointerId: number, x: number, y: number): void {
    const existing = this.activePointers.get(pointerId);
    if (existing) {
      this.activePointers.set(pointerId, {
        ...existing,
        currentX: x,
        currentY: y,
      });
    }
  }

  public handlePointerUp(pointerId: number, timeMs: number): GestureType {
    const pointer = this.activePointers.get(pointerId);
    let gesture: GestureType = 'NONE';

    if (pointer) {
      const duration = timeMs - pointer.startTimeMs;
      const dx = pointer.currentX - pointer.startX;
      const dy = pointer.currentY - pointer.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 15) {
        if (duration < 250) {
          if (timeMs - this.lastTapTimeMs < 300) {
            gesture = 'DOUBLE_TAP';
          } else {
            gesture = 'TAP';
          }
          this.lastTapTimeMs = timeMs;
        } else if (duration >= 350) {
          gesture = 'HOLD';
        }
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
        gesture = dy < 0 ? 'SWIPE_UP' : 'SWIPE_DOWN';
      }

      this.activePointers.delete(pointerId);
    }

    this.currentGesture = gesture;
    return gesture;
  }

  public applyRadialDeadzone(rawX: number, rawY: number, refScale: number): { x: number; y: number } {
    const dist = Math.sqrt(rawX * rawX + rawY * rawY);
    const normalizedDist = dist / refScale;

    if (normalizedDist < this.deadzone.innerRadius) {
      return { x: 0, y: 0 };
    }

    const clampedDist = Math.min(normalizedDist, this.deadzone.outerRadius);
    const scaledMagnitude =
      (clampedDist - this.deadzone.innerRadius) /
      (this.deadzone.outerRadius - this.deadzone.innerRadius);

    const dirX = rawX / (dist || 1);
    const dirY = rawY / (dist || 1);

    return {
      x: Math.min(1.0, Math.max(-1.0, dirX * scaledMagnitude)),
      y: Math.min(1.0, Math.max(-1.0, dirY * scaledMagnitude)),
    };
  }

  public setKeyboardKey(code: string, isPressed: boolean): void {
    if (code === 'KeyA' || code === 'ArrowLeft') this.keyboardState.left = isPressed;
    if (code === 'KeyD' || code === 'ArrowRight') this.keyboardState.right = isPressed;
    if (code === 'KeyW' || code === 'ArrowUp') this.keyboardState.up = isPressed;
    if (code === 'KeyS' || code === 'ArrowDown') this.keyboardState.down = isPressed;

    if (code === 'Space') {
      if (isPressed && !this.keyboardState.space) {
        this.pendingJumpTrigger = true;
      }
      this.keyboardState.space = isPressed;
    }
  }

  public evaluateRoutedIntent(refScale: number = 100.0): {
    intent: MovementIntent;
    state: RoutedInputState;
  } {
    let joystickX = 0;
    let joystickY = 0;
    let actionHeld = this.keyboardState.space;

    for (const pointer of this.activePointers.values()) {
      if (pointer.zone === 'LEFT_JOYSTICK') {
        const rawDx = pointer.currentX - pointer.startX;
        // Invert Y so dragging upward yields positive vertical intent
        const rawDy = -(pointer.currentY - pointer.startY);

        const filtered = this.applyRadialDeadzone(rawDx, rawDy, refScale);
        joystickX = filtered.x;
        joystickY = filtered.y;
      } else if (pointer.zone === 'RIGHT_ACTION') {
        actionHeld = true;
      }
    }

    // Keyboard fallback / combination
    let kbX = 0;
    let kbY = 0;
    if (this.keyboardState.left) kbX -= 1.0;
    if (this.keyboardState.right) kbX += 1.0;
    if (this.keyboardState.up) kbY += 1.0;
    if (this.keyboardState.down) kbY -= 1.0;

    const finalX = Math.min(1.0, Math.max(-1.0, joystickX + kbX));
    const finalY = Math.min(1.0, Math.max(-1.0, joystickY + kbY));

    const jumpTrigger = this.pendingJumpTrigger;
    this.pendingJumpTrigger = false;

    const intent: MovementIntent = {
      horizontal: finalX,
      vertical: finalY,
      jumpPressed: jumpTrigger,
      action: actionHeld,
      actionHeld,
    };

    const state: RoutedInputState = {
      horizontal: finalX,
      vertical: finalY,
      jumpPressed: jumpTrigger,
      actionHeld,
      activeGesture: this.currentGesture,
      activePointerCount: this.activePointers.size,
    };

    return { intent, state };
  }
}
