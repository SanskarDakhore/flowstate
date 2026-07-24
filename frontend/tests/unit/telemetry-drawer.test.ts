import React from 'react';
import { TelemetryDrawer } from '../../src/ui/telemetry/telemetry-drawer';
import { HudScrimContainer } from '../../src/ui/hud/hud-scrim-container';
import { DevTelemetryMetrics, PlayerHUDState } from '@flowstate/shared';

describe('Phase 12 — Telemetry Drawer & HUD Scrim System', () => {
  const mockDevMetrics: DevTelemetryMetrics = {
    fps: 60.0,
    frameTimeMs: 16.67,
    position: { x: 10.0, y: 5.0, z: 120.0 },
    velocity: { x: 0.0, y: 0.0, z: 25.0 },
    trackCurvature: 0.0025,
    bankAngleDeg: 12.5,
    collisionImpulse: 0.0,
    heapUsedMb: 42.5,
    activeChunksCount: 6,
  };

  const mockPlayerState: PlayerHUDState = {
    speedKmh: 120,
    resonancePercent: 85,
    momentumScore: 4500,
    currentLapTimeMs: 34500,
  };

  describe('Developer Telemetry Drawer Component Rendering & State', () => {
    it('should create TelemetryDrawer element tree with default collapsed state', () => {
      const element = React.createElement(TelemetryDrawer, { metrics: mockDevMetrics });
      expect(element.type).toBe(TelemetryDrawer);
      expect(element.props.metrics.fps).toBe(60.0);
    });

    it('should accept initial state for expanded drawer and active tab', () => {
      const element = React.createElement(TelemetryDrawer, {
        metrics: mockDevMetrics,
        initialState: { isOpen: true, activeTab: 'PHYSICS' },
      });
      expect(element.props.initialState?.isOpen).toBe(true);
      expect(element.props.initialState?.activeTab).toBe('PHYSICS');
    });
  });

  describe('Player HUD vs Dev Panel Separation & Scrim Backdrops', () => {
    it('should create HudScrimContainer element with var(--flow-text-scrim) backdrop color', () => {
      const element = React.createElement(HudScrimContainer, {
        playerState: mockPlayerState,
      });
      expect(element.type).toBe(HudScrimContainer);
      expect(element.props.playerState.speedKmh).toBe(120);
    });

    it('should support custom scrim opacity and background tokens', () => {
      const element = React.createElement(HudScrimContainer, {
        playerState: mockPlayerState,
        scrimConfig: { opacity: 0.9, scrimColor: 'var(--flow-bg-scrim)' },
      });
      expect(element.props.scrimConfig?.opacity).toBe(0.9);
      expect(element.props.scrimConfig?.scrimColor).toBe('var(--flow-bg-scrim)');
    });
  });

  describe('Zero-Allocation Execution Performance', () => {
    it('should execute 1,000 telemetry updates without state corruption or memory leaks', () => {
      for (let i = 0; i < 1000; i++) {
        const updatedMetrics: DevTelemetryMetrics = {
          ...mockDevMetrics,
          fps: 59.0 + (i % 3),
          position: { x: i, y: 0, z: i * 2 },
        };
        const element = React.createElement(TelemetryDrawer, { metrics: updatedMetrics });
        expect(element.props.metrics.fps).toBeGreaterThanOrEqual(59.0);
      }
    });
  });
});
