---
Title: "Phase 01 Emergency Rollback Protocol"
Module: "00_PROJECT_CORE"
Status: In-Progress
Priority: Critical
Milestone: 1
Phase: "01.00"
Spec Version: 1.0.0
---

# Phase 01 Emergency Rollback Protocol

## Trigger Conditions
- UI changes introduce compilation errors that cannot be resolved within phase time budget.
- Unintended regression to movement physics or camera trajectory occurs.

## Recovery Steps
```powershell
# Reset modified UI files to last clean git commit
git checkout HEAD -- frontend/src/ui/

# Verify clean workspace state
npm run check
```
