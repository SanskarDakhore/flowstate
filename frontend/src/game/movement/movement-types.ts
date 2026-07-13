export interface Vector3State {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  position: Vector3State;
  velocity: Vector3State;
  forward: Vector3State;
  speed: number;
  airborneHeight: number;
  verticalVelocity: number;
  isGrounded: boolean;
  impactVelocity: number;
  justLanded: boolean;
  jumpsUsed: number;
  maxJumps: number;
  jumpEventCounter: number;
  lastJumpIndex: number;
}

export type MovementModelId = 'guided-flow' | 'free-flow' | 'branching-flow';
