import { RenderFrameContext } from '@flowstate/shared';

export { RenderFrameContext };

export interface EnvironmentSubsystem<TState> {
  update(state: Readonly<TState>, context?: Readonly<RenderFrameContext>): void;
  dispose?: () => void;
}
