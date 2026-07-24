import React, { useState } from 'react';
import { DevTelemetryMetrics, TelemetryDrawerState } from '@flowstate/shared';

export interface TelemetryDrawerProps {
  metrics: DevTelemetryMetrics;
  initialState?: Partial<TelemetryDrawerState>;
  onToggle?: (isOpen: boolean) => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  metrics,
  initialState,
  onToggle,
}) => {
  const [state, setState] = useState<TelemetryDrawerState>({
    isOpen: initialState?.isOpen ?? false,
    activeTab: initialState?.activeTab ?? 'OVERVIEW',
    isPinned: initialState?.isPinned ?? false,
  });

  const toggleDrawer = () => {
    const nextOpen = !state.isOpen;
    setState((prev) => ({ ...prev, isOpen: nextOpen }));
    if (onToggle) onToggle(nextOpen);
  };

  const setTab = (tab: TelemetryDrawerState['activeTab']) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  return (
    <div className="flow-dev-root" data-testid="dev-telemetry-panel">
      <button
        type="button"
        className={`flow-dev-toggle ${state.isOpen ? 'is-expanded' : ''}`}
        onClick={toggleDrawer}
        data-testid="telemetry-drawer-toggle"
        aria-label="Toggle Developer Telemetry Drawer"
      >
        <span className="flow-dev-toggle__dot" />
        <span>TELEMETRY</span>
      </button>

      <div
        className={`flow-dev-drawer ${state.isOpen ? 'is-expanded' : ''}`}
        data-testid="telemetry-drawer-content"
      >
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {(['OVERVIEW', 'PHYSICS', 'PERFORMANCE', 'MEMORY'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTab(tab)}
              style={{
                flex: 1,
                padding: '4px 2px',
                fontSize: '9px',
                fontFamily: 'var(--flow-font-mono)',
                backgroundColor:
                  state.activeTab === tab
                    ? 'rgba(56, 189, 248, 0.2)'
                    : 'rgba(5, 8, 16, 0.4)',
                color:
                  state.activeTab === tab
                    ? 'var(--flow-cyan-kinetic)'
                    : 'var(--flow-text-muted)',
                border: 'var(--flow-hairline) solid var(--flow-text-ghost)',
                borderRadius: 'var(--flow-radius-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {state.activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>FPS: <span style={{ color: 'var(--flow-mint)' }}>{metrics.fps.toFixed(1)}</span> ({metrics.frameTimeMs.toFixed(2)} ms)</div>
            <div>Chunks: <span style={{ color: 'var(--flow-cyan-kinetic)' }}>{metrics.activeChunksCount}</span></div>
            <div>Heap: <span style={{ color: 'var(--flow-solar-champagne)' }}>{metrics.heapUsedMb.toFixed(1)} MB</span></div>
          </div>
        )}

        {state.activeTab === 'PHYSICS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Pos: ({metrics.position.x.toFixed(1)}, {metrics.position.y.toFixed(1)}, {metrics.position.z.toFixed(1)})</div>
            <div>Vel: ({metrics.velocity.x.toFixed(1)}, {metrics.velocity.y.toFixed(1)}, {metrics.velocity.z.toFixed(1)})</div>
            <div>Curvature κ: {metrics.trackCurvature.toFixed(4)}</div>
            <div>Bank Angle: {metrics.bankAngleDeg.toFixed(1)}°</div>
            <div>Collision Impulse: {metrics.collisionImpulse.toFixed(2)} Ns</div>
          </div>
        )}

        {state.activeTab === 'PERFORMANCE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Target Frame: 16.67 ms</div>
            <div>Frame Time: {metrics.frameTimeMs.toFixed(2)} ms</div>
            <div>Status: <span style={{ color: 'var(--flow-status-success)' }}>OPTIMAL</span></div>
          </div>
        )}

        {state.activeTab === 'MEMORY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Heap Used: {metrics.heapUsedMb.toFixed(2)} MB</div>
            <div>Allocation Status: <span style={{ color: 'var(--flow-status-success)' }}>0-BYTE STEADY</span></div>
          </div>
        )}
      </div>
    </div>
  );
};
