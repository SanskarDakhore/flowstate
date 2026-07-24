---
Title: "Phase 01 Verification & Testing Commands"
Module: "00_PROJECT_CORE"
Status: In-Progress
Priority: Critical
Milestone: 1
Phase: "01.00"
Spec Version: 1.0.0
---

# Phase 01 Verification & Testing Commands

## Automated Verification Protocol
Run the following commands in order from workspace root:

```powershell
# 1. Check TypeScript compilation
npm run check

# 2. Run unit tests
npm test

# 3. Check for un-tokenized color hex codes
git grep -i -E "#[0-9a-f]{3,6}" -- "frontend/src/ui/*.ts" "frontend/src/ui/*.tsx"
```

Expected result: Zero diagnostic failures and zero un-tokenized hex code matches.
