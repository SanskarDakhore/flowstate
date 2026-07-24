import * as React from 'react';
import { useState } from 'react';
import { Bot, Play, Sparkles, Zap, Activity } from 'lucide-react';

/**
 * FlowstateHudOverlay Props Interface
 */
export interface FlowstateHudOverlayProps {
  /** Callback fired when the user clicks 'BEGIN RUN' */
  onBeginRun?: () => void;
  /** Active status message inside the mascot widget */
  taskStatus?: string;
  /** Main body text from mascot message */
  taskDescription?: string;
  /** Optional custom hero title override */
  title?: string;
  /** Optional custom hero subtitle override */
  subtitle?: string;
  /** Optional current session build/stage label */
  labVersion?: string;
}

/**
 * Robot Avatar Component
 * Futuristic mascot with glowing cyan aura and pulse animations.
 */
export const RobotMascotAvatar: React.FC<{ isAnimated?: boolean }> = ({ isAnimated = true }) => {
  return (
    <div className="relative flex-shrink-0">
      {/* Ambient background glow aura */}
      <div 
        className={`absolute -inset-1 rounded-2xl bg-cyan-400/30 blur-md transition-opacity duration-500 ${
          isAnimated ? 'animate-pulse' : 'opacity-50'
        }`} 
      />

      {/* Robot Head Container */}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/50 bg-slate-950/90 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-transform duration-300 group-hover:scale-105">
        <Bot className="h-6 w-6 text-cyan-300 transition-transform duration-300 group-hover:rotate-6" />

        {/* Small Status Indicator Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[var(--flow-glow-cyan)]" />
        </span>
      </div>
    </div>
  );
};

/**
 * Mascot Task Card Component (Left Sidebar Widget)
 */
export const MascotWidgetCard: React.FC<{
  statusText: string;
  bodyText: string;
}> = ({ statusText, bodyText }) => {
  return (
    <div className="pointer-events-auto group relative max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)]">
      {/* Background scrim overlay for high contrast WebGL legibility */}
      <div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-slate-950/40 opacity-50"
        style={{ background: 'var(--flow-text-scrim, rgba(5, 8, 16, 0.45))' }}
      />

      <div className="relative z-10 flex items-start gap-3.5">
        <RobotMascotAvatar />

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_10px_rgba(0,243,255,0.1)]">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span className="truncate">{statusText}</span>
          </div>

          {/* Body Text */}
          <p className="text-xs leading-relaxed text-slate-200/90 font-sans tracking-wide">
            {bodyText}
          </p>

          {/* Activity Progress Line */}
          <div className="pt-1">
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 shadow-[var(--flow-glow-cyan)] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Interactive WebGL HUD Overlay Component for FLOWSTATE
 * Formatted cleanly with Tailwind CSS, Lucide React icons, and custom design tokens.
 */
export const FlowstateHudOverlay: React.FC<FlowstateHudOverlayProps> = ({
  onBeginRun,
  taskStatus = "Build project UI changes",
  taskDescription = "I'm going to keep moving with ASCII-bound...",
  title = "FLOWSTATE",
  subtitle = "A kinetic resonance run through the Living Valley",
  labVersion = "MOVEMENT LAB - 01",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between p-6 sm:p-8 md:p-10 select-none overflow-hidden font-sans">
      {/* Background Gradient Scrim for Legibility over 3D WebGL Canvas */}
      <div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/85" 
        style={{ backdropFilter: 'blur(1px)' }}
      />

      {/* ================= TOP HUD BAR ================= */}
      <header className="relative z-10 flex items-center justify-between w-full">
        {/* Left Branding / Identity */}
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400 shadow-[var(--flow-glow-cyan)]" />
          <div>
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase font-display drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              FLOWSTATE
            </h2>
            <p className="text-[9px] font-mono tracking-widest text-cyan-400/80">
              KINETIC ENGINE v0.1
            </p>
          </div>
        </div>

        {/* Top Center Status Badge */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/70 px-4 py-1 text-xs font-mono tracking-[0.25em] text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)] backdrop-blur-md uppercase">
            <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>{labVersion}</span>
          </div>
        </div>

        {/* Right Status / Telemetry Indicator */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>60 FPS</span>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center w-full my-auto gap-6">
        {/* Left Side: Mascot Widget */}
        <div className="md:col-span-4 flex justify-start">
          <MascotWidgetCard statusText={taskStatus} bodyText={taskDescription} />
        </div>

        {/* Center Hero: Title & Subtitle */}
        <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[0.25em] text-white drop-shadow-[0_0_35px_rgba(0,243,255,0.45)] uppercase font-display">
            {title}
          </h1>

          {/* Glowing Spectral Line Divider */}
          <div className="h-0.5 w-48 sm:w-64 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[var(--flow-glow-cyan)]" />

          <p className="max-w-md text-xs sm:text-sm tracking-wider text-cyan-200/90 font-medium leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        </div>

        {/* Right Side Spacer / Layout Balance */}
        <div className="hidden md:block md:col-span-4" />
      </main>

      {/* ================= BOTTOM ACTION CTA ================= */}
      <footer className="relative z-10 flex flex-col items-center justify-center w-full pb-2">
        <button
          type="button"
          onClick={onBeginRun}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto group relative flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-9 py-3.5 text-sm font-semibold tracking-[0.2em] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] active:scale-95 cursor-pointer uppercase font-display"
        >
          {/* Button background shimmer on hover */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Play Icon */}
          <Play
            className={`h-4 w-4 text-cyan-300 transition-transform duration-300 ${
              isHovered ? 'translate-x-1 scale-110 text-cyan-200 fill-cyan-200' : ''
            }`}
          />

          <span className="relative z-10 drop-shadow-[0_0_10px_rgba(0,243,255,0.6)]">
            BEGIN RUN
          </span>
        </button>

        {/* Bottom Input Guidance */}
        <p className="mt-3 text-[10px] font-mono tracking-widest text-slate-400/80 uppercase">
          PRESS <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">SPACE</kbd> OR CLICK TO COMMENCE
        </p>
      </footer>
    </div>
  );
};

export default FlowstateHudOverlay;
