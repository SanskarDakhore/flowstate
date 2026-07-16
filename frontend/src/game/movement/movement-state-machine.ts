import { JumpState, PureVerticalKinematicsResult } from './movement-types';
import { APEX_THRESHOLD } from './movement-constants';

export class MovementStateMachine {
  private currentState: JumpState = JumpState.Grounded;

  public update(kinematics: PureVerticalKinematicsResult): JumpState {
    const { isGrounded, verticalVelocity, justLanded, jumpTriggeredThisFrame } = kinematics;

    if (jumpTriggeredThisFrame) {
      this.currentState = JumpState.JumpStarting;
      return this.currentState;
    }

    if (justLanded) {
      this.currentState = JumpState.Landing;
      return this.currentState;
    }

    if (isGrounded) {
      this.currentState = JumpState.Grounded;
      return this.currentState;
    }

    // Airborne state resolution
    if (verticalVelocity > APEX_THRESHOLD) {
      this.currentState = JumpState.Ascending;
    } else if (Math.abs(verticalVelocity) <= APEX_THRESHOLD) {
      this.currentState = JumpState.Apex;
    } else {
      this.currentState = JumpState.Descending;
    }

    return this.currentState;
  }

  public getCurrentState(): JumpState {
    return this.currentState;
  }

  public reset(): void {
    this.currentState = JumpState.Grounded;
  }
}
