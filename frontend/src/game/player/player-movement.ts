import { PlayerTransform } from './player-state';

export class PlayerMovement {
  private transform: PlayerTransform = {
    positionX: 0,
    positionY: 0,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
  };

  public update(deltaTimeSeconds: number): PlayerTransform {
    this.transform.positionX += this.transform.velocityX * deltaTimeSeconds;
    this.transform.positionY += this.transform.velocityY * deltaTimeSeconds;
    return this.transform;
  }

  public setVelocity(vx: number, vy: number): void {
    this.transform.velocityX = vx;
    this.transform.velocityY = vy;
  }

  public getTransform(): PlayerTransform {
    return { ...this.transform };
  }
}
