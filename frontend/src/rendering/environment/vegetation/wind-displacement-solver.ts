export class WindDisplacementSolver {
  public computeVertexDisplacement(
    height: number,
    totalHeight: number,
    posX: number,
    posZ: number,
    timeSec: number,
    frequencyHz: number,
    amplitudeMeters: number
  ): { dx: number; dz: number } {
    if (totalHeight <= 0 || height <= 0) return { dx: 0, dz: 0 };

    const heightFactor = Math.pow(height / totalHeight, 2.0); // Quadratic stiffness bending
    const wave1 = Math.sin((frequencyHz * timeSec * 2.0 * Math.PI) + (0.5 * (posX + posZ)));
    const wave2 = Math.cos((frequencyHz * 0.7 * timeSec * 2.0 * Math.PI) + (0.3 * (posX - posZ)));

    const displacement = heightFactor * amplitudeMeters * (wave1 + 0.5 * wave2);

    return {
      dx: displacement * 0.707, // 45 degree wind angle
      dz: displacement * 0.707,
    };
  }
}
