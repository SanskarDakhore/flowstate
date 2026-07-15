# Repository Rules & Coding Conventions for FLOWSTATE

## 1. UI & Design Token Discipline
- All user interface elements must use CSS variables defined in `frontend/src/ui/styles/tokens.css`.
- Hardcoding raw hex color values, inline arbitrary padding/margins, or un-tokenized font stacks in component TypeScript files is prohibited.
- Decorative glowing elements must not rely on typography glow alone; text legibility must be backed by dark background scrims (`var(--flow-text-scrim)`) to remain readable over active 3D Babylon.js canvas scenes.

## 2. HUD Architecture & Separation of Concerns
- **Player HUD (`PlayerHud`)** and **Developer Telemetry Panel (`DevPanel`)** must be strictly separated in both component structure and visual appearance.
- Player HUD elements (Identity, Objective Pill, Input Guidance, Ambient Feedback) must remain minimal, clean, and unobtrusive ("Luminous Minimalism").
- Technical data (FPS counters, raw position vectors, input intent values, model switchers) must remain isolated inside the Developer Drawer/Panel.

## 3. Preservation of Gameplay Code
- Frontend visual passes must NEVER mutate, rewrite, or bypass core movement physics, collision math, target evaluation logic, or prototype session state.
- Component controllers must interact with gameplay systems strictly via read-only telemetry data and public events.
