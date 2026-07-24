---
Title: "Known Limitations"
Module: "99_PROJECT_MEMORY"
Status: Active
Priority: Critical
Milestone: 1
Phase: "00.04"
Spec Version: 1.0.0
Owner: Antigravity IDE / Codex
Dependencies: [00_PROJECT_CORE, 98_CANON]
Provides: [Project Memory & Architectural Continuity]
Blocks: []
Estimated Work: 5 hours
Difficulty: High
Breaking Change: No
Last Updated: 2026-07-23
---

# Known Engine & System Limitations

## 1. Performance & Hardware Limitations
- **Mobile Thermal Throttling**: Extended play sessions (> 25 mins) on Tier 1 mobile GPUs trigger thermal throttling if particle counts exceed 5,000.
- **WebGL2 Context Restoration**: Canvas context loss on mobile backgrounding requires full mesh re-binding.

## 2. Rendering Limitations
- **Shadow Map Resolution**: Dynamic shadow maps are limited to 1024x1024 on mobile targets to preserve 60 FPS budget.

## 3. Physics Limitations
- **Single-Threaded Kinetics**: Physics calculations currently run on the main WebGL looper thread.

## 4. Tool & Workflow Limitations
- **Manual Spec Verification**: Phase prompt packages require explicit manual command invocation for verification.

## 5. Production Limitations
- **Monorepo Build Times**: Full monorepo typecheck requires ~3.5 seconds.
