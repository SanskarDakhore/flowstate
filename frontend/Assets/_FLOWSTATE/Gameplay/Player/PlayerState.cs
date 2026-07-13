// =============================================================================
// FLOWSTATE — PlayerState.cs
// Runtime state of the player entity during a session.
// =============================================================================

namespace Flowstate.Gameplay.Player
{
    /// <summary>
    /// Tracks the runtime state of the player during a game session.
    /// This is session-scoped data, not persistent progression.
    /// </summary>
    [System.Serializable]
    public class PlayerState
    {
        public float Energy { get; set; }
        public int ComboCount { get; set; }
        public float HarmonyLevel { get; set; }
        public bool IsInFlowState { get; set; }
        public float SessionTime { get; set; }

        /// <summary>
        /// Reset state for a new session.
        /// </summary>
        public void Reset()
        {
            Energy = 0f;
            ComboCount = 0;
            HarmonyLevel = 0f;
            IsInFlowState = false;
            SessionTime = 0f;
        }
    }
}
