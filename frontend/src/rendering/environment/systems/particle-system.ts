import { ParticleState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from './environment-subsystem';

export class ParticleSystem implements EnvironmentSubsystem<ParticleState> {
  private cachedState: ParticleState | null = null;
  private updateCount: number = 0;

  public update(state: Readonly<ParticleState>, _context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.emissionRate === state.emissionRate
    ) {
      return;
    }

    this.cachedState = { ...state };
    this.updateCount++;
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<ParticleState> | null {
    return this.cachedState;
  }
}
