import { MovementModelId, PlayerState } from '../movement/movement-types';
import { MovementIntent } from '../movement/movement-intent';
import { InteractionEvent } from './prototype-interaction-system';

export interface MovementMetricsSummary {
  movementModel: MovementModelId;
  sessionDuration: number;
  averageSpeed: number;
  maximumSpeed: number;
  inputActivity: number;
  directionChanges: number;
  pathDeviation: number;
  targetsPassed: number;
  targetsMissed: number;
  boundaryContacts: number;
}

export class PrototypeMetrics {
  private activeModel: MovementModelId = 'guided-flow';
  private totalSamples: number = 0;
  private speedSum: number = 0;
  private maxSpeed: number = 0;

  private totalInputMagnitude: number = 0;
  private directionChanges: number = 0;
  private lastInputSignX: number = 0;

  private pathDeviationSum: number = 0;
  private targetsPassed: number = 0;
  private targetsMissed: number = 0;
  private boundaryContacts: number = 0;

  private sessionDuration: number = 0;

  public setModel(modelId: MovementModelId): void {
    this.activeModel = modelId;
  }

  public recordFrame(
    playerState: PlayerState,
    intent: MovementIntent,
    pathDeviation: number,
    deltaTime: number
  ): void {
    if (deltaTime <= 0) return;

    this.sessionDuration += deltaTime;
    this.totalSamples++;
    this.speedSum += playerState.speed;
    if (playerState.speed > this.maxSpeed) {
      this.maxSpeed = playerState.speed;
    }

    const inputMag = Math.sqrt(intent.horizontal * intent.horizontal + intent.vertical * intent.vertical);
    this.totalInputMagnitude += inputMag * deltaTime;

    const currentSignX = Math.sign(intent.horizontal);
    if (currentSignX !== 0 && this.lastInputSignX !== 0 && currentSignX !== this.lastInputSignX) {
      this.directionChanges++;
    }
    if (currentSignX !== 0) {
      this.lastInputSignX = currentSignX;
    }

    this.pathDeviationSum += Math.abs(pathDeviation);
  }

  public recordInteraction(event: InteractionEvent): void {
    if (event.type === 'PASS') {
      this.targetsPassed++;
    } else if (event.type === 'MISS') {
      this.targetsMissed++;
    } else if (event.type === 'HIT') {
      this.boundaryContacts++;
    }
  }

  public recordBoundaryContact(): void {
    this.boundaryContacts++;
  }

  public getSummary(): MovementMetricsSummary {
    return {
      movementModel: this.activeModel,
      sessionDuration: Number(this.sessionDuration.toFixed(2)),
      averageSpeed: this.totalSamples > 0 ? Number((this.speedSum / this.totalSamples).toFixed(2)) : 0,
      maximumSpeed: Number(this.maxSpeed.toFixed(2)),
      inputActivity: Number(this.totalInputMagnitude.toFixed(2)),
      directionChanges: this.directionChanges,
      pathDeviation: this.totalSamples > 0 ? Number((this.pathDeviationSum / this.totalSamples).toFixed(2)) : 0,
      targetsPassed: this.targetsPassed,
      targetsMissed: this.targetsMissed,
      boundaryContacts: this.boundaryContacts,
    };
  }

  public printSummaryToConsole(): void {
    const summary = this.getSummary();
    console.log('=== CORE MOVEMENT LAB v0.1 — METRICS SUMMARY ===');
    console.log(`Model:              ${summary.movementModel}`);
    console.log(`Session Duration:   ${summary.sessionDuration}s`);
    console.log(`Average Speed:      ${summary.averageSpeed} u/s`);
    console.log(`Maximum Speed:      ${summary.maximumSpeed} u/s`);
    console.log(`Input Activity:     ${summary.inputActivity}`);
    console.log(`Direction Changes:  ${summary.directionChanges}`);
    console.log(`Path Deviation:     ${summary.pathDeviation} u`);
    console.log(`Targets Passed:     ${summary.targetsPassed}`);
    console.log(`Targets Missed:     ${summary.targetsMissed}`);
    console.log(`Boundary Contacts:  ${summary.boundaryContacts}`);
    console.log('================================================');
  }

  public reset(): void {
    this.totalSamples = 0;
    this.speedSum = 0;
    this.maxSpeed = 0;
    this.totalInputMagnitude = 0;
    this.directionChanges = 0;
    this.lastInputSignX = 0;
    this.pathDeviationSum = 0;
    this.targetsPassed = 0;
    this.targetsMissed = 0;
    this.boundaryContacts = 0;
    this.sessionDuration = 0;
  }
}
