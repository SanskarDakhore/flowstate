import { Mesh, Scene, VertexData } from '@babylonjs/core';
import { seededUnit } from './organic-noise';

export interface GrassClumpOptions {
  /** Number of blades in the fan (arranged as crossed pairs for all-angle visibility). */
  bladeCount: number;
  baseHeight: number;
  heightJitter: number;
  baseWidth: number;
  /** 0..1, baked into vertex color G channel as a per-clump tint multiplier. */
  colorVariance: number;
  seed: number;
}

/**
 * Builds one grass clump as a small fan of tapered, crossed opaque quads (no
 * alpha-testing / no billboarding) — replaces the earlier tapered-cone tuft,
 * which read as a spike rather than grass. Blade vertex colors double as
 * shader data for the wind vertex shader in grass-wind-material.ts:
 *   R = per-blade wind phase offset (0..1 -> 0..2π)
 *   G = per-clump color variance multiplier
 *   A = height flex mask (0 at base, 1 at tip)
 */
export function buildGrassClump(name: string, scene: Scene, options: GrassClumpOptions): Mesh {
  const { bladeCount, baseHeight, heightJitter, baseWidth, colorVariance, seed } = options;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  for (let b = 0; b < bladeCount; b++) {
    const angle = (b / bladeCount) * Math.PI + (seededUnit(`${seed}`, b) - 0.5) * 0.4;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const height = baseHeight + (seededUnit(`${seed}`, b + 50) - 0.5) * 2 * heightJitter;
    const halfWidth = baseWidth * (0.85 + seededUnit(`${seed}`, b + 100) * 0.3) * 0.5;
    const tipWidth = halfWidth * 0.25;
    const phase = seededUnit(`${seed}`, b + 150);

    // Local-space blade corners (base-left, base-right, tip-right, tip-left)
    const local: [number, number, number][] = [
      [-halfWidth, 0, 0],
      [halfWidth, 0, 0],
      [tipWidth, height, 0],
      [-tipWidth, height, 0],
    ];

    const vertexStart = positions.length / 3;
    for (const [lx, ly, lz] of local) {
      // Rotate around Y so blades fan out around the clump center
      const wx = lx * cos - lz * sin;
      const wz = lx * sin + lz * cos;
      positions.push(wx, ly, wz);
      // Rotate the unrotated blade's (0,0,1) face normal by the same Y-rotation as the positions
      normals.push(-sin, 0, cos);
      const flex = ly > 0 ? 1 : 0;
      colors.push(phase, colorVariance, 0.5, flex);
    }
    uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
    indices.push(vertexStart, vertexStart + 1, vertexStart + 2, vertexStart, vertexStart + 2, vertexStart + 3);
  }

  const vertexData = new VertexData();
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  vertexData.colors = colors;
  vertexData.indices = indices;

  const mesh = new Mesh(name, scene);
  vertexData.applyToMesh(mesh, false);
  return mesh;
}
