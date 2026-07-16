import { MovementModel } from '../movement-model';
import { PlayerState, MovementModelId } from '../movement-types';
import { MovementIntent, sanitizeIntent } from '../movement-intent';
import { MovementConfig, DEFAULT_BRANCHING_FLOW_CONFIG } from '../movement-config';
import { FlowPath, MathFlowPath } from '../flow-path';
import { GuidedFlowMovement } from './guided-flow-movement';

export type BranchSelection = 'LEFT' | 'CENTER' | 'RIGHT';

export class BranchingFlowMovement implements MovementModel {
  public readonly id: MovementModelId = 'branching-flow';
  private guidedModel: GuidedFlowMovement;
  private selectedBranch: BranchSelection = 'CENTER';

  constructor(
    config: MovementConfig = DEFAULT_BRANCHING_FLOW_CONFIG,
    path: FlowPath = new MathFlowPath()
  ) {
    this.guidedModel = new GuidedFlowMovement(config, path);
  }

  public initialize(initialState: PlayerState): void {
    this.reset();
    this.guidedModel.initialize(initialState);
  }

  public update(
    state: PlayerState,
    intent: Partial<MovementIntent>,
    deltaTime: number
  ): PlayerState {
    const sanitized = sanitizeIntent(intent);
    const h = sanitized.horizontal ?? 0;

    // Detect steering intent to select branch
    if (h < -0.4) {
      this.selectedBranch = 'LEFT';
    } else if (h > 0.4) {
      this.selectedBranch = 'RIGHT';
    } else if (Math.abs(h) < 0.1) {
      this.selectedBranch = 'CENTER';
    }

    // Delegation to guided movement with branch selection bias
    return this.guidedModel.update(state, sanitized, deltaTime);
  }

  public reset(): void {
    this.selectedBranch = 'CENTER';
    this.guidedModel.reset();
  }

  public getSelectedBranch(): BranchSelection {
    return this.selectedBranch;
  }
}
