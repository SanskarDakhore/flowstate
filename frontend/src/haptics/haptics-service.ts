import { HapticFeedbackType } from '@flowstate/shared';
import { Service } from '../core/architecture/service';

export class HapticsService implements Service {
  public readonly serviceName = 'HapticsService';

  public initialize(): void {
    console.log('[HapticsService] Haptics service initialized.');
  }

  public trigger(type: HapticFeedbackType): void {
    console.log(`[HapticsService] Trigger semantic haptic feedback: ${type}`);
  }
}
