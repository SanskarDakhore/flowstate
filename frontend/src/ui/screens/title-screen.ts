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

    // Clean up existing Title Screen instance
    const existing = document.getElementById('flow-title-screen-root');
    if (existing) existing.remove();

    // Ensure pulse keyframe animation style exists
    this.injectKeyframeStyles();

    this.container = document.createElement('div');
    this.container.id = 'flow-title-screen-root';

    const s = this.container.style;
    s.position = 'fixed';
    s.top = '0';
    s.left = '0';
    s.width = '100%';
    s.height = '100%';
    s.zIndex = '950';
    s.pointerEvents = 'auto';
    s.cursor = 'pointer';
    s.display = 'flex';
    s.flexDirection = 'column';
    s.alignItems = 'center';
    s.justifyContent = 'space-between';
    s.paddingTop = 'calc(var(--flow-safe-top) + 12vh)';
    s.paddingBottom = 'calc(var(--flow-safe-bottom) + 8vh)';
    s.paddingLeft = 'var(--flow-safe-left)';
    s.paddingRight = 'var(--flow-safe-right)';
    s.background = 'transparent';
    s.boxSizing = 'border-box';
    s.userSelect = 'none';
    s.opacity = '1';
    s.transition = 'opacity var(--flow-transition-normal)';

    this.container.innerHTML = `
      <!-- Top Sub-Header Badge -->
      <div style="
        font-family: var(--flow-font-mono);
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.25em;
        color: var(--flow-cyan-kinetic);
        text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        opacity: 0.85;
        text-transform: uppercase;
      ">MOVEMENT LAB &middot; 01</div>

      <!-- Center Title Group -->
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
      ">
        <div style="
          font-family: var(--flow-font-display);
          font-size: clamp(36px, 10vw, 64px);
          font-weight: 800;
          letter-spacing: 0.35em;
          color: var(--flow-text-primary);
          text-shadow: 0 0 30px rgba(56, 189, 248, 0.5), 0 0 60px rgba(56, 189, 248, 0.2);
          margin-left: 0.35em;
          text-transform: uppercase;
        ">FLOWSTATE</div>

        <div style="
          width: 60px;
          height: var(--flow-hairline);
          background: linear-gradient(90deg, transparent, var(--flow-cyan-kinetic), transparent);
          box-shadow: var(--flow-glow-cyan);
        "></div>
      </div>

      <!-- Bottom Softly Pulsing Prompt -->
      <div style="
        font-family: var(--flow-font-mono);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.25em;
        color: var(--flow-text-muted);
        animation: flow-title-pulse 2.4s ease-in-out infinite;
        text-transform: uppercase;
      ">[ TAP TO RESONATE ]</div>
    `;

    // Tap / Click Handler
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

    // Trigger smooth opacity fade-out
    this.container.style.opacity = '0';

    const onFadeEnd = () => {
      this.dispose();
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    // Callback on transition end or fallback timer
    this.container.addEventListener('transitionend', onFadeEnd, { once: true });
    setTimeout(onFadeEnd, 350);
  }

  private injectKeyframeStyles(): void {
    if (document.getElementById('flow-title-keyframes')) return;

    const style = document.createElement('style');
    style.id = 'flow-title-keyframes';
    style.textContent = `
      @keyframes flow-title-pulse {
        0%, 100% {
          opacity: 0.35;
          transform: translateY(0) scale(0.98);
        }
        50% {
          opacity: 0.9;
          transform: translateY(-2px) scale(1.02);
          color: var(--flow-text-primary);
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }
      }
    `;
    document.head.appendChild(style);
  }

  public dispose(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
