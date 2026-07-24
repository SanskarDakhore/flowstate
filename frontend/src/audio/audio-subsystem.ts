import { RenderFrameContext } from '@flowstate/shared';

export interface AudioSubsystem<TState> {
  update(state: Readonly<TState>, context?: Readonly<RenderFrameContext>): void;
  dispose?(): void;
}
