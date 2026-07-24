import { TrackFrameBasis, TrackSegmentMeshBuffers } from '@flowstate/shared';

export class RibbonMeshGenerator {
  public generateRibbonMesh(
    frames: ReadonlyArray<TrackFrameBasis>,
    bankAnglesRad?: ReadonlyArray<number>
  ): TrackSegmentMeshBuffers {
    const numFrames = frames.length;
    if (numFrames < 2) {
      return {
        positions: new Float32Array(0),
        normals: new Float32Array(0),
        uvs: new Float32Array(0),
        indices: new Uint32Array(0),
        vertexCount: 0,
        indexCount: 0,
      };
    }

    const numVertices = numFrames * 2; // Left & right vertices per frame
    const numQuads = numFrames - 1;
    const numIndices = numQuads * 6; // 2 triangles per quad = 6 indices

    const positions = new Float32Array(numVertices * 3);
    const normals = new Float32Array(numVertices * 3);
    const uvs = new Float32Array(numVertices * 2);
    const indices = new Uint32Array(numIndices);

    let vIdx = 0;
    let uvIdx = 0;
    let accumulatedDistance = 0.0;

    for (let i = 0; i < numFrames; i++) {
      const frame = frames[i];
      const bankAngle = bankAnglesRad ? (bankAnglesRad[i] ?? 0.0) : 0.0;

      if (i > 0) {
        const prevPos = frames[i - 1].position;
        const dx = frame.position.x - prevPos.x;
        const dy = frame.position.y - prevPos.y;
        const dz = frame.position.z - prevPos.z;
        accumulatedDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }

      // Rotate binormal & normal by bank angle around tangent
      const cosB = Math.cos(bankAngle);
      const sinB = Math.sin(bankAngle);

      // Banked Binormal
      const bX = frame.binormal.x * cosB + frame.normal.x * sinB;
      const bY = frame.binormal.y * cosB + frame.normal.y * sinB;
      const bZ = frame.binormal.z * cosB + frame.normal.z * sinB;

      // Banked Normal
      const nX = -frame.binormal.x * sinB + frame.normal.x * cosB;
      const nY = -frame.binormal.y * sinB + frame.normal.y * cosB;
      const nZ = -frame.binormal.z * sinB + frame.normal.z * cosB;

      const halfW = frame.width * 0.5;

      // Left vertex position
      positions[vIdx * 3 + 0] = frame.position.x - bX * halfW;
      positions[vIdx * 3 + 1] = frame.position.y - bY * halfW;
      positions[vIdx * 3 + 2] = frame.position.z - bZ * halfW;

      normals[vIdx * 3 + 0] = nX;
      normals[vIdx * 3 + 1] = nY;
      normals[vIdx * 3 + 2] = nZ;

      uvs[uvIdx * 2 + 0] = 0.0;
      uvs[uvIdx * 2 + 1] = accumulatedDistance * 0.1;

      vIdx++;
      uvIdx++;

      // Right vertex position
      positions[vIdx * 3 + 0] = frame.position.x + bX * halfW;
      positions[vIdx * 3 + 1] = frame.position.y + bY * halfW;
      positions[vIdx * 3 + 2] = frame.position.z + bZ * halfW;

      normals[vIdx * 3 + 0] = nX;
      normals[vIdx * 3 + 1] = nY;
      normals[vIdx * 3 + 2] = nZ;

      uvs[uvIdx * 2 + 0] = 1.0;
      uvs[uvIdx * 2 + 1] = accumulatedDistance * 0.1;

      vIdx++;
      uvIdx++;
    }

    // Index buffer generation for track quads
    let iIdx = 0;
    for (let q = 0; q < numQuads; q++) {
      const row1 = q * 2;
      const row2 = (q + 1) * 2;

      // Triangle 1
      indices[iIdx++] = row1 + 0;
      indices[iIdx++] = row2 + 0;
      indices[iIdx++] = row1 + 1;

      // Triangle 2
      indices[iIdx++] = row1 + 1;
      indices[iIdx++] = row2 + 0;
      indices[iIdx++] = row2 + 1;
    }

    return {
      positions,
      normals,
      uvs,
      indices,
      vertexCount: numVertices,
      indexCount: numIndices,
    };
  }
}
