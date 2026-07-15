import { Mesh, VertexBuffer } from '@babylonjs/core';

/**
 * Lightweight dependency-free value-noise + vertex displacement helpers.
 * Used once at mesh construction time to break up primitive silhouettes
 * (spheres/boxes/cylinders) into softer, hand-sculpted-looking landforms.
 * Not a true Perlin/Simplex implementation — smoothstep-interpolated hash
 * lattice noise is sufficient at this amplitude and is cheap to compute.
 */

function hash(n: number): number {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise3D(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const sx = smoothstep(x - ix);
  const sy = smoothstep(y - iy);
  const sz = smoothstep(z - iz);

  const corner = (cx: number, cy: number, cz: number) =>
    hash(cx * 127.1 + cy * 311.7 + cz * 74.7);

  const nx00 = lerp(corner(ix, iy, iz), corner(ix + 1, iy, iz), sx);
  const nx10 = lerp(corner(ix, iy + 1, iz), corner(ix + 1, iy + 1, iz), sx);
  const nx01 = lerp(corner(ix, iy, iz + 1), corner(ix + 1, iy, iz + 1), sx);
  const nx11 = lerp(corner(ix, iy + 1, iz + 1), corner(ix + 1, iy + 1, iz + 1), sx);

  const nxy0 = lerp(nx00, nx10, sy);
  const nxy1 = lerp(nx01, nx11, sy);

  return lerp(nxy0, nxy1, sz); // 0..1
}

/** Exposes the internal value-noise function for low-frequency color/placement variation elsewhere. */
export function sampleNoise3D(x: number, y: number, z: number): number {
  return noise3D(x, y, z);
}

/**
 * GLSL-style two-edge smoothstep (there is no `Math.smoothstep` in JS/TS).
 * Returns 0 below edge0, 1 above edge1, Hermite-eased in between.
 */
export function smoothstepEdge(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return smoothstep(t);
}

/** Deterministic small numeric seed derived from a string id, for reproducible per-instance variation. */
export function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (h % 1000) / 37;
}

/**
 * Deterministic pseudo-random value in [0, 1) derived from an id + salt.
 * Used for authored-but-varied placement (jitter within a patch, lean angle,
 * side bias, variant selection) so results are stable across rebuilds
 * without needing a stored random seed.
 */
export function seededUnit(id: string, salt: number = 0): number {
  const s = seedFromId(id) + salt * 12.9898;
  const v = Math.sin(s * 78.233) * 43758.5453123;
  return v - Math.floor(v);
}

export interface OrganicDisplacementOptions {
  /** Max world-unit offset along each vertex normal. */
  amplitude: number;
  /** Noise sampling frequency; lower = broader bumps, higher = finer texture. */
  frequency: number;
  /** Per-mesh seed offset so identical primitives don't deform identically. */
  seed: number;
}

/**
 * Displaces mesh vertices along their normals using 3D value noise, then
 * recomputes normals. Intended for static, one-time use at world build time
 * (not per-frame) — cost is proportional to vertex count only.
 */
export function applyOrganicDisplacement(mesh: Mesh, options: OrganicDisplacementOptions): void {
  const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
  const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
  if (!positions || !normals) return;

  const { amplitude, frequency, seed } = options;
  const displaced = new Float32Array(positions.length);

  for (let i = 0; i < positions.length; i += 3) {
    const px = positions[i];
    const py = positions[i + 1];
    const pz = positions[i + 2];

    const n = noise3D(
      px * frequency + seed,
      py * frequency + seed * 1.37,
      pz * frequency + seed * 0.71
    );
    const offset = (n - 0.5) * 2 * amplitude;

    displaced[i] = px + normals[i] * offset;
    displaced[i + 1] = py + normals[i + 1] * offset;
    displaced[i + 2] = pz + normals[i + 2] * offset;
  }

  mesh.updateVerticesData(VertexBuffer.PositionKind, displaced);
  mesh.createNormals(true);
}
