// =============================================================================
// FLOWSTATE — BootstrapConfig.cs
// ScriptableObject holding bootstrap configuration values.
// =============================================================================

using UnityEngine;

namespace Flowstate.Core.Bootstrap
{
    /// <summary>
    /// Configuration for the bootstrap sequence.
    /// Create an instance via Assets > Create > Flowstate > Bootstrap Config.
    /// </summary>
    [CreateAssetMenu(fileName = "BootstrapConfig", menuName = "Flowstate/Bootstrap Config")]
    public class BootstrapConfig : ScriptableObject
    {
        [Header("Environment")]
        [Tooltip("Target API environment for this build")]
        public EnvironmentType Environment = EnvironmentType.Development;

        [Header("Features")]
        [Tooltip("Enable verbose debug logging")]
        public bool EnableDebugLogging = true;

        [Tooltip("Skip splash screen in development")]
        public bool SkipSplash = false;
    }

    public enum EnvironmentType
    {
        Development,
        Staging,
        Production
    }
}
