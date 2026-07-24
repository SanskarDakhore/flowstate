import { EmotionalMood, ExperienceSnapshot, PresentationSnapshot, WorldStateEnum, WorldStateSnapshot } from '@flowstate/shared';

export class ExperienceResolver {
  public resolveExperience(
    worldSnapshot: Readonly<WorldStateSnapshot>,
    _presentationSnapshot: Readonly<PresentationSnapshot>
  ): ExperienceSnapshot {
    let mood: EmotionalMood = 'quiet';
    let worldWarmth = 0.3;
    let prompt = 'The valley is still.';

    switch (worldSnapshot.currentState) {
      case WorldStateEnum.IDLE:
        mood = 'quiet';
        worldWarmth = 0.3;
        prompt = 'The valley rests peacefully.';
        break;
      case WorldStateEnum.AWAKENING:
        mood = 'hopeful';
        worldWarmth = 0.5;
        prompt = 'The valley begins to awaken.';
        break;
      case WorldStateEnum.GROWING:
        mood = 'alive';
        worldWarmth = 0.7;
        prompt = 'Life surges through the valley.';
        break;
      case WorldStateEnum.BLOOMING:
        mood = 'joyful';
        worldWarmth = 0.85;
        prompt = 'Flowers bloom in harmony.';
        break;
      case WorldStateEnum.THRIVING:
      case WorldStateEnum.TRANSCENDENT:
        mood = 'sacred';
        worldWarmth = 1.0;
        prompt = 'The valley reaches pure transcendent flow.';
        break;
    }

    const calculatedHarmony = (worldSnapshot.vegetationState.health * 0.5) + (worldSnapshot.wildlifeState.flockCohesion * 0.5);

    return {
      mood,
      worldWarmth,
      sanctuaryState: Math.min(1.0, calculatedHarmony * 1.2),
      emotionalPrompt: prompt,
      timestamp: Date.now(),
    };
  }
}

