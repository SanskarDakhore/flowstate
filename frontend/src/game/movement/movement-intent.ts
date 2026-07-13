export interface MovementIntent {
  horizontal: number;
  vertical: number;
  actionHeld: boolean;
  jumpPressed: boolean;
  action?: boolean; // Backward compatibility alias for actionHeld
}

export function createEmptyIntent(): MovementIntent {
  return {
    horizontal: 0,
    vertical: 0,
    actionHeld: false,
    jumpPressed: false,
    action: false,
  };
}

export function clampIntentValue(val: number): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) {
    return 0;
  }
  return Math.max(-1.0, Math.min(1.0, val));
}

export function sanitizeIntent(intent: Partial<MovementIntent>): MovementIntent {
  const isAction = Boolean(intent.actionHeld ?? intent.action);
  return {
    horizontal: clampIntentValue(intent.horizontal ?? 0),
    vertical: clampIntentValue(intent.vertical ?? 0),
    actionHeld: isAction,
    jumpPressed: Boolean(intent.jumpPressed),
    action: isAction,
  };
}
