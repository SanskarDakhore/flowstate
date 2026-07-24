export type TitleScreenStartCallback = () => void;

export class TitleScreen {
  private container: HTMLDivElement | null = null;
  private onStartCallback?: TitleScreenStartCallback;
  private isFading: boolean = false;

  constructor(onStart?: TitleScreenStartCallback) {
    this.onStartCallback = onStart;
    this.createDomElements();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('flow-title-screen-root');
    if (existing) existing.remove();

    this.container = document.createElement('div');
    this.container.id = 'flow-title-screen-root';
    this.container.className = 'flow-screen flow-title-screen';

    this.container.innerHTML = `
      <div class="flow-eyebrow flow-reveal" style="animation-delay: 0.05s;">MOVEMENT LAB &middot; 01</div>

      <div class="flow-title-lockup flow-reveal" style="animation-delay: 0.16s;">
        <div class="flow-title">FLOWSTATE</div>
        <div class="flow-title-mark" aria-hidden="true"></div>
        <p class="flow-title-subline">A kinetic resonance run through the Living Valley.</p>
      </div>

      <button id="flow-title-start" class="flow-action-button flow-title-cta flow-title-pulse" type="button">Begin Run</button>
    `;

    this.container.addEventListener('click', () => this.handleTap());
    this.container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleTap();
    });

    document.body.appendChild(this.container);
  }

  private handleTap(): void {
    if (this.isFading || !this.container) return;
    this.isFading = true;

    this.container.style.opacity = '0';

    const onFadeEnd = () => {
      this.dispose();
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    this.container.addEventListener('transitionend', onFadeEnd, { once: true });
    setTimeout(onFadeEnd, 350);
  }

  public dispose(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
