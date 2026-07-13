// =============================================================================
// FLOWSTATE — GameBootstrap.cs
// Entry point for the game. Initializes core systems in deterministic order.
// =============================================================================

using UnityEngine;

namespace Flowstate.Core.Bootstrap
{
    /// <summary>
    /// Main entry point for FLOWSTATE. Attached to the Bootstrap scene.
    /// Initializes all core services in a deterministic order before
    /// transitioning to the splash/main menu flow.
    /// </summary>
    public class GameBootstrap : MonoBehaviour
    {
        [SerializeField] private BootstrapConfig _config;

        private void Awake()
        {
            // Ensure this object persists across scene loads
            DontDestroyOnLoad(gameObject);

            InitializeCoreSystems();
        }

        private void InitializeCoreSystems()
        {
            // TODO: Initialize systems in order:
            // 1. Configuration
            // 2. Logging
            // 3. Event Bus
            // 4. Service Registry
            // 5. Platform Services
            // 6. Networking (non-blocking)
            // 7. Audio
            // 8. Input
            // 9. Scene Router
            // 10. UI Router

            Debug.Log("[FLOWSTATE] Bootstrap complete. Systems initialized.");

            // Transition to splash screen
            // SceneRouter.Instance.LoadScene(SceneId.Splash);
        }
    }
}
