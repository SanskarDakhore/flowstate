export type EmotionalMood = 'lonely' | 'quiet' | 'hopeful' | 'alive' | 'joyful' | 'sacred';

export interface ExperienceSnapshot {
  readonly mood: EmotionalMood;
  readonly worldWarmth: number; // 0.0 (cold indigo) to 1.0 (radiant gold)
  readonly sanctuaryState: number; // 0.0 (dormant) to 1.0 (fully recovered)
  readonly emotionalPrompt: string;
  readonly timestamp: number;
}

export function createDefaultExperienceSnapshot(): ExperienceSnapshot {
  return {
    mood: 'quiet',
    worldWarmth: 0.5,
    sanctuaryState: 0.2,
    emotionalPrompt: 'The valley rests peacefully.',
    timestamp: Date.now(),
  };
}
