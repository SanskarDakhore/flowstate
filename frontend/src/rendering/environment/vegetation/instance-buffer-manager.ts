export class InstanceBufferManager {
  private buffer: Float32Array = new Float32Array(0);

  public updateInstanceBuffer(instanceCount: number): Float32Array {
    const requiredLength = instanceCount * 16;
    if (this.buffer.length !== requiredLength) {
      this.buffer = new Float32Array(requiredLength);
      // Pre-fill identity matrices for instances
      for (let i = 0; i < instanceCount; i++) {
        const offset = i * 16;
        this.buffer[offset] = 1.0;     // m00
        this.buffer[offset + 5] = 1.0; // m11
        this.buffer[offset + 10] = 1.0; // m22
        this.buffer[offset + 15] = 1.0; // m33
      }
    }
    return this.buffer;
  }

  public getBuffer(): Float32Array {
    return this.buffer;
  }
}
