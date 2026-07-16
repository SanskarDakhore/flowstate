export interface Vector2 {
  readonly x: number;
  readonly z: number;
}

export interface MovementIntent {
  readonly desiredDirection?: Vector2;
  readonly desiredSpeed?: number;
  readonly jumpPressed?: boolean;
  readonly jumpHeld?: boolean;
  readonly movementMagnitude?: number;

  // Backward compatibility fields for legacy input handling
  readonly horizontal?: number;
  readonly vertical?: number;
  readonly actionHeld?: boolean;
  readonly action?: boolean;
}

export function createEmptyIntent(): MovementIntent {
  return {
    desiredDirection: { x: 0, z: 0 },
    desiredSpeed: 0,
    jumpPressed: false,
    jumpHeld: false,
    movementMagnitude: 0,
    horizontal: 0,
    vertical: 0,
    actionHeld: false,
    action: false,
  };
}

export function clampIntentValue(val: number): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) {
    return 0;
  }
  return Math.max(-1.0, Math.min(1.0, val));
}

export function sanitizeIntent(intent: Partial<MovementIntent>): Required<MovementIntent> {
  const h = clampIntentValue(intent.horizontal ?? intent.desiredDirection?.x ?? 0);
  const v = clampIntentValue(intent.vertical ?? intent.desiredDirection?.z ?? 0);
  const rawMagnitude = Math.sqrt(h * h + v * v);
  const mag = Math.min(1.0, rawMagnitude);

  let dirX = 0;
  let dirZ = 0;
  if (rawMagnitude > 1e-5) {
    dirX = h / rawMagnitude;
    dirZ = v / rawMagnitude;
  } else if (intent.desiredDirection) {
    const dMag = Math.sqrt(
      intent.desiredDirection.x * intent.desiredDirection.x +
        intent.desiredDirection.z * intent.desiredDirection.z
    );
    if (dMag > 1e-5) {
      dirX = intent.desiredDirection.x / dMag;
      dirZ = intent.desiredDirection.z / dMag;
    }
  }

  const isJumpHeld = Boolean(
    intent.jumpHeld ?? intent.actionHeld ?? intent.action
  );
  const isJumpPressed = Boolean(intent.jumpPressed);
  const speed = intent.desiredSpeed ?? mag;

  return {
    desiredDirection: { x: dirX, z: dirZ },
    desiredSpeed: speed,
    jumpPressed: isJumpPressed,
    jumpHeld: isJumpHeld,
    movementMagnitude: mag,
    horizontal: h,
    vertical: v,
    actionHeld: isJumpHeld,
    action: isJumpHeld,
  };
}
