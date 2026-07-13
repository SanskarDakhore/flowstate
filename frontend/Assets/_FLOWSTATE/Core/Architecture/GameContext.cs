// =============================================================================
// FLOWSTATE — GameContext.cs
// Holds references to shared game state accessible across systems.
// =============================================================================

namespace Flowstate.Core.Architecture
{
    /// <summary>
    /// Provides a shared context object for cross-system state.
    /// This is NOT a God object — it holds references, not logic.
    /// Systems access what they need through typed interfaces.
    /// </summary>
    public class GameContext
    {
        /// <summary>Current game phase (menu, playing, paused, results).</summary>
        public GamePhase CurrentPhase { get; set; } = GamePhase.None;

        /// <summary>Whether the game is currently in an active session.</summary>
        public bool IsInSession => CurrentPhase == GamePhase.Playing;

        /// <summary>Whether network connectivity is available.</summary>
        public bool IsOnline { get; set; }

        // TODO: Add references to active session, player profile, etc.
    }

    public enum GamePhase
    {
        None,
        Initializing,
        MainMenu,
        Loading,
        Playing,
        Paused,
        Results
    }
}
