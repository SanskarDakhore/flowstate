import { ExpressionInputs, PlayerExpressionProfile, TrailExpression } from '../player-expression-profile';

export class TrailController {
  private profile: PlayerExpressionProfile;

  constructor(profile: PlayerExpressionProfile) {
    this.profile = profile;
  }

  public setProfile(profile: PlayerExpressionProfile): void {
    this.profile = profile;
  }

  public update(inputs: ExpressionInputs, _dt: number): TrailExpression {
    const intensity = this.profile.expressionIntensity;
    const speed = inputs.motion.speed;
    const maxSpeed = 20.0;
    const normalizedSpeed = Math.min(1.0, speed / maxSpeed);

    const energy = inputs.presentationHints.movementEnergy;

    // As speed increases toward maxSpeed, trail pinches narrow and extends back
    const dynamicLength = this.profile.maxTrailLength * (0.2 + normalizedSpeed * 0.8) * intensity;
    const dynamicWidth = this.profile.baseTrailWidth * (1.1 - normalizedSpeed * 0.3) * intensity;
    const dynamicOpacity = Math.min(1.0, (0.3 + energy * 0.7) * intensity);

    return {
      opacity: Math.max(0, dynamicOpacity),
      length: Math.max(0.5, dynamicLength),
      width: Math.max(0.05, dynamicWidth),
      intensity: energy,
    };
  }

  public reset(): void {}
}
