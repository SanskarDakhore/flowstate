import {
  EcosystemConfig,
  EcosystemGrowthStage,
  EcosystemState,
  EnvironmentalVariables,
  FloraNodeState,
  GrowthEventResult,
} from '@flowstate/shared';

export const DEFAULT_ECOSYSTEM_CONFIG: EcosystemConfig = {
  maxNodes: 64,
  growthRateMultiplier: 1.0,
  decayRatePerSec: 0.1,
};

export class EcosystemGrowthStateMachine {
  private config: EcosystemConfig;
  private nodes: Map<string, FloraNodeState> = new Map();

  constructor(config: EcosystemConfig = DEFAULT_ECOSYSTEM_CONFIG) {
    this.config = config;
  }

  public registerFloraNode(nodeId: string, initialStage: EcosystemGrowthStage = 'SEED'): FloraNodeState {
    const node: FloraNodeState = {
      nodeId,
      stage: initialStage,
      growthProgress: 0.0,
      health: 1.0,
      floraDensity: this.getDensityForStage(initialStage),
    };
    this.nodes.set(nodeId, node);
    return node;
  }

  public stepSimulation(env: EnvironmentalVariables, deltaTimeSeconds: number = 0.016): GrowthEventResult[] {
    const results: GrowthEventResult[] = [];

    this.nodes.forEach((node, nodeId) => {
      const prevStage = node.stage;
      let newStage = node.stage;
      let progress = node.growthProgress;
      let health = node.health;

      // Environmental growth viability score
      const viability = env.moisture * 0.3 + env.sunlight * 0.3 + (env.kineticEnergy / 100.0) * 0.4;

      if (viability > 0.3) {
        // Growth progression
        progress += viability * this.config.growthRateMultiplier * deltaTimeSeconds;
        health = Math.min(1.0, health + 0.1 * deltaTimeSeconds);

        if (progress >= 1.0) {
          switch (node.stage) {
            case 'SEED':
              if (env.moisture >= 0.25 && env.kineticEnergy >= 10.0) {
                newStage = 'SPROUT';
                progress = 0.0;
              }
              break;
            case 'SPROUT':
              if (env.sunlight >= 0.35 && env.kineticEnergy >= 25.0) {
                newStage = 'FLORA_BLOOM';
                progress = 0.0;
              }
              break;
            case 'FLORA_BLOOM':
              if (env.kineticEnergy >= 70.0 && env.sunlight >= 0.5) {
                newStage = 'OVERGROWN_CANOPY';
                progress = 1.0;
              }
              break;
            case 'OVERGROWN_CANOPY':
              progress = 1.0;
              break;
          }
        }
      } else {
        // Environmental decay
        health = Math.max(0.0, health - this.config.decayRatePerSec * deltaTimeSeconds);
        progress = Math.max(0.0, progress - 0.2 * deltaTimeSeconds);

        if (health === 0.0 && progress === 0.0) {
          switch (node.stage) {
            case 'OVERGROWN_CANOPY':
              newStage = 'FLORA_BLOOM';
              progress = 0.8;
              break;
            case 'FLORA_BLOOM':
              newStage = 'SPROUT';
              progress = 0.8;
              break;
            case 'SPROUT':
              newStage = 'SEED';
              progress = 0.0;
              break;
          }
          health = 0.5;
        }
      }

      const stageChanged = newStage !== prevStage;
      const updatedNode: FloraNodeState = {
        nodeId,
        stage: newStage,
        growthProgress: progress,
        health,
        floraDensity: this.getDensityForStage(newStage),
      };

      this.nodes.set(nodeId, updatedNode);

      if (stageChanged) {
        results.push({
          nodeId,
          previousStage: prevStage,
          currentStage: newStage,
          stageChanged: true,
        });
      }
    });

    return results;
  }

  private getDensityForStage(stage: EcosystemGrowthStage): number {
    switch (stage) {
      case 'SEED':
        return 0.1;
      case 'SPROUT':
        return 0.35;
      case 'FLORA_BLOOM':
        return 0.75;
      case 'OVERGROWN_CANOPY':
        return 1.0;
    }
  }

  public getEcosystemState(): EcosystemState {
    if (this.nodes.size === 0) {
      return {
        activeNodesCount: 0,
        dominantStage: 'SEED',
        averageHealth: 1.0,
        globalFloraDensity: 0.1,
        momentumMultiplier: 1.0,
      };
    }

    let totalHealth = 0;
    let totalDensity = 0;
    const stageCounts: Record<EcosystemGrowthStage, number> = {
      SEED: 0,
      SPROUT: 0,
      FLORA_BLOOM: 0,
      OVERGROWN_CANOPY: 0,
    };

    this.nodes.forEach((node) => {
      totalHealth += node.health;
      totalDensity += node.floraDensity;
      stageCounts[node.stage]++;
    });

    const nodeCount = this.nodes.size;
    const avgDensity = totalDensity / nodeCount;

    // Find dominant stage
    let dominantStage: EcosystemGrowthStage = 'SEED';
    let maxCount = -1;
    (Object.keys(stageCounts) as EcosystemGrowthStage[]).forEach((stage) => {
      if (stageCounts[stage] > maxCount) {
        maxCount = stageCounts[stage];
        dominantStage = stage;
      }
    });

    // Momentum multiplier scales from 1.0x to 1.25x based on global flora density
    const momentumMultiplier = 1.0 + avgDensity * 0.25;

    return {
      activeNodesCount: nodeCount,
      dominantStage,
      averageHealth: totalHealth / nodeCount,
      globalFloraDensity: avgDensity,
      momentumMultiplier,
    };
  }
}
