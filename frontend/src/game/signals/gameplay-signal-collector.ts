import { ResonanceCalculationInput } from '@flowstate/shared';

export interface RawGameplayFacts {
  speed: number;
  maxSpeed: number;
  pathDeviation: number;
  comboCount: number;
  isGrounded: boolean;
  deltaTime: number;
}

export class GameplaySignalCollector {
  private facts: RawGameplayFacts = {
    speed: 0,
    maxSpeed: 30,
    pathDeviation: 0,
    comboCount: 0,
    isGrounded: true,
    deltaTime: 0,
  };

  public collectFacts(
    speed: number,
    maxSpeed: number,
    pathDeviation: number,
    comboCount: number,
    isGrounded: boolean,
    deltaTime: number
  ): Readonly<RawGameplayFacts> {
    this.facts.speed = speed;
    this.facts.maxSpeed = maxSpeed > 0 ? maxSpeed : 30;
    this.facts.pathDeviation = pathDeviation;
    this.facts.comboCount = comboCount;
    this.facts.isGrounded = isGrounded;
    this.facts.deltaTime = deltaTime;
    return this.facts;
  }

  public getRawFacts(): Readonly<RawGameplayFacts> {
    return this.facts;
  }
}
