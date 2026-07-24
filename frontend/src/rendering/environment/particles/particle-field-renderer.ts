import { ParticleFieldShaderState } from '@flowstate/shared';
import { EnvironmentSubsystem, RenderFrameContext } from '../systems/environment-subsystem';
import { ParticlePoolManager } from './particle-pool-manager';
import { ParticleKinematicsSolver } from './particle-kinematics-solver';

export class ParticleFieldRenderer implements EnvironmentSubsystem<ParticleFieldShaderState> {
  public readonly poolManager: ParticlePoolManager;
  public readonly solver = new ParticleKinematicsSolver();

  private cachedState: ParticleFieldShaderState | null = null;
  private updateCount: number = 0;

  constructor(maxCount: number = 50000) {
    this.poolManager = new ParticlePoolManager(maxCount);
  }

  public update(state: Readonly<ParticleFieldShaderState>, context?: Readonly<RenderFrameContext>): void {
    if (
      this.cachedState &&
      this.cachedState.activeParticleCount === state.activeParticleCount &&
      this.cachedState.flowSpeedMultiplier === state.flowSpeedMultiplier &&
      this.cachedState.kineticTurbulence === state.kineticTurbulence &&
      this.cachedState.particleColorHex === state.particleColorHex
    ) {
      this.tickKinematics(context?.deltaTime ?? 0.016);
      return;
    }

    this.cachedState = { ...state };
    this.poolManager.setActiveCount(state.activeParticleCount);
    this.tickKinematics(context?.deltaTime ?? 0.016);
    this.updateCount++;
  }

  private tickKinematics(deltaTime: number): void {
    const activeCount = this.poolManager.getActiveCount();
    const buffer = this.poolManager.getBuffer();
    const turbulence = this.cachedState?.kineticTurbulence ?? 0.2;
    this.solver.integrate(buffer, activeCount, deltaTime, turbulence);
  }

  public getUpdateCount(): number {
    return this.updateCount;
  }

  public getCachedState(): Readonly<ParticleFieldShaderState> | null {
    return this.cachedState;
  }
}
