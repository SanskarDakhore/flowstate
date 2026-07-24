import { RawInputEvent, NormalizedGameCommand } from './input-types';
import { GestureRecognizer } from './gesture-recognizer';
import { MovementIntent, createEmptyIntent, clampIntentValue } from '../movement/movement-intent';

type CommandListener = (command: NormalizedGameCommand) => void;
type IntentListener = (intent: MovementIntent) => void;

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
type MutableMovementIntent = Mutable<Required<MovementIntent>>;

export class InputRouter {
  private recognizer = new GestureRecognizer();
  private commandListeners: CommandListener[] = [];
  private intentListeners: IntentListener[] = [];

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private currentIntent: MutableMovementIntent = createEmptyIntent() as MutableMovementIntent;
  private pendingJumpTrigger: boolean = false;

  private keyStates: Map<string, boolean> = new Map();

  constructor() {
    this.setupKeyboardListeners();
  }

  public addListener(listener: CommandListener): void {
    this.commandListeners.push(listener);
  }

  public removeListener(listener: CommandListener): void {
    this.commandListeners = this.commandListeners.filter((l) => l !== listener);
  }

  public addIntentListener(listener: IntentListener): void {
    this.intentListeners.push(listener);
  }

  public attachCanvas(canvas: HTMLCanvasElement): void {
    canvas.style.touchAction = 'none';

    const handleStart = (x: number, y: number) => {
      this.isDragging = true;
      this.dragStartX = x;
      this.dragStartY = y;
    };

    const handleMove = (x: number, y: number) => {
      if (!this.isDragging) return;
      const refScale = Math.min(window.innerWidth, window.innerHeight) * 0.25 || 150;
      const deltaX = x - this.dragStartX;
      const deltaY = y - this.dragStartY;

      this.currentIntent.horizontal = clampIntentValue(deltaX / refScale);
      // Invert Y so dragging upward yields positive vertical intent
      this.currentIntent.vertical = clampIntentValue(-deltaY / refScale);
      this.dispatchIntent();
    };

    const handleEnd = () => {
      this.isDragging = false;
      this.currentIntent.horizontal = 0;
      this.currentIntent.vertical = 0;
      this.dispatchIntent();
    };

    canvas.addEventListener('pointerdown', (e) => handleStart(e.clientX, e.clientY));
    canvas.addEventListener('pointermove', (e) => handleMove(e.clientX, e.clientY));
    canvas.addEventListener('pointerup', () => handleEnd());
    canvas.addEventListener('pointercancel', () => handleEnd());
  }

  public handleRawInput(raw: RawInputEvent): void {
    const command = this.recognizer.processInput(raw);
    if (command) {
      for (const listener of this.commandListeners) {
        listener(command);
      }
    }
  }

  private setupKeyboardListeners(): void {
    if (typeof window === 'undefined') return;

    const monitoredCodes = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];

    window.addEventListener('keydown', (e) => {
      if (monitoredCodes.includes(e.code)) {
        if (e.code === 'Space') {
          e.preventDefault();
          // Detect discrete keydown press-edge for jumpPressed
          if (!this.keyStates.get('Space')) {
            this.pendingJumpTrigger = true;
          }
        }
        this.keyStates.set(e.code, true);
        this.updateIntentFromKeys();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (monitoredCodes.includes(e.code)) {
        this.keyStates.set(e.code, false);
        this.updateIntentFromKeys();
      }
    });
  }

  private updateIntentFromKeys(): void {
    let horiz = 0;
    let vert = 0;

    if (!this.isDragging) {
      if (this.keyStates.get('ArrowLeft') || this.keyStates.get('KeyA')) horiz -= 1.0;
      if (this.keyStates.get('ArrowRight') || this.keyStates.get('KeyD')) horiz += 1.0;
      if (this.keyStates.get('ArrowUp') || this.keyStates.get('KeyW')) vert += 1.0;
      if (this.keyStates.get('ArrowDown') || this.keyStates.get('KeyS')) vert -= 1.0;

      this.currentIntent.horizontal = clampIntentValue(horiz);
      this.currentIntent.vertical = clampIntentValue(vert);
    }

    const spaceHeld = !!this.keyStates.get('Space');
    this.currentIntent.actionHeld = spaceHeld;
    this.currentIntent.action = spaceHeld;
    this.currentIntent.jumpPressed = this.pendingJumpTrigger;

    this.dispatchIntent();

    // Consume discrete jump trigger edge
    this.pendingJumpTrigger = false;
  }

  private dispatchIntent(): void {
    for (const listener of this.intentListeners) {
      listener({ ...this.currentIntent });
    }
  }

  public getCurrentIntent(): MovementIntent {
    const snapshot = {
      ...this.currentIntent,
      jumpPressed: this.pendingJumpTrigger || this.currentIntent.jumpPressed,
    };
    // Clear pending trigger after reading snapshot
    this.pendingJumpTrigger = false;
    this.currentIntent.jumpPressed = false;
    return snapshot;
  }
}
