import { PlayerMovement } from './player-movement';
import { PlayerStats } from './player-state';
import { NormalizedGameCommand } from '../input/input-types';

export class PlayerController {
  public readonly movement = new PlayerMovement();
  private stats: PlayerStats = {
    energy: 100,
    maxEnergy: 100,
    comboCount: 0,
    harmonyLevel: 0,
    score: 0,
  };

  public processCommand(command: NormalizedGameCommand): void {
    if (command.deltaX !== undefined && command.deltaY !== undefined) {
      this.movement.setVelocity(command.deltaX * 2, command.deltaY * 2);
    }
  }

  public update(deltaTimeSeconds: number): void {
    this.movement.update(deltaTimeSeconds);
  }

  public getStats(): PlayerStats {
    return { ...this.stats };
  }
}
