# Bootstrap

Entry point for the FLOWSTATE game client.

## Responsibility

- Initialize all core systems in a deterministic, ordered sequence
- Configure environment-specific settings
- Transition to the splash/main menu flow after initialization

## Key Files

- `GameBootstrap.cs` — MonoBehaviour attached to the Bootstrap scene
- `BootstrapConfig.cs` — ScriptableObject for bootstrap settings

## Rules

- The Bootstrap scene must be Scene 0 in Build Settings
- All service initialization happens here, not scattered across Awake/Start calls
- Bootstrap must not contain gameplay logic
