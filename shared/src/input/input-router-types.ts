export type PointerTargetDevice = 'TOUCH' | 'MOUSE' | 'PEN' | 'KEYBOARD' | 'GAMEPAD';

export type TouchZoneType = 'LEFT_JOYSTICK' | 'RIGHT_ACTION' | 'FULL_SCREEN';

export type GestureType = 'NONE' | 'TAP' | 'DOUBLE_TAP' | 'HOLD' | 'SWIPE_UP' | 'SWIPE_DOWN';

export interface InputDeadzoneConfig {
  readonly innerRadius: number; // Default 0.15
  readonly outerRadius: number; // Default 0.95
}

export interface ActivePointerState {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly currentX: number;
  readonly currentY: number;
  readonly zone: TouchZoneType;
  readonly startTimeMs: number;
}

export interface RoutedInputState {
  readonly horizontal: number;
  readonly vertical: number;
  readonly jumpPressed: boolean;
  readonly actionHeld: boolean;
  readonly activeGesture: GestureType;
  readonly activePointerCount: number;
}
