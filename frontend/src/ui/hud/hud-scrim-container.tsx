import React from 'react';
import { HUDScrimConfig, PlayerHUDState } from '@flowstate/shared';

export interface HudScrimContainerProps {
  playerState: PlayerHUDState;
  scrimConfig?: Partial<HUDScrimConfig>;
  children?: React.ReactNode;
}

export const HudScrimContainer: React.FC<HudScrimContainerProps> = ({
  playerState,
  scrimConfig,
  children,
}) => {
  const backdropColor = scrimConfig?.scrimColor ?? 'var(--flow-text-scrim)';
  const opacity = scrimConfig?.opacity ?? 0.85;

  return (
    <div className="flow-hud-root" data-testid="player-hud-container">
      {/* Top Scrim Gradient */}
      <div
        className="flow-scrim flow-scrim--top"
        style={{ backgroundColor: backdropColor, opacity }}
        data-testid="top-scrim-gradient"
      />

      {/* Minimalist Player HUD Header */}
      <div className="flow-hud-brand" data-testid="player-hud-header">
        <div className="flow-hud-brand__thread" />
        <div>
          <div className="flow-hud-brand__name">FLOWSTATE</div>
          <div className="flow-hud-brand__meta">
            {playerState.speedKmh.toFixed(0)} KM/H • RES {playerState.resonancePercent.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Children elements or scrim content */}
      {children}

      {/* Bottom Scrim Gradient */}
      <div
        className="flow-scrim flow-scrim--bottom"
        style={{ backgroundColor: backdropColor, opacity }}
        data-testid="bottom-scrim-gradient"
      />
    </div>
  );
};
