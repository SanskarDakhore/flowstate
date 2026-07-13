// =============================================================================
// FLOWSTATE — SceneId.cs
// Enum of all navigable scenes in the game.
// =============================================================================

namespace Flowstate.Scenes
{
    /// <summary>
    /// Identifies all scenes in FLOWSTATE.
    /// Scene names must match the actual Unity scene file names.
    /// </summary>
    public enum SceneId
    {
        Bootstrap,
        Splash,
        MainMenu,
        ModeSelection,
        Gameplay,
        Results,
        Profile,
        Leaderboard,
        Cosmetics,
        Settings
    }
}
