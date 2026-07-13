// =============================================================================
// FLOWSTATE — RouteId.cs
// Enum of all UI routes (screens, modals, overlays).
// =============================================================================

namespace Flowstate.UI.Navigation
{
    /// <summary>
    /// Identifies all UI navigation targets in FLOWSTATE.
    /// Separates full-screen, modal, overlay, and HUD navigation.
    /// </summary>
    public enum RouteId
    {
        // Full-screen navigation
        SplashScreen,
        MainMenuScreen,
        ModeSelectionScreen,
        GameplayScreen,
        ResultsScreen,
        ProfileScreen,
        LeaderboardScreen,
        CosmeticsScreen,
        SettingsScreen,

        // Modals
        PauseModal,
        ConfirmationModal,
        RewardModal,

        // Overlays
        LoadingOverlay,
        NotificationOverlay,

        // HUD
        GameplayHUD
    }

    /// <summary>
    /// Categorizes UI routes by their display behavior.
    /// </summary>
    public enum RouteType
    {
        /// <summary>Full-screen navigation — replaces current screen.</summary>
        Screen,
        /// <summary>Modal — overlays on top of current screen with dimming.</summary>
        Modal,
        /// <summary>Overlay — lightweight overlay without full dimming.</summary>
        Overlay,
        /// <summary>HUD — persistent gameplay UI.</summary>
        HUD
    }
}
