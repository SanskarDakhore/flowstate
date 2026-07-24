import { BotanicalEcologySnapshot } from '@flowstate/shared';

export class BotanicalDebugOverlay {
  private container: HTMLDivElement | null = null;
  private isVisible: boolean = false;

  constructor() {
    this.createDomElements();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('flow-botanical-debug-root');
    if (existing) existing.remove();

    this.container = document.createElement('div');
    this.container.id = 'flow-botanical-debug-root';
    this.container.className = 'flow-botanical-debug-root';

    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      width: '280px',
      background: 'var(--flow-text-scrim)',
      backdropFilter: 'blur(16px)',
      webkitBackdropFilter: 'blur(16px)',
      border: 'var(--flow-hairline) solid var(--flow-cyan-kinetic)',
      borderRadius: '8px',
      padding: '12px',
      color: 'var(--flow-text-muted)',
      fontFamily: 'var(--flow-font-mono)',
      fontSize: '10px',
      lineHeight: '1.4',
      boxShadow: '0 8px 32px var(--flow-bg-scrim)',
      display: 'none',
      flexDirection: 'column',
      gap: '6px',
      pointerEvents: 'auto',
      zIndex: '9999',
      boxSizing: 'border-box',
    });

    document.body.appendChild(this.container);
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
    if (this.container) {
      this.container.style.display = this.isVisible ? 'flex' : 'none';
    }
  }

  public update(snapshot: Readonly<BotanicalEcologySnapshot>): void {
    if (!this.container || !this.isVisible) return;

    const { lifeStage, successionStage, canopyMicroclimate, windVector, telemetry, pathRecoveryRatio, soilRichness } = snapshot;

    this.container.innerHTML = `
      <div style="font-weight: 700; color: var(--flow-cyan-kinetic); border-bottom: var(--flow-hairline) solid var(--flow-text-ghost); padding-bottom: 4px; font-size: 10px; letter-spacing: 0.08em;">
        BOTANICAL ECOLOGY TELEMETRY
      </div>
      <div><strong>Life Stage:</strong> <span style="color: var(--flow-solar-champagne); font-weight: 700;">${lifeStage}</span></div>
      <div><strong>Succession:</strong> <span style="color: var(--flow-cyan-kinetic); font-weight: 700;">${successionStage}</span></div>
      
      <div style="background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; display: flex; flex-direction: column; gap: 2px;">
        <div><strong>Total Biomass:</strong> ${(telemetry.totalBiomass * 100).toFixed(1)}%</div>
        <div><strong>Bloom Ratio:</strong> ${(telemetry.flowerBloomRatio * 100).toFixed(1)}%</div>
        <div><strong>Canopy Cover:</strong> ${(telemetry.canopyCoverRatio * 100).toFixed(1)}%</div>
        <div><strong>Pollinators:</strong> ${(telemetry.pollinatorPopulation * 100).toFixed(1)}%</div>
        <div><strong>Forest Maturity:</strong> ${(telemetry.forestMaturity * 100).toFixed(1)}%</div>
        <div><strong>Diversity Score:</strong> ${(telemetry.ecologicalDiversityScore * 100).toFixed(1)}%</div>
      </div>

      <div style="background: var(--flow-bg-scrim); padding: 6px; border-radius: 4px; display: flex; flex-direction: column; gap: 2px;">
        <div><strong>Canopy Shade:</strong> ${(canopyMicroclimate.shadeFactor * 100).toFixed(0)}% (-${canopyMicroclimate.temperatureDropC.toFixed(1)}°C)</div>
        <div><strong>Soil Richness:</strong> ${(soilRichness * 100).toFixed(1)}%</div>
        <div><strong>Path Recovery:</strong> ${(pathRecoveryRatio * 100).toFixed(0)}%</div>
        <div><strong>Wind Velocity:</strong> ${windVector.velocityMs.toFixed(1)} m/s (Drift: ${windVector.seedDriftRate.toFixed(2)})</div>
      </div>
    `;
  }

  public dispose(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
