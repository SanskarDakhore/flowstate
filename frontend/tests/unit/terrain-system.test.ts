import { NullEngine, Scene, Vector3, Color3 } from '@babylonjs/core';
import { TerrainSystem } from '../../src/rendering/environment/terrain-system';
import { LIVING_VALLEY_BIOME_CONFIG, BiomeConfig } from '../../src/rendering/environment/biome-config';

describe('TerrainSystem 2.0 Unit & Invariant Tests', () => {
  let engine: NullEngine;
  let scene: Scene;

  beforeEach(() => {
    engine = new NullEngine();
    scene = new Scene(engine);
  });

  afterEach(() => {
    scene.dispose();
    engine.dispose();
  });

  it('should initialize TerrainSystem with default Living Valley biome configuration', () => {
    const terrainSystem = new TerrainSystem(scene, LIVING_VALLEY_BIOME_CONFIG);
    expect(terrainSystem.getMaterial()).toBeDefined();

    const mesh = terrainSystem.buildTerrain();
    expect(mesh).toBeDefined();
    expect(mesh.name).toBe('terrainSystemMesh');
    expect(mesh.receiveShadows).toBe(true);

    const positions = mesh.getVerticesData('position');
    expect(positions).not.toBeNull();
    expect(positions!.length).toBeGreaterThan(0);

    terrainSystem.dispose();
  });

  it('should support hot-swapping biome configurations dynamically', () => {
    const terrainSystem = new TerrainSystem(scene, LIVING_VALLEY_BIOME_CONFIG);
    terrainSystem.buildTerrain();

    const customBiome: BiomeConfig = {
      ...LIVING_VALLEY_BIOME_CONFIG,
      id: 'snow_peaks',
      name: 'Frostbite Peak',
      macroColor: {
        highTint: new Color3(0.9, 0.95, 1.0),
        lowTint: new Color3(0.6, 0.7, 0.8),
        noiseScale: 0.008,
      },
    };

    expect(() => terrainSystem.updateBiome(customBiome)).not.toThrow();

    terrainSystem.dispose();
  });

  it('should update lighting direction, key color, and ambient color uniforms', () => {
    const terrainSystem = new TerrainSystem(scene, LIVING_VALLEY_BIOME_CONFIG);
    terrainSystem.buildTerrain();

    const lightDir = new Vector3(-0.5, -0.8, 0.3);
    const lightCol = new Color3(1.0, 0.9, 0.7);
    const ambCol = new Color3(0.2, 0.25, 0.3);

    expect(() => terrainSystem.setLighting(lightDir, lightCol, ambCol)).not.toThrow();

    terrainSystem.dispose();
  });
});
