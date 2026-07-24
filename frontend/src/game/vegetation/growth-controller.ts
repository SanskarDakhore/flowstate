import { BotanicalEcologySnapshot, VegetationGrowthState, WorldInputSnapshot } from '@flowstate/shared';
import { VegetationHealth } from './vegetation-health';
import { VegetationGrowthEngine } from './vegetation-growth-engine';
import { BotanicalLifecycleEngine } from './botanical-lifecycle-engine';
import { ForestSuccessionSolver } from './forest-succession-solver';
import { CanopyEcologySolver } from './canopy-ecology-solver';
import { WindTransportModel } from './wind-transport-model';
import { BotanicalMemoryRepository } from './botanical-memory-repository';
import { BotanicalTelemetryCalculator } from './botanical-telemetry';

export class GrowthController {
  private healthSystem = new VegetationHealth();
  private growthEngine = new VegetationGrowthEngine();
  private lifecycleEngine = new BotanicalLifecycleEngine();
  private successionSolver = new ForestSuccessionSolver();
  private canopySolver = new CanopyEcologySolver();
  private windModel = new WindTransportModel();
  private memoryRepository = new BotanicalMemoryRepository();
  private telemetryCalculator = new BotanicalTelemetryCalculator();

  public update(
    worldInput: Readonly<WorldInputSnapshot>,
    deltaTime: number,
    baseWindSpeed: number = 2.0,
    baseWindAngleRad: number = 0.0,
    isTrampled: boolean = false
  ): Readonly<VegetationGrowthState> {
    if (deltaTime <= 0) return this.getCurrentSnapshot();

    const health = this.healthSystem.update(
      worldInput.environmentEnergy,
      worldInput.harmony,
      worldInput.recovery,
      deltaTime
    );

    const { growth, bloom } = this.growthEngine.update(health, deltaTime);

    // Botanical memory persistence
    this.memoryRepository.updateMemory(growth, health, isTrampled, deltaTime);
    const soilRichness = this.memoryRepository.getSoilRichness();

    // 10-stage Plant life cycle progression
    const lifeStage = this.lifecycleEngine.update(
      health,
      growth,
      worldInput.harmony,
      soilRichness,
      deltaTime
    );

    // Long-term forest succession progression
    const successionStage = this.successionSolver.update(growth, health, worldInput.harmony, deltaTime);

    const leafDensity = 0.3 + (health * 0.7);
    const treeVitality = 0.5 + (health * 0.5);

    // Canopy shade microclimate solver
    const canopyMicroclimate = this.canopySolver.solve(treeVitality, leafDensity, successionStage);

    // Wind vector botanical transport
    const windVector = this.windModel.update(
      baseWindSpeed,
      baseWindAngleRad,
      bloom,
      canopyMicroclimate.windDampingFactor
    );

    // Telemetry metric calculation
    const telemetry = this.telemetryCalculator.compute(
      growth,
      health,
      bloom,
      lifeStage,
      successionStage,
      canopyMicroclimate.shadeFactor,
      soilRichness
    );

    return {
      growth,
      health,
      bloomProgress: bloom,
      flowerDensity: bloom * 1.0,
      leafDensity,
      grassHeight: 0.2 + (health * 0.8),
      treeVitality,
      colorVariation: health,
      lifeStage,
      successionStage,
      canopyCoverRatio: canopyMicroclimate.shadeFactor,
      mossCoverage: Math.min(1.0, 0.05 + (canopyMicroclimate.shadeFactor * 0.45)),
      soilRichness,
      pollinatorActivity: telemetry.pollinatorPopulation,
      windDispersalDensity: windVector.seedDriftRate,
      pathRecoveryRatio: this.memoryRepository.getPathRecoveryRatio(),
      ecologicalDiversityScore: telemetry.ecologicalDiversityScore,
      timestamp: Date.now(),
    };
  }

  public getFullEcologySnapshot(): BotanicalEcologySnapshot {
    const health = this.healthSystem.getHealth();
    const { growth, bloom } = this.growthEngine.update(health, 0);
    const successionStage = this.successionSolver.getSuccessionStage();
    const lifeStage = this.lifecycleEngine.getCurrentStage();
    const canopyMicroclimate = this.canopySolver.getCurrentMicroclimate();
    const windVector = this.windModel.getCurrentVector();
    const soilRichness = this.memoryRepository.getSoilRichness();

    const telemetry = this.telemetryCalculator.compute(
      growth,
      health,
      bloom,
      lifeStage,
      successionStage,
      canopyMicroclimate.shadeFactor,
      soilRichness
    );

    return {
      lifeStage,
      successionStage,
      canopyMicroclimate,
      windVector,
      telemetry,
      pathRecoveryRatio: this.memoryRepository.getPathRecoveryRatio(),
      soilRichness,
      timestamp: Date.now(),
    };
  }

  public getCurrentSnapshot(): VegetationGrowthState {
    const health = this.healthSystem.getHealth();
    const { growth, bloom } = this.growthEngine.update(health, 0);
    const lifeStage = this.lifecycleEngine.getCurrentStage();
    const successionStage = this.successionSolver.getSuccessionStage();
    const canopyMicroclimate = this.canopySolver.getCurrentMicroclimate();
    const soilRichness = this.memoryRepository.getSoilRichness();
    const telemetry = this.telemetryCalculator.getTelemetry();

    return {
      growth,
      health,
      bloomProgress: bloom,
      flowerDensity: bloom * 1.0,
      leafDensity: 0.3 + (health * 0.7),
      grassHeight: 0.2 + (health * 0.8),
      treeVitality: 0.5 + (health * 0.5),
      colorVariation: health,
      lifeStage,
      successionStage,
      canopyCoverRatio: canopyMicroclimate.shadeFactor,
      mossCoverage: Math.min(1.0, 0.05 + (canopyMicroclimate.shadeFactor * 0.45)),
      soilRichness,
      pollinatorActivity: telemetry.pollinatorPopulation,
      windDispersalDensity: this.windModel.getCurrentVector().seedDriftRate,
      pathRecoveryRatio: this.memoryRepository.getPathRecoveryRatio(),
      ecologicalDiversityScore: telemetry.ecologicalDiversityScore,
      timestamp: Date.now(),
    };
  }

  public getLifecycleEngine(): BotanicalLifecycleEngine {
    return this.lifecycleEngine;
  }

  public getSuccessionSolver(): ForestSuccessionSolver {
    return this.successionSolver;
  }

  public getCanopySolver(): CanopyEcologySolver {
    return this.canopySolver;
  }

  public getWindModel(): WindTransportModel {
    return this.windModel;
  }

  public getMemoryRepository(): BotanicalMemoryRepository {
    return this.memoryRepository;
  }

  public getTelemetryCalculator(): BotanicalTelemetryCalculator {
    return this.telemetryCalculator;
  }

  public reset(): void {
    this.healthSystem.reset();
    this.growthEngine.reset();
    this.lifecycleEngine.reset();
    this.successionSolver.reset();
    this.memoryRepository.reset();
  }
}
