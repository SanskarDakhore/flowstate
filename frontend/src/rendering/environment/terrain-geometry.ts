import { Scene, MeshBuilder, Mesh, Vector3 } from '@babylonjs/core';
import { BiomeConfig } from './biome-config';
import { FlowPath } from '../../game/movement/flow-path';
import { sampleNoise3D } from './organic-noise';
import { GOLDEN_HOUR_VALLEY_PALETTE } from './living-valley-config';

export interface GroundInjectionPoint {
  x: number;
  z: number;
  radius: number;
  strength: number;
}

export class TerrainGeometry {
  /**
   * Generates a track-aware procedural terrain ribbon mesh using Babylon.js MeshBuilder.CreateRibbon.
   * Smoothly embeds the playable FlowPath ribbon into natural landforms using an SDF distance pass.
   */
  public static createTerrainMesh(
    name: string,
    scene: Scene,
    width: number,
    length: number,
    subdivisionsX: number,
    subdivisionsZ: number,
    baseDepth: number,
    config: BiomeConfig,
    flowPath?: FlowPath,
    injectionPoints: GroundInjectionPoint[] = []
  ): Mesh {
    const paths: Vector3[][] = [];
    const colors: number[] = [];
    const groundInjection: number[] = [];
    const halfWidth = width * 0.5;

    const floorColor = GOLDEN_HOUR_VALLEY_PALETTE.sage;
    const slopeColor = GOLDEN_HOUR_VALLEY_PALETTE.landformBluff;
    const rimColor = GOLDEN_HOUR_VALLEY_PALETTE.fog;

    for (let r = 0; r <= subdivisionsX; r++) {
      const rowPath: Vector3[] = [];
      const u = r / subdivisionsX; // 0..1 across lateral width
      const offsetFactor = (u - 0.5) * 2; // -1..+1
      const t = Math.min(1, Math.abs(offsetFactor)); // 0 at track center -> 1 at outer rim
      const isRight = offsetFactor >= 0;

      // Eased wall rise curve: flat near track, climbing towards outer rim
      const riseCurve = Math.pow(t, 2.1);
      const maxWallHeight = isRight ? 95 : 78;
      const wallRise = riseCurve * maxWallHeight;

      for (let c = 0; c <= subdivisionsZ; c++) {
        const progress = c / subdivisionsZ;
        let trackX = 0;
        let trackY = 0;
        let trackZ = (progress - 0.5) * length;
        let rightVec = new Vector3(1, 0, 0);

        if (flowPath) {
          const trackPoint = flowPath.getPosition(progress);
          const trackFrame = flowPath.getTrackFrame(progress);
          trackX = trackPoint.x;
          trackY = trackPoint.y;
          trackZ = trackPoint.z;
          rightVec = new Vector3(trackFrame.right.x, trackFrame.right.y, trackFrame.right.z);
        }

        // 1. Natural Elevation (Rolling Hills & Valleys)
        let naturalHeight =
          Math.sin((trackX + offsetFactor * halfWidth) * config.elevation.noiseScale) *
          Math.cos(trackZ * config.elevation.noiseScale) *
          config.elevation.heightScale;

        // Secondary noise octave
        naturalHeight +=
          (sampleNoise3D(trackX * 0.012 + (isRight ? 31.7 : 4.3), 0, trackZ * 0.012) - 0.5) *
          14 *
          t;

        // Section depth variation
        const sectionDepth = Math.sin(progress * Math.PI * 2) * 6;

        let vx = trackX + rightVec.x * (offsetFactor * halfWidth);
        let vy = Math.min(trackY - 12.0, baseDepth) + wallRise + naturalHeight + sectionDepth;
        let vz = trackZ + rightVec.z * (offsetFactor * halfWidth);

        // 2. Track-Aware Carving (SDF distance pass around playable ribbon)
        if (flowPath) {
          const dx = vx - trackX;
          const dz = vz - trackZ;
          const distToTrack = Math.sqrt(dx * dx + dz * dz);

          // Smoothly flatten terrain directly beneath track to prevent clipping/floating
          const trackBlend = Math.min(1.0, Math.max(0.0, (distToTrack - 4.0) / 10.0));
          const trackTargetY = trackY - 1.2;
          vy = trackTargetY + (vy - trackTargetY) * trackBlend;
        }

        rowPath.push(new Vector3(vx, vy, vz));

        // Vertex colors: floor -> rising slope -> rim (fades toward atmospheric fog haze)
        let cr: number, cg: number, cb: number;
        if (riseCurve < 0.45) {
          const f = riseCurve / 0.45;
          cr = floorColor.r + (slopeColor.r - floorColor.r) * f;
          cg = floorColor.g + (slopeColor.g - floorColor.g) * f;
          cb = floorColor.b + (slopeColor.b - floorColor.b) * f;
        } else {
          const f = (riseCurve - 0.45) / 0.55;
          cr = slopeColor.r + (rimColor.r - slopeColor.r) * f;
          cg = slopeColor.g + (rimColor.g - slopeColor.g) * f;
          cb = slopeColor.b + (rimColor.b - slopeColor.b) * f;
        }

        const breakup = (sampleNoise3D(vx * 0.012, 0, vz * 0.012) - 0.5) * 0.16;
        colors.push(
          Math.max(0, Math.min(1, cr + breakup)),
          Math.max(0, Math.min(1, cg + breakup)),
          Math.max(0, Math.min(1, cb + breakup)),
          riseCurve
        );

        // Ground injection (nearby rocks/trees force soil exposure)
        let injection = 0;
        for (const p of injectionPoints) {
          const idx = vx - p.x;
          const idz = vz - p.z;
          const dist = Math.sqrt(idx * idx + idz * idz);
          const falloff = Math.max(0, 1 - dist / p.radius) * p.strength;
          if (falloff > injection) injection = falloff;
        }
        groundInjection.push(injection);
      }
      paths.push(rowPath);
    }

    const mesh = MeshBuilder.CreateRibbon(
      name,
      {
        pathArray: paths,
      },
      scene
    );

    mesh.setVerticesData('color', colors);
    mesh.setVerticesData('groundInjection', groundInjection, false, 1);
    mesh.receiveShadows = true;

    return mesh;
  }
}
