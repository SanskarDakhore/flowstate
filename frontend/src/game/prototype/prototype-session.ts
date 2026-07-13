export type SessionState = 'READY' | 'RUNNING' | 'COMPLETED';

export class PrototypeSession {
  private state: SessionState = 'READY';
  private durationSeconds: number;
  private elapsedTime: number = 0;
  private courseProgress: number = 0;

  constructor(durationSeconds: number = 60) {
    this.durationSeconds = durationSeconds;
  }

  public start(): void {
    this.state = 'RUNNING';
    this.elapsedTime = 0;
    this.courseProgress = 0;
  }

  public update(deltaTimeSeconds: number, currentProgressOnCourse?: number): void {
    if (this.state !== 'RUNNING') {
      return;
    }

    this.elapsedTime += deltaTimeSeconds;

    if (currentProgressOnCourse !== undefined) {
      this.courseProgress = Math.max(0, Math.min(1.0, currentProgressOnCourse));
    } else {
      this.courseProgress = Math.max(0, Math.min(1.0, this.elapsedTime / this.durationSeconds));
    }

    if (this.elapsedTime >= this.durationSeconds || this.courseProgress >= 1.0) {
      this.state = 'COMPLETED';
    }
  }

  public reset(): void {
    this.state = 'READY';
    this.elapsedTime = 0;
    this.courseProgress = 0;
  }

  public getState(): SessionState {
    return this.state;
  }

  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  public getRemainingTime(): number {
    return Math.max(0, this.durationSeconds - this.elapsedTime);
  }

  public getCourseProgress(): number {
    return this.courseProgress;
  }

  public getDurationSeconds(): number {
    return this.durationSeconds;
  }
}
